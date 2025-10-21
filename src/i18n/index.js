import {
  BACKEND_CONFIG,
  DEFAULT_LANGUAGE,
  DETECTION_CONFIG,
  findLanguageByCode,
  getLanguageCodes,
  INTERPOLATION_CONFIG,
  LANGUAGE_CONFIG,
  LANGUAGE_LIST,
  NAMESPACE_CONFIG,
  REACT_I18N_CONFIG,
} from "@/config/language"
import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export { LANGUAGE_LIST }

const convertDetectedLanguage = (lng) => {
  const baseCode = lng.trim().toLowerCase().split("-")[0]
  const isSupported = findLanguageByCode(baseCode)
  return isSupported ? baseCode : DEFAULT_LANGUAGE
}

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: getLanguageCodes(),
    fallbackLng: DEFAULT_LANGUAGE,
    detection: {
      order: DETECTION_CONFIG.ORDER,
      caches: DETECTION_CONFIG.CACHES,
      lookupLocalStorage: DETECTION_CONFIG.LOOKUP_LOCAL_STORAGE,
      convertDetectedLanguage,
    },
    backend: {
      loadPath: BACKEND_CONFIG.LOAD_PATH,
    },
    react: {
      useSuspense: REACT_I18N_CONFIG.USE_SUSPENSE,
    },
    interpolation: {
      escapeValue: INTERPOLATION_CONFIG.ESCAPE_VALUE,
    },
    debug: import.meta.env.DEV,
    defaultNS: NAMESPACE_CONFIG.DEFAULT_NS,
    ns: NAMESPACE_CONFIG.NS,
  })

export const getCurrentLocale = () => {
  return i18n.language.trim().toLowerCase().split("-")[0]
}

export const changeLanguage = async (languageCode) => {
  const code = languageCode.trim().toLowerCase()
  await i18n.changeLanguage(code)
  localStorage.setItem(LANGUAGE_CONFIG.STORAGE_KEY, code)
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
