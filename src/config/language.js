export const LANGUAGE_CONFIG = {
  STORAGE_KEY: "chemisee-language",
  CACHE_TIME: 60 * 60 * 1000,
  STALE_TIME: 5 * 60 * 1000,
  ALL_LOCALES_STALE_TIME: 30 * 60 * 1000,
  RETRY_ATTEMPTS: 2,
  RETRY_DELAY: 1000,
}

export const DETECTION_CONFIG = {
  ORDER: ["localStorage", "navigator", "htmlTag"],
  CACHES: ["localStorage"],
  LOOKUP_LOCAL_STORAGE: "chemisee-language",
}

export const BACKEND_CONFIG = {
  LOAD_PATH: "/locales/{{lng}}/translation.json",
}

export const REACT_I18N_CONFIG = {
  USE_SUSPENSE: true,
}

export const INTERPOLATION_CONFIG = {
  ESCAPE_VALUE: false,
}

export const NAMESPACE_CONFIG = {
  DEFAULT_NS: "translation",
  NS: ["translation"],
}

export const LANGUAGE_LIST = {
  en: "English",
  de: "German",
  es: "Spanish",
  fr: "French",
}

export const DEFAULT_LANGUAGE = "en"

export const getLanguageCodes = () => Object.keys(LANGUAGE_LIST)

export const findLanguageByCode = (code) => LANGUAGE_LIST[code]
