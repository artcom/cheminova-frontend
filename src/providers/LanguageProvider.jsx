import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import i18n, { changeLanguage, getCurrentLocale, LANGUAGE_LIST } from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const LanguageContext = createContext(null)

const resolveLanguagesFromContent = (content) => {
  const codes = [
    ...new Set(
      content
        .map((entry) => entry.locale)
        .filter((code) => LANGUAGE_LIST.find((lang) => lang.code === code)),
    ),
  ]

  return codes.map((code) => LANGUAGE_LIST.find((lang) => lang.code === code))
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

  const [languages, setLanguages] = useState(LANGUAGE_LIST)

  useEffect(() => {
    if (!isSuccess) return

    const resolved = resolveLanguagesFromContent(data)
    i18n.options.supportedLngs = resolved.map((lang) => lang.code)
    setLanguages(resolved)
  }, [data, isSuccess])

  useEffect(() => {
    const codes = languages.map((lang) => lang.code)
    const current = getCurrentLocale()

    if (!codes.includes(current)) {
      changeLanguage(codes[0]).catch(console.error)
    }
  }, [languages])

  const contextValue = useMemo(
    () => ({
      supportedLanguages: languages,
      languageCodes: languages.map((lang) => lang.code),
      isLoading,
      isFetching,
      isSuccess,
      error,
      refetch,
    }),
    [languages, isLoading, isFetching, isSuccess, error, refetch],
  )

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}
