import { fetchAllLocalesContent } from "@/api/djangoApi"
import i18n, {
  changeLanguage,
  DEFAULT_LANGUAGE,
  getCurrentLocale,
  SUPPORTED_LANGUAGES,
  setSupportedLanguages as syncSupportedLanguages,
} from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const normalizeLocale = (locale) => {
  if (typeof locale !== "string") {
    return ""
  }
  return locale.toLowerCase().split("-")[0]
}

const DEFAULT_LANGUAGE_MAP = new Map(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang]),
)

const extractLanguagesFromContent = (content) => {
  if (!Array.isArray(content)) {
    return SUPPORTED_LANGUAGES
  }

  const seen = new Set()
  const codes = []

  for (const item of content) {
    const code = normalizeLocale(item?.locale)

    if (!code || seen.has(code) || !DEFAULT_LANGUAGE_MAP.has(code)) {
      continue
    }

    seen.add(code)
    codes.push(code)
  }

  if (codes.length === 0) {
    return SUPPORTED_LANGUAGES
  }

  return codes.map((code) => DEFAULT_LANGUAGE_MAP.get(code))
}

const haveSameLanguages = (a, b) => {
  if (a.length !== b.length) {
    return false
  }

  return a.every(
    (lang, index) => lang.code === b[index].code && lang.name === b[index].name,
  )
}

const defaultContextValue = {
  supportedLanguages: SUPPORTED_LANGUAGES,
  languageCodes: SUPPORTED_LANGUAGES.map((lang) => lang.code),
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  error: null,
  refetch: async () => ({ data: undefined }),
  getLanguageName: (code) => {
    const normalized = normalizeLocale(code)
    return (
      DEFAULT_LANGUAGE_MAP.get(normalized)?.name ||
      normalized ||
      DEFAULT_LANGUAGE
    )
  },
  isLanguageSupported: (code) => {
    const normalized = normalizeLocale(code)
    return DEFAULT_LANGUAGE_MAP.has(normalized)
  },
}

export const LanguageContext = createContext(defaultContextValue)

export const useLanguageContext = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguageContext must be used within LanguageProvider")
  }
  return context
}

const ensureActiveLanguage = () => {
  const currentLanguage = normalizeLocale(i18n.language) || DEFAULT_LANGUAGE
  const resolvedLocale = getCurrentLocale()

  if (resolvedLocale !== currentLanguage) {
    void changeLanguage(resolvedLocale)
  }
}

export default function LanguageProvider({ children }) {
  const [languages, setLanguages] = useState(SUPPORTED_LANGUAGES)

  const queryResult = useQuery({
    queryKey: ["all-locales-content"],
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (!queryResult.isSuccess) {
      return
    }

    const candidateLanguages = extractLanguagesFromContent(queryResult.data)
    const sanitizedLanguages = syncSupportedLanguages(candidateLanguages)

    setLanguages((prev) =>
      haveSameLanguages(prev, sanitizedLanguages) ? prev : sanitizedLanguages,
    )

    ensureActiveLanguage()
  }, [queryResult.data, queryResult.isSuccess])

  useEffect(() => {
    if (!queryResult.error) {
      return
    }

    const sanitizedLanguages = syncSupportedLanguages(SUPPORTED_LANGUAGES)

    setLanguages((prev) =>
      haveSameLanguages(prev, sanitizedLanguages) ? prev : sanitizedLanguages,
    )

    ensureActiveLanguage()
  }, [queryResult.error])

  const contextValue = useMemo(() => {
    const languageCodes = languages.map((lang) => lang.code)

    const getLanguageName = (code) => {
      const normalized = normalizeLocale(code)
      const runtimeLanguage = languages.find((lang) => lang.code === normalized)

      if (runtimeLanguage) {
        return runtimeLanguage.name
      }

      return (
        DEFAULT_LANGUAGE_MAP.get(normalized)?.name ||
        normalized ||
        DEFAULT_LANGUAGE
      )
    }

    const isLanguageSupported = (code) => {
      const normalized = normalizeLocale(code)
      return languageCodes.includes(normalized)
    }

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
    queryResult.isFetching,
    queryResult.isLoading,
    queryResult.isSuccess,
    queryResult.error,
    queryResult.refetch,
  ])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
