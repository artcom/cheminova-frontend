import { fetchAllLocalesContent, getContentForLocale } from "@/api/djangoApi"
import { DEFAULT_LANGUAGE } from "@/config/language"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export const useLocalizedQuery = (options) => {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language || DEFAULT_LANGUAGE

  const localizedOptions = {
    ...options,
    queryKey: [...(options.queryKey || []), "locale", currentLocale],
    queryFn: async () => {
      const allLocalesContent = await fetchAllLocalesContent()
      const localeContent = getContentForLocale(
        allLocalesContent,
        currentLocale,
      )
      return options.queryFn
        ? await options.queryFn(localeContent)
        : localeContent
    },
  }

  return useQuery(localizedOptions)
}

export const useLocalizedContent = (queryFn, queryKey, options = {}) => {
  return useLocalizedQuery({
    queryFn,
    queryKey,
    ...options,
  })
}

export default useLocalizedQuery
