import { CapturedImagesProvider } from "@/providers/CapturedImages/CapturedImagesProvider"
import { loadCharacterContext } from "@/utils/loaderHelpers"
import { Outlet, useParams } from "react-router-dom"

export default function CharacterLayout() {
  const { characterId } = useParams()

  return (
    <CapturedImagesProvider key={characterId || "character"}>
      <Outlet />
    </CapturedImagesProvider>
  )
}

export const id = "character"

export const clientLoader = async ({ params }) => {
  const { characterSlug, characterIndex, character } =
    await loadCharacterContext(params)

  return { characterIndex, characterSlug, character }
}
