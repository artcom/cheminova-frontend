import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { extractFromContentTree } from "@/utils/cmsHelpers"

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

export async function loadCharacterSection(params, extractor, options = {}) {
  if (typeof extractor !== "function") {
    throw new Error("loadCharacterSection requires an extractor function")
  }

  const {
    missingMessage = "Required content section missing from CMS",
    missingStatus = 500,
    ...contextOptions
  } = options

  const context = await loadCharacterContext(params, contextOptions)

  const section = requireContentSection(
    extractor(context.content, context.characterIndex, context.characters),
    missingMessage,
    missingStatus,
  )

  return { ...context, section }
}
