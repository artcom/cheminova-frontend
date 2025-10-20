import { fetchAllLocalesContent } from "@/api/djangoApi"
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

const DEFAULT_CODES = SUPPORTED_LANGUAGES.map((language) => language.code)

const defaultGetLanguageName = (code) => {
  const normalized = normalizeLocale(code)
  return (
    SUPPORTED_LANGUAGES.find((language) => language.code === normalized)
      ?.name ||
    normalized ||
    SUPPORTED_LANGUAGES[0]?.name ||
    ""
  )
}

const defaultIsLanguageSupported = (code) =>
  DEFAULT_CODES.includes(normalizeLocale(code))

const LanguageContext = createContext({
  supportedLanguages: SUPPORTED_LANGUAGES,
  languageCodes: DEFAULT_CODES,
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  error: null,
  refetch: async () => ({ data: undefined }),
  getLanguageName: defaultGetLanguageName,
  isLanguageSupported: defaultIsLanguageSupported,
})

export const useLanguageContext = () => useContext(LanguageContext)

const extractLocalesFromContent = (content) => {
  if (!Array.isArray(content)) {
    return SUPPORTED_LANGUAGES
  }

  const seen = new Set()
  const locales = []

  for (const entry of content) {
    const code = normalizeLocale(entry?.locale)
    if (!code || seen.has(code)) {
      continue
    }

    seen.add(code)
    locales.push({ code })
  }

  return locales.length > 0 ? locales : SUPPORTED_LANGUAGES
}

const ensureActiveLanguage = (languages) => {
  if (!languages.length) {
    return
  }

  const availableCodes = languages.map((language) => language.code)
  const currentLocale = getCurrentLocale()

  if (!availableCodes.includes(currentLocale)) {
    void changeLanguage(availableCodes[0])
  }
}

export default function LanguageProvider({ children }) {
  const queryResult = useQuery({
    queryKey: ["all-locales-content"],
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  const [languages, setLanguages] = useState(() => getSupportedLanguages())

  useEffect(() => {
    if (!queryResult.isSuccess) {
      return
    }

    const nextLanguages = extractLocalesFromContent(queryResult.data)
    const runtimeLanguages = setSupportedLanguages(nextLanguages)
    setLanguages(runtimeLanguages)
  }, [queryResult.data, queryResult.isSuccess])

  useEffect(() => {
    if (!queryResult.error) {
      return
    }

    const runtimeLanguages = setSupportedLanguages(SUPPORTED_LANGUAGES)
    setLanguages(runtimeLanguages)
  }, [queryResult.error])

  useEffect(() => {
    ensureActiveLanguage(languages)
  }, [languages])

  const contextValue = useMemo(() => {
    const languageCodes = languages.map((language) => language.code)

    const getLanguageName = (code) => {
      const normalized = normalizeLocale(code)
      return (
        languages.find((language) => language.code === normalized)?.name ||
        defaultGetLanguageName(code)
      )
    }

    const isLanguageSupported = (code) =>
      languageCodes.includes(normalizeLocale(code))

    return {
      supportedLanguages: languages,
      languageCodes,
      isLoading: queryResult.isLoading,
      isFetching: queryResult.isFetching,
      isSuccess: queryResult.isSuccess,
      error: queryResult.error ?? null,
      refetch: queryResult.refetch,
      getLanguageName,
      isLanguageSupported,
    }
  }, [
    languages,
    queryResult.error,
    queryResult.isFetching,
    queryResult.isLoading,
    queryResult.isSuccess,
    queryResult.refetch,
  ])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
