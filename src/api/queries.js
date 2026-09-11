import {
  fetchAllLocalesContent,
  fetchCharacters,
  getContentForLocale,
} from "@/api/djangoApi"

export const queryKeys = {
  apiRoot: ["django", "api-root"],
  all: ["django", "all-content"],
  characters: ["django", "characters"],
}

export const allLocalesContentQuery = () => ({
  queryKey: [...queryKeys.all, "all-locales"],
  queryFn: fetchAllLocalesContent,
})

export const allContentQuery = (locale) => ({
  queryKey: [...queryKeys.all, "locale", locale],
  queryFn: async () => {
    const allLocalesContent = await fetchAllLocalesContent()
    return getContentForLocale(allLocalesContent, locale)
  },
})

export const charactersQuery = (locale) => ({
  queryKey: [...queryKeys.characters, "locale", locale],
  queryFn: async () => {
    const allLocalesCharacters = await fetchCharacters()
    return getContentForLocale(allLocalesCharacters, locale)
  },
})
