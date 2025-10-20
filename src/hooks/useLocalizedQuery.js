import {
  ALL_LOCALES_CONTENT_QUERY_KEY,
  fetchAllLocalesContent,
  getContentForLocale,
} from "@/api/djangoApi"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export const useLocalizedQuery = (options) => {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const currentLocale = i18n.language || "en"

  // Invalidate queries when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      // Invalidate all localized queries to force refetch
      queryClient.invalidateQueries({
        predicate: (query) => {
          return query.queryKey.includes("locale")
        },
      })
    }

    i18n.on("languageChanged", handleLanguageChange)

    return () => {
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [i18n, queryClient])

  const localizedOptions = {
    ...options,
    queryKey: [...(options.queryKey || []), "locale", currentLocale],
    queryFn: async () => {
      console.log(`🔄 Fetching content for locale: ${currentLocale}`)
      const cachedLocales = queryClient.getQueryData(
        ALL_LOCALES_CONTENT_QUERY_KEY,
      )

      const allLocalesContent =
        cachedLocales ??
        (await queryClient.ensureQueryData({
          queryKey: ALL_LOCALES_CONTENT_QUERY_KEY,
          queryFn: fetchAllLocalesContent,
        }))

      const localeContent = getContentForLocale(
        allLocalesContent,
        currentLocale,
      )
      return options.queryFn
        ? await options.queryFn(localeContent)
        : localeContent
    },
    refetchOnMount: false, // Don't refetch on mount since we handle language changes
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  }

  const queryResult = useQuery(localizedOptions)

  return {
    ...queryResult,
    locale: currentLocale,
    isLocaleLoading: i18n.isInitialized === false,
  }
}

export const useLocalizedContent = (queryFn, queryKey, options = {}) => {
  return useLocalizedQuery({
    queryFn,
    queryKey,
    ...options,
  })
}

export default useLocalizedQuery
