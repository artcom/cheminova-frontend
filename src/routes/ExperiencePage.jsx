import { characterCodeFor } from "@/experience/characters"
import ExperienceProvider from "@/experience/ExperienceProvider"
import { imageUrlsOf } from "@/experience/nodeImages"
import { componentForType, layoutForType } from "@/experience/pageRegistry"
import {
  branchesOf,
  firstRenderableNode,
  nextNode,
  siblingsOf,
  translationKeyOf,
} from "@/experience/tree"
import { loadExperience } from "@/utils/loaderHelpers"
import { preloadImages } from "@/utils/preloadImages"
import { createElement, Suspense } from "react"
import { redirect, useLoaderData, useNavigate } from "react-router-dom"

import LoadingSpinner from "@ui/LoadingSpinner"

export const id = "experience-page"

export const clientLoader = async ({ params }) => {
  const { tree, characters, locale, allLocalesContent } = await loadExperience()

  const pageId = Number(params.pageId)
  let entry = tree.byId.get(pageId)

  if (!entry) {
    // The id may belong to another locale's tree — follow the same page across locales,
    // falling back to the root when that branch is untranslated.
    const translationKey = translationKeyOf(allLocalesContent, pageId)
    const remapped = translationKey
      ? tree.byTranslationKey.get(translationKey)
      : null

    if (remapped) {
      throw redirect(`/page/${remapped.node.id}`)
    }

    if (tree.root) {
      throw redirect(`/page/${tree.root.id}`)
    }

    throw new Response(`No CMS page with id ${params.pageId}`, { status: 404 })
  }

  await preloadImages(imageUrlsOf(entry.node))

  return {
    locale,
    tree,
    node: entry.node,
    characterNode: entry.characterNode,
    characterCode: characterCodeFor(
      characters,
      entry.characterNode,
      siblingsOf(tree, entry.characterNode),
    ),
    next: nextNode(entry.node),
    branches: branchesOf(entry.node),
    siblings: siblingsOf(tree, entry.node),
  }
}

export default function ExperiencePage() {
  const {
    tree,
    node,
    characterNode,
    characterCode,
    locale,
    next,
    branches,
    siblings,
  } = useLoaderData()
  const navigate = useNavigate()

  const goTo = (target, options) => {
    const renderable = firstRenderableNode(target)

    if (!renderable) {
      console.warn(
        `Nowhere to go from "${node.type}" (id ${node.id}) — it has no published child page in the CMS.`,
      )
      return
    }

    navigate(`/page/${renderable.id}`, options)
  }

  const screen = componentForType(node.type)

  if (!screen) {
    throw new Response(`No screen for page type "${node.type}"`, {
      status: 501,
    })
  }

  const layout = layoutForType(node.type)

  const experience = {
    tree,
    node,
    characterNode,
    characterCode,
    locale,
    next,
    branches,
    siblings,
    goTo,
  }

  const rendered = (
    <ExperienceProvider value={experience}>
      <Suspense fallback={<LoadingSpinner size="48px" />}>
        {createElement(screen, experience)}
      </Suspense>
    </ExperienceProvider>
  )

  return layout ? createElement(layout, { node, tree }, rendered) : rendered
}
