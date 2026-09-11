import {
  allContentQuery,
  allLocalesContentQuery,
  charactersQuery,
} from "@/api/queries"
import { buildExperienceTree } from "@/experience/tree"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"

export async function loadCmsContent({ locale } = {}) {
  const resolvedLocale = locale ?? getCurrentLocale()
  const query = allContentQuery(resolvedLocale)
  const content = await queryClient.ensureQueryData(query)

  return { content, locale: resolvedLocale }
}

export async function loadExperience({ locale } = {}) {
  const resolvedLocale = locale ?? getCurrentLocale()
  const [content, characters, allLocalesContent] = await Promise.all([
    queryClient.ensureQueryData(allContentQuery(resolvedLocale)),
    queryClient.ensureQueryData(charactersQuery(resolvedLocale)),
    queryClient.ensureQueryData(allLocalesContentQuery()),
  ])

  return {
    content,
    characters,
    allLocalesContent,
    locale: resolvedLocale,
    tree: buildExperienceTree(content, resolvedLocale),
  }
}

export function requireContentSection(section, message, status = 500) {
  if (!section) {
    throw new Response(message, { status })
  }

  return section
}
