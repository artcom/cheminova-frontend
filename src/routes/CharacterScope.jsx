import { CapturedImagesProvider } from "@/providers/CapturedImages/CapturedImagesProvider"
import { loadExperience } from "@/utils/loaderHelpers"
import { Outlet, useLoaderData } from "react-router-dom"

export const id = "character-scope"

export const clientLoader = async ({ params }) => {
  const { tree } = await loadExperience()
  const entry = tree.byId.get(Number(params.pageId))

  return { characterId: entry?.characterNode?.id ?? null }
}

// A pathless layout keeps the same match pathname on every /page/:pageId, so React Router would
// skip this loader and freeze `characterId` at the page the visitor entered the experience on.
// The CMS content is served from the query cache, so re-running is a cache hit.
export const shouldRevalidate = () => true

export default function CharacterScope() {
  const { characterId } = useLoaderData()

  return (
    <CapturedImagesProvider key={characterId ?? "no-character"}>
      <Outlet />
    </CapturedImagesProvider>
  )
}
