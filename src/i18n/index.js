import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const DEFAULT_LANGUAGE = "en"

export const SUPPORTED_LANGUAGES = Object.freeze([
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
])

const LANGUAGE_LOOKUP = new Map(
  SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang]),
)

export const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map(
  (lang) => lang.code,
)

export const normalizeLocale = (locale) => {
  if (typeof locale !== "string") {
    return ""
  }

  return locale.toLowerCase().split("-")[0]
}

const toSupportedLanguageList = (languages) => {
  if (!Array.isArray(languages)) {
    return [...SUPPORTED_LANGUAGES]
  }

  const seen = new Set()
  const sanitized = []

  for (const candidate of languages) {
    const normalized = normalizeLocale(
      typeof candidate === "string" ? candidate : candidate?.code,
    )

    if (!normalized || seen.has(normalized)) {
      continue
    }

    const match = LANGUAGE_LOOKUP.get(normalized)
    if (match) {
      seen.add(normalized)
      sanitized.push(match)
    }
  }

  return sanitized.length > 0 ? sanitized : [...SUPPORTED_LANGUAGES]
}

const languagesMatch = (a, b) => {
  if (a.length !== b.length) {
    return false
  }

  return a.every((lang, index) => lang.code === b[index].code)
}

let runtimeLanguages = [...SUPPORTED_LANGUAGES]

export const setSupportedLanguages = (languages) => {
  const sanitized = toSupportedLanguageList(languages)

  if (languagesMatch(runtimeLanguages, sanitized)) {
    return runtimeLanguages
  }

  runtimeLanguages = sanitized
  console.log("🌐 API discovered languages:", runtimeLanguages)
  return runtimeLanguages
}

export const getSupportedLanguages = () => runtimeLanguages
export const getLanguageCodes = () => runtimeLanguages.map((lang) => lang.code)

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
      convertDetectedLanguage: (lng) =>
        normalizeLocale(lng) || DEFAULT_LANGUAGE,
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
  const currentLang = normalizeLocale(i18n.language)
  const languageCodes = getLanguageCodes()

  if (currentLang && languageCodes.includes(currentLang)) {
    return currentLang
  }

  return languageCodes[0] ?? DEFAULT_LANGUAGE
}

export const changeLanguage = async (languageCode) => {
  const normalizedCode = normalizeLocale(languageCode)

  if (!isLanguageSupported(normalizedCode)) {
    console.warn(
      `⚠️ Language ${languageCode} not supported. Available: ${getLanguageCodes().join(", ")}`,
    )
    return false
  }

  try {
    await i18n.changeLanguage(normalizedCode)
    localStorage.setItem("cheminova-language", normalizedCode)
    console.log(`🌐 Language changed to: ${normalizedCode}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to change language to ${normalizedCode}:`, error)
    return false
  }
}

export const getLanguageName = (languageCode) => {
  const normalizedCode = normalizeLocale(languageCode)

  const fromRuntime = runtimeLanguages.find(
    (lang) => lang.code === normalizedCode,
  )

  if (fromRuntime) {
    return fromRuntime.name
  }

  return LANGUAGE_LOOKUP.get(normalizedCode)?.name ?? normalizedCode
}

export const isLanguageSupported = (languageCode) => {
  const normalizedCode = normalizeLocale(languageCode)
  return getLanguageCodes().includes(normalizedCode)
}

export default i18n
