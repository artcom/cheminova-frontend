import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const DEFAULT_LANGUAGE = "en"

export const DEFAULT_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
]

const defaultLanguageNames = new Map(
  DEFAULT_LANGUAGES.map((language) => [language.code, language.name]),
)

let supportedLanguages = [...DEFAULT_LANGUAGES]

export const normalizeLocale = (locale) => {
  if (typeof locale !== "string") {
    return ""
  }

  return locale.toLowerCase().split("-")[0]
}

export const setSupportedLanguages = (languages) => {
  if (!Array.isArray(languages) || languages.length === 0) {
    supportedLanguages = [...DEFAULT_LANGUAGES]
  } else {
    const seen = new Set()
    const next = []

    for (const candidate of languages) {
      const code = normalizeLocale(
        typeof candidate === "string"
          ? candidate
          : (candidate?.code ?? candidate?.locale ?? ""),
      )

      if (!code || seen.has(code)) {
        continue
      }

      seen.add(code)
      const name =
        (typeof candidate === "object" && candidate?.name) ||
        defaultLanguageNames.get(code) ||
        code.toUpperCase()

      next.push({ code, name })
    }

    supportedLanguages = next.length > 0 ? next : [...DEFAULT_LANGUAGES]
  }

  i18n.options.supportedLngs = supportedLanguages.map((lang) => lang.code)
  return [...supportedLanguages]
}

export const getSupportedLanguages = () => [...supportedLanguages]

export const getLanguageCodes = () =>
  supportedLanguages.map((language) => language.code)

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: getLanguageCodes(),
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

  const match =
    supportedLanguages.find((language) => language.code === normalizedCode) ||
    DEFAULT_LANGUAGES.find((language) => language.code === normalizedCode)

  if (match) {
    return match.name
  }

  if (normalizedCode) {
    return normalizedCode.toUpperCase()
  }

  return DEFAULT_LANGUAGE.toUpperCase()
}

export const isLanguageSupported = (languageCode) => {
  const normalizedCode = normalizeLocale(languageCode)
  return supportedLanguages.some((language) => language.code === normalizedCode)
}

export default i18n
