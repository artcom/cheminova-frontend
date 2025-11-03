import { fetchCharacterMetadata } from "@/api/djangoApi"
import { useCharactersFromAll } from "@/api/hooks"
import { uploadImage } from "@/api/uploadImage"
import { DEFAULT_LANGUAGE } from "@/config/language"
import useGlobalState from "@/hooks/useGlobalState"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"

const normalizeCharacterName = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : ""

const extractCharacterEntries = (metadata) => {
  if (!metadata) return []

  const source = Array.isArray(metadata)
    ? metadata
    : Array.isArray(metadata?.results)
      ? metadata.results
      : []

  return source.flatMap((entry) =>
    Array.isArray(entry?.characters) ? entry.characters : [],
  )
}

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  const { currentCharacterIndex } = useGlobalState()
  const { data: charactersData } = useCharactersFromAll()
  const { i18n } = useTranslation()
  const locale = i18n.language || DEFAULT_LANGUAGE
  const lastUploadedCharacterSlugRef = useRef(null)

  const { data: characterMetadata, isLoading: isCharacterMetadataLoading } =
    useQuery({
      queryKey: ["character-metadata", locale],
      queryFn: () => fetchCharacterMetadata(locale),
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      enabled: Boolean(locale),
    })

  const slugLookup = useMemo(() => {
    const lookup = new Map()
    const entries = extractCharacterEntries(characterMetadata)

    entries.forEach((entry) => {
      const nameKey = normalizeCharacterName(entry?.name)
      const slugValue = typeof entry?.slug === "string" ? entry.slug.trim() : ""

      if (nameKey && slugValue) {
        lookup.set(nameKey, slugValue)
      }
    })

    return lookup
  }, [characterMetadata])

  const currentCharacter = charactersData?.[currentCharacterIndex]

  const resolveCharacterSlug = () => {
    if (!currentCharacter) {
      return ""
    }

    const directSlug =
      typeof currentCharacter.slug === "string"
        ? currentCharacter.slug.trim()
        : ""

    if (directSlug) {
      return directSlug
    }

    const normalizedName = normalizeCharacterName(currentCharacter.name)
    if (!normalizedName) {
      return ""
    }

    return slugLookup.get(normalizedName) || ""
  }

  return useMutation({
    mutationFn: async ({ file, text, userName }) => {
      const resolvedSlug = resolveCharacterSlug()

      console.log("🔍 Upload Debug:", {
        resolvedSlug,
        currentCharacterIndex,
        currentCharacter,
        charactersData: charactersData?.length,
      })

      if (!resolvedSlug) {
        if (isCharacterMetadataLoading) {
          throw new Error(
            "Character details are still loading. Please try again in a moment.",
          )
        }

        throw new Error("No character slug available for upload")
      }

      lastUploadedCharacterSlugRef.current = resolvedSlug
      return uploadImage(file, resolvedSlug, { text, userName })
    },
    onSuccess: (data) => {
      console.log("✅ Image uploaded successfully:", data)
      const slug = lastUploadedCharacterSlugRef.current
      if (slug) {
        queryClient.invalidateQueries({ queryKey: ["images", slug] })
      }
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
    onError: (error) => {
      console.error("❌ Upload failed:", error.message)
    },
  })
}
