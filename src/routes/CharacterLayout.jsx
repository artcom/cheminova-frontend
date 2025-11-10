import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { Outlet } from "react-router-dom"

export default function CharacterLayout() {
  return <Outlet />
}

export const id = "character"

export async function clientLoader({ params }) {
  const characterSlug = params.characterId // Now a slug like "janitor"
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  const character = characters[characterIndex]

  return {
    characterIndex,
    characterSlug,
    character,
  }
}
