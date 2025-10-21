import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
} from "@/api/djangoApi"
import { LANGUAGE_CONFIG, LANGUAGE_LIST } from "@/config/language"
import { useQuery } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

const LanguageContext = createContext(null)

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

  const [languages, setLanguages] = useState(LANGUAGE_LIST)

  useEffect(() => {
    if (!isSuccess || !data) return
    setLanguages(resolveLanguagesFromContent(data))
  }, [data, isSuccess])

  const contextValue = useMemo(
    () => ({
      supportedLanguages: languages,
      languageCodes: Object.keys(languages),
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

export { useLanguages }
export default LanguageProvider
