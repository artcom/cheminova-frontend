import { fetchCharacterSlugs } from "@/api/djangoApi"
import { uploadImage } from "@/api/uploadImage"
import { DEFAULT_LANGUAGE } from "@/config/language"
import useGlobalState from "@/hooks/useGlobalState"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  const { currentCharacterIndex } = useGlobalState()
  const { i18n } = useTranslation()
  const locale = i18n.language || DEFAULT_LANGUAGE
  const lastUploadedCharacterSlugRef = useRef(null)

  const { data: characterSlugsData } = useQuery({
    queryKey: ["character-slugs", locale],
    queryFn: () => fetchCharacterSlugs(locale),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    enabled: Boolean(locale),
  })

  const getCharacterSlug = () => {
    return characterSlugsData[0].characters[currentCharacterIndex].slug
  }

  return useMutation({
    mutationFn: async ({ file, text, userName }) => {
      const slug = getCharacterSlug()
      lastUploadedCharacterSlugRef.current = slug
      return uploadImage(file, slug, { text, userName })
    },
    onSuccess: () => {
      const slug = lastUploadedCharacterSlugRef.current
      queryClient.invalidateQueries({ queryKey: ["images", slug] })
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
  })
}
