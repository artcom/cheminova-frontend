import { useLanguageContext } from "@/providers/LanguageProvider"

export const useSupportedLanguages = () => {
  return useLanguageContext()
}

export default useSupportedLanguages
