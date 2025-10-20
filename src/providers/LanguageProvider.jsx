import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import i18n, {
  changeLanguage,
  DEFAULT_LANGUAGE,
  DEFAULT_LANGUAGES,
  getCurrentLocale,
  LANGUAGE_MAP,
} from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const LanguageContext = createContext(null)

const resolveLanguagesFromContent = (content) => {
  if (!Array.isArray(content)) {
    throw new Error("CMS locales payload must be an array.")
  }

  const locales = []
  const seen = new Set()

  for (const entry of content) {
    const raw = entry?.locale ?? entry?.code
    if (typeof raw !== "string") {
      console.warn("Skipping locale entry without a string code:", entry)
      continue
    }

    const code = raw.trim().toLowerCase().split("-")[0]
    if (!code) {
      console.warn(
        "Skipping locale entry that resolves to an empty code:",
        entry,
      )
      continue
    }

    if (!LANGUAGE_MAP[code]) {
      throw new Error(
        `CMS locales payload includes unsupported locale "${code}". Update LANGUAGE_MAP before continuing.`,
      )
    }

    if (!seen.has(code)) {
      seen.add(code)
      locales.push(code)
    }
  }

  if (!locales.length) {
    throw new Error(
      "CMS locales payload did not contain any usable locale codes.",
    )
  }

  if (!seen.has(DEFAULT_LANGUAGE)) {
    throw new Error(
      `CMS locales payload is missing fallback language "${DEFAULT_LANGUAGE}".`,
    )
  }

  const orderedCodes =
    locales[0] === DEFAULT_LANGUAGE
      ? locales
      : [
          DEFAULT_LANGUAGE,
          ...locales.filter((code) => code !== DEFAULT_LANGUAGE),
        ]

  return orderedCodes.map((code) => LANGUAGE_MAP[code])
}

export const useLanguages = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguages must be used within LanguageProvider")
  }
  return context
}

export default function LanguageProvider({ children }) {
  const {
    data,
    error: queryError,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  } = useQuery({
    queryKey: ALL_LOCALES_CONTENT_QUERY_KEY,
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  const [languages, setLanguages] = useState(() => [...DEFAULT_LANGUAGES])
  const [resolutionError, setResolutionError] = useState(null)

  useEffect(() => {
    if (!isSuccess) {
      return
    }

    try {
      const resolvedLanguages = resolveLanguagesFromContent(data)
      const codes = resolvedLanguages.map((language) => language.code)
      i18n.options.supportedLngs = codes
      setLanguages(resolvedLanguages)
      setResolutionError(null)
    } catch (err) {
      console.error("❌ Failed to resolve languages from CMS payload:", err)
      const fallbackLanguages = [...DEFAULT_LANGUAGES]
      i18n.options.supportedLngs = fallbackLanguages.map(
        (language) => language.code,
      )
      setLanguages(fallbackLanguages)
      setResolutionError(err)
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (!languages.length) {
      return
    }

    const codes = languages.map((language) => language.code)
    const current = getCurrentLocale()

    if (!codes.includes(current)) {
      const nextCode = codes[0]
      void changeLanguage(nextCode).catch((error) => {
        console.error(
          "❌ Failed to align active language with supported languages:",
          error,
        )
      })
    }
  }, [languages])

  const contextValue = useMemo(
    () => ({
      supportedLanguages: languages,
      languageCodes: languages.map((language) => language.code),
      isLoading,
      isFetching,
      isSuccess,
      error: queryError ?? resolutionError,
      refetch,
    }),
    [
      languages,
      isLoading,
      isFetching,
      isSuccess,
      queryError,
      resolutionError,
      refetch,
    ],
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
