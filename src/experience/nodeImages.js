/**
 * Collects every image URL reachable on a node's own fields, so the engine can preload them
 * before the screen paints. `children` is skipped — those are other pages with their own images.
 */
export function imageUrlsOf(node) {
  const urls = new Set()

  const visit = (value) => {
    if (!value || typeof value !== "object") return

    if (Array.isArray(value)) {
      value.forEach(visit)
      return
    }

    if (typeof value.file === "string") {
      urls.add(value.file)
    }

    for (const [key, nested] of Object.entries(value)) {
      if (key !== "children") visit(nested)
    }
  }

  visit(node)

  return [...urls]
}

const CHOICE_TYPE = "choose-option"

/**
 * The card images of the options a choice offers.
 *
 * They sit on the child pages, which `imageUrlsOf` skips, but they paint as part of the
 * choice screen itself, so the engine preloads them with it.
 */
export function optionCardImageUrlsOf(node) {
  if (node?.type !== CHOICE_TYPE) return []

  return (node.children ?? [])
    .map((child) => child.optionImage?.file)
    .filter(Boolean)
}
