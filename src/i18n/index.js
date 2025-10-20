import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import HttpApi from "i18next-http-backend"
import { initReactI18next } from "react-i18next"

export const DEFAULT_LANGUAGE = "en"

const LANGUAGE_LIST = [
  { code: "en", name: "English" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
]

export const LANGUAGE_MAP = LANGUAGE_LIST.reduce((map, language) => {
  map[language.code] = language
  return map
}, {})

export const DEFAULT_LANGUAGE_CODES = LANGUAGE_LIST.map(
  (language) => language.code,
)

export const DEFAULT_LANGUAGES = [...LANGUAGE_LIST]

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: [...DEFAULT_LANGUAGE_CODES],
    fallbackLng: DEFAULT_LANGUAGE,

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "cheminova-language",
      convertDetectedLanguage: (lng) => {
        if (typeof lng !== "string") {
          return DEFAULT_LANGUAGE
        }

        const code = lng.trim().toLowerCase().split("-")[0]
        return LANGUAGE_MAP[code] ? code : DEFAULT_LANGUAGE
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
  const rawLanguage = typeof i18n.language === "string" ? i18n.language : ""
  const current = rawLanguage.trim().toLowerCase().split("-")[0]

  const { supportedLngs } = i18n.options
  const activeCodes =
    Array.isArray(supportedLngs) && supportedLngs.length > 0
      ? supportedLngs
      : DEFAULT_LANGUAGE_CODES

  if (current && activeCodes.includes(current)) {
    return current
  }

  return activeCodes[0] ?? DEFAULT_LANGUAGE
}

export const changeLanguage = async (languageCode) => {
  const code =
    typeof languageCode === "string" ? languageCode.trim().toLowerCase() : ""

  const { supportedLngs } = i18n.options
  const activeCodes =
    Array.isArray(supportedLngs) && supportedLngs.length > 0
      ? supportedLngs
      : DEFAULT_LANGUAGE_CODES

  if (!code || !activeCodes.includes(code)) {
    const list = activeCodes.join(", ") || "(none)"
    throw new Error(
      `Language "${languageCode}" is not configured. Active languages: ${list}`,
    )
  }

  try {
    await i18n.changeLanguage(code)
    localStorage.setItem("cheminova-language", code)
    console.log(`🌐 Language changed to: ${code}`)
    return true
  } catch (error) {
    console.error(`❌ Failed to change language to ${code}:`, error)
    return false
  }
}

export const getLanguageName = (languageCode) => {
  const code =
    typeof languageCode === "string" ? languageCode.trim().toLowerCase() : ""

  if (LANGUAGE_MAP[code]) {
    return LANGUAGE_MAP[code].name
  }

  if (code) {
    return code.toUpperCase()
  }

  return DEFAULT_LANGUAGE.toUpperCase()
}

export const isLanguageSupported = (languageCode) => {
  const code =
    typeof languageCode === "string" ? languageCode.trim().toLowerCase() : ""

  const { supportedLngs } = i18n.options
  const activeCodes =
    Array.isArray(supportedLngs) && supportedLngs.length > 0
      ? supportedLngs
      : DEFAULT_LANGUAGE_CODES

  return code ? activeCodes.includes(code) : false
}

export default i18n
