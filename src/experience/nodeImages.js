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
