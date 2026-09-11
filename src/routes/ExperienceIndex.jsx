import { loadExperience } from "@/utils/loaderHelpers"
import { redirect } from "react-router-dom"

export const id = "experience-index"

export const clientLoader = async () => {
  const { tree } = await loadExperience()

  if (!tree.root) {
    throw new Response("No CMS content available", { status: 503 })
  }

  throw redirect(`/page/${tree.root.id}`)
}

export default function ExperienceIndex() {
  return null
}
