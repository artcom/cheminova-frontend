import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import { LANGUAGE_CONFIG, LANGUAGE_LIST } from "@/i18n/config"
import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"

import { LanguageContext } from "./LanguageContext"

const resolveLanguagesFromContent = (content) => {
  const codes = [
    ...new Set(
      content
        .map((entry) => entry.locale)
        .filter((code) => LANGUAGE_LIST[code]),
    ),
  ]
  return codes.reduce(
    (acc, code) => ({ ...acc, [code]: LANGUAGE_LIST[code] }),
    {},
  )
}

const useLanguages = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguages must be used within LanguageProvider")
  }
  return context
}

function LanguageProvider({ children }) {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery({
    queryKey: ALL_LOCALES_CONTENT_QUERY_KEY,
    queryFn: fetchAllLocalesContent,
    staleTime: LANGUAGE_CONFIG.ALL_LOCALES_STALE_TIME,

    gcTime: LANGUAGE_CONFIG.CACHE_TIME,
    retry: LANGUAGE_CONFIG.RETRY_ATTEMPTS,
    retryDelay: LANGUAGE_CONFIG.RETRY_DELAY,
  })

  const languages =
    !isSuccess || !data ? LANGUAGE_LIST : resolveLanguagesFromContent(data)

  const contextValue = {
    supportedLanguages: languages,
    languageCodes: Object.keys(languages),
    isLoading,
    isFetching,
    isSuccess,
    error,
    refetch,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export { useLanguages }
export default LanguageProvider
