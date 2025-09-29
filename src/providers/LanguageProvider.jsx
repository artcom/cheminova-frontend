import { fetchAllLocalesContent } from "@/api/djangoApi"
import { setSupportedLanguages, SUPPORTED_LANGUAGES } from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export default function LanguageProvider({ children }) {
  const { data: allContent, isSuccess } = useQuery({
    queryKey: ["all-locales-content"],
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (isSuccess && allContent && Array.isArray(allContent)) {
      const apiLanguageCodes = allContent.map((item) => item.locale)

      const availableLanguages = SUPPORTED_LANGUAGES.filter((lang) =>
        apiLanguageCodes.includes(lang.code),
      )

      console.log(
        "🌐 Updating i18n with API-discovered languages:",
        availableLanguages,
      )
      setSupportedLanguages(availableLanguages)
    }
  }, [allContent, isSuccess])

  return children
}
