import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"

export async function loadCmsContent({ locale } = {}) {
  const resolvedLocale = locale ?? getCurrentLocale()
  const query = allContentQuery(resolvedLocale)
  const content = await queryClient.ensureQueryData(query)

  return { content, locale: resolvedLocale }
}

export async function loadCharacterContext(params, options = {}) {
  const characterSlug = params?.characterId

  if (!characterSlug) {
    throw new Response("Character id is required", { status: 400 })
  }

  const { locale, content } = options.content
    ? { locale: options.locale ?? getCurrentLocale(), content: options.content }
    : await loadCmsContent({ locale: options.locale })

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  const character = extractFromContentTree.getCharacter(content, characterIndex)

  if (!character) {
    throw new Response("Character data missing from CMS", { status: 500 })
  }

  return {
    characterSlug,
    characterIndex,
    character,
    characters,
    content,
    locale,
  }
}

export function requireContentSection(section, message, status = 500) {
  if (!section) {
    throw new Response(message, { status })
  }

  return section
}
