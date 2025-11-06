import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { useEffect } from "react"
import { Outlet, useLoaderData } from "react-router-dom"

export default function CharacterLayout() {
  const { characterIndex } = useLoaderData()
  const { setCurrentCharacterIndex } = useGlobalState()

  useEffect(() => {
    if (typeof characterIndex === "number") {
      setCurrentCharacterIndex(characterIndex)
    }
  }, [characterIndex, setCurrentCharacterIndex])

  return <Outlet />
}

export const id = "character"

export async function clientLoader({ params }) {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characterId = params.characterId
  const characterIndex = Number.parseInt(characterId ?? "", 10)

  if (Number.isNaN(characterIndex) || characterIndex < 0) {
    throw new Response("Character not found", { status: 404 })
  }

  const characters = extractFromContentTree.getCharacters(content)

  if (!characters?.[characterIndex]) {
    throw new Response("Character not found", { status: 404 })
  }

  return { characterIndex }
}
