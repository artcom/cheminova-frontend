import { fetchAllLocalesContent, getContentForLocale } from "@/api/djangoApi"
import { queryKeys } from "@/api/hooks"

export const allContentQuery = (locale) => ({
  queryKey: [...queryKeys.all, "locale", locale],
  queryFn: async () => {
    const allLocalesContent = await fetchAllLocalesContent()
    return getContentForLocale(allLocalesContent, locale)
  },
})
