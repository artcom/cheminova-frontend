import { fetchAllLocalesContent } from "@/api/djangoApi"
import { getSupportedLanguages, SUPPORTED_LANGUAGES } from "@/i18n"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

export const useSupportedLanguages = () => {
  const [supportedLanguages, setSupportedLanguages] =
    useState(SUPPORTED_LANGUAGES)

  const {
    data: allContent,
    isLoading,
    error,
    isSuccess,
  } = useQuery({
    queryKey: ["all-locales-content"],
    queryFn: fetchAllLocalesContent,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
  })

  useEffect(() => {
    if (isSuccess && allContent) {
      // Get API discovered languages (filtered to only supported ones)
      const apiLanguages = getSupportedLanguages()
      if (apiLanguages && apiLanguages.length > 0) {
        console.log("🌐 Using API discovered languages:", apiLanguages)
        setSupportedLanguages(apiLanguages)
      } else {
        console.log("🌐 Using default supported languages")
        setSupportedLanguages(SUPPORTED_LANGUAGES)
      }
    } else if (error) {
      console.warn("⚠️ API error, using default languages:", error)
      setSupportedLanguages(SUPPORTED_LANGUAGES)
    }
  }, [allContent, error, isSuccess])

  const languageCodes = supportedLanguages.map((lang) => lang.code)

  const getLanguageName = (code) => {
    const language = supportedLanguages.find((lang) => lang.code === code)
    return language ? language.name : code
  }

  const isLanguageSupported = (code) => {
    return languageCodes.includes(code)
  }

  return {
    supportedLanguages,
    languageCodes,
    getLanguageName,
    isLanguageSupported,
    isLoading,
    error,
    isSuccess,
  }
}

export default useSupportedLanguages
