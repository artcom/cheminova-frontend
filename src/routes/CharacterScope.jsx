import { CapturedImagesProvider } from "@/providers/CapturedImages/CapturedImagesProvider"
import { loadExperience } from "@/utils/loaderHelpers"
import { Outlet, useLoaderData } from "react-router-dom"

export const id = "character-scope"

export const clientLoader = async ({ params }) => {
  const { tree } = await loadExperience()
  const entry = tree.byId.get(Number(params.pageId))

  return { characterId: entry?.characterNode?.id ?? null }
}

export default function CharacterScope() {
  const { characterId } = useLoaderData()

  return (
    <CapturedImagesProvider key={characterId ?? "no-character"}>
      <Outlet />
    </CapturedImagesProvider>
  )
}
