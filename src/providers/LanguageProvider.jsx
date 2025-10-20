import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import {
  changeLanguage,
  getCurrentLocale,
  getLanguageName,
  getSupportedLanguages,
  isLanguageSupported,
  normalizeLocale,
  setSupportedLanguages,
} from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const LanguageContext = createContext(null)

const extractRemoteLocales = (content) => {
  if (!Array.isArray(content)) {
    return []
  }

  const seen = new Set()
  const locales = []

  for (const entry of content) {
    const normalized = normalizeLocale(entry?.locale ?? entry?.code ?? "")
    if (!normalized || seen.has(normalized)) {
      continue
    }

    seen.add(normalized)
    locales.push(normalized)
  }

  return locales
}

export const useLanguages = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguages must be used within LanguageProvider")
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

  const [languages, setLanguages] = useState(() => getSupportedLanguages())

  useEffect(() => {
    if (isSuccess) {
      const availableLanguages = setSupportedLanguages(
        extractRemoteLocales(data),
      )
      setLanguages(availableLanguages)
      return
    }

    if (error) {
      const defaultLanguages = setSupportedLanguages([])
      setLanguages(defaultLanguages)
    }
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

  const contextValue = useMemo(
    () => ({
      supportedLanguages: languages,
      languageCodes: languages.map((language) => language.code),
      isLoading,
      isFetching,
      isSuccess,
      error: error ?? null,
      refetch,
      getLanguageName,
      isLanguageSupported,
    }),
    [languages, isLoading, isFetching, isSuccess, error, refetch],
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
