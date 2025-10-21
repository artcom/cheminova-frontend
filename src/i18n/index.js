import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const LANGUAGE_LIST = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
]

const getLanguageCodes = () => LANGUAGE_LIST.map((lang) => lang.code)

const findLanguageByCode = (code) =>
  LANGUAGE_LIST.find((lang) => lang.code === code)

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: getLanguageCodes(),
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "cheminova-language",
      convertDetectedLanguage: (lng) => {
        const baseCode = lng.trim().toLowerCase().split("-")[0]
        const isSupported = findLanguageByCode(baseCode)
        return isSupported ? baseCode : "en"
      },
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json",
    },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
    debug: import.meta.env.DEV,
    defaultNS: "translation",
    ns: ["translation"],
  })

export const getCurrentLocale = () => {
  return i18n.language.trim().toLowerCase().split("-")[0]
}

export const changeLanguage = async (languageCode) => {
  const code = languageCode.trim().toLowerCase()
  await i18n.changeLanguage(code)
  localStorage.setItem("cheminova-language", code)
}

export const getLanguageName = (languageCode) => {
  const code = languageCode.trim().toLowerCase()
  const language = findLanguageByCode(code)
  return language ? language.name : code.toUpperCase()
}

export const isLanguageSupported = (languageCode) => {
  const code = languageCode.trim().toLowerCase()
  return i18n.options.supportedLngs.includes(code)
}

export default i18n
