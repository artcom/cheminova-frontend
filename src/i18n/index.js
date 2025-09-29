import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const DEFAULT_LANGUAGE = "en"

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
]

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(
  (lang) => lang.code,
)

let apiDiscoveredLanguages = [...SUPPORTED_LANGUAGES]

export const setSupportedLanguages = (languages) => {
  apiDiscoveredLanguages = languages.filter((lang) =>
    SUPPORTED_LANGUAGE_CODES.includes(lang.code),
  )
  console.log("🌐 API discovered languages:", apiDiscoveredLanguages)
}

export const getSupportedLanguages = () => apiDiscoveredLanguages
export const getLanguageCodes = () =>
  apiDiscoveredLanguages.map((lang) => lang.code)

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    fallbackLng: DEFAULT_LANGUAGE,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "cheminova-language",
      convertDetectedLanguage: (lng) => lng.split("-")[0],
    },

    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },

    react: {
      useSuspense: false,
    },

    interpolation: {
      escapeValue: false,
    },

    debug: import.meta.env.DEV,

    defaultNS: "translation",
    ns: ["translation"],
  })

export const getCurrentLocale = () => {
  const currentLang = i18n.language || DEFAULT_LANGUAGE
  return SUPPORTED_LANGUAGE_CODES.includes(currentLang)
    ? currentLang
    : DEFAULT_LANGUAGE
}

export const changeLanguage = async (languageCode) => {
  if (!SUPPORTED_LANGUAGE_CODES.includes(languageCode)) {
    console.warn(
      `⚠️ Language ${languageCode} not supported. Available: ${SUPPORTED_LANGUAGE_CODES.join(", ")}`,
    )
    return false
  }

  try {
    await i18n.changeLanguage(languageCode)
    localStorage.setItem("cheminova-language", languageCode)
    console.log(`🌐 Language changed to: ${languageCode}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to change language to ${languageCode}:`, error)
    return false
  }
}

export const getLanguageName = (languageCode) => {
  const language = SUPPORTED_LANGUAGES.find(
    (lang) => lang.code === languageCode,
  )
  return language ? language.name : languageCode
}

export const isLanguageSupported = (languageCode) => {
  return SUPPORTED_LANGUAGE_CODES.includes(languageCode)
}

export default i18n
