import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import {
  changeLanguage,
  getCurrentLocale,
  getSupportedLanguages,
  normalizeLocale,
  setSupportedLanguages,
  SUPPORTED_LANGUAGES,
} from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const LanguageContext = createContext(null)

const sanitizeContentLocales = (content) => {
  if (!Array.isArray(content)) {
    return SUPPORTED_LANGUAGES
  }

  const seen = new Set()
  const locales = []

  for (const entry of content) {
    const normalized = normalizeLocale(entry?.locale)
    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    locales.push({ code: normalized })
  }

  return locales.length > 0 ? locales : SUPPORTED_LANGUAGES
}

const cloneLanguages = (languages = []) =>
  languages.map((language) => ({ ...language }))

const areLanguagesEqual = (a = [], b = []) => {
  if (a === b) {
    return true
  }

  if (a.length !== b.length) {
    return false
  }

  for (let index = 0; index < a.length; index += 1) {
    const current = a[index]
    const next = b[index]

    if (!next) {
      return false
    }

    if (current.code !== next.code) {
      return false
    }

    if ((current.name ?? null) !== (next.name ?? null)) {
      return false
    }
  }

  return true
}

export const useLanguageContext = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider")
  }
  return context
}

export default function LanguageProvider({ children }) {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ALL_LOCALES_CONTENT_QUERY_KEY,
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  const [languages, setLanguages] = useState(() =>
    cloneLanguages(getSupportedLanguages()),
  )

  useEffect(() => {
    let nextLocales = null

    if (isSuccess) {
      nextLocales = sanitizeContentLocales(data)
    } else if (error) {
      nextLocales = SUPPORTED_LANGUAGES
    }

    if (!nextLocales) {
      return
    }

    const runtimeLanguages = setSupportedLanguages(nextLocales)
    setLanguages((prev) =>
      areLanguagesEqual(prev, runtimeLanguages)
        ? prev
        : cloneLanguages(runtimeLanguages),
    )
  }, [data, isSuccess, error])

  useEffect(() => {
    if (!languages.length) {
      return
    }

    const current = getCurrentLocale()
    if (!languages.some((language) => language.code === current)) {
      void changeLanguage(languages[0].code)
    }
  }, [languages])

  const contextValue = useMemo(() => {
    const languageCodes = languages.map((language) => language.code)

    const getLanguageName = (code) => {
      const normalized = normalizeLocale(code)
      const match =
        languages.find((language) => language.code === normalized) ||
        SUPPORTED_LANGUAGES.find((language) => language.code === normalized)

      if (match) {
        return match.name
      }

      if (normalized) {
        return normalized
      }

      return SUPPORTED_LANGUAGES[0]?.name ?? ""
    }

    const isLanguageSupported = (code) =>
      languageCodes.includes(normalizeLocale(code))

    return {
      supportedLanguages: languages,
      languageCodes,
      isLoading,
      isFetching,
      isSuccess,
      error: error ?? null,
      refetch,
      getLanguageName,
      isLanguageSupported,
    }
  }, [languages, isLoading, isFetching, isSuccess, error, refetch])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
