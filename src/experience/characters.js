/**
 * Resolves the short character code (`artist`, `janitor`, `future`) that the uploaded-image
 * endpoints are keyed by.
 *
 * The codes live in the CMS: the `Characters` page holds one inline row per character with a
 * `name` and a `slug`. A `choose-character` page carries the persona's first name in `name` and
 * the matching row's name in `characterType`, so `characterType` is the join key.
 */

const normalize = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : ""

const characterRows = (charactersPayload) => {
  const page = Array.isArray(charactersPayload)
    ? charactersPayload[0]
    : charactersPayload
  return page?.characters ?? []
}

export function characterCodeMap(charactersPayload) {
  return new Map(
    characterRows(charactersPayload)
      .filter((row) => row.slug)
      .map((row) => [normalize(row.name), row.slug]),
  )
}

export function characterCodeFor(charactersPayload, characterNode, siblings) {
  if (!characterNode) return null

  const byName = characterCodeMap(charactersPayload)
  const matched = byName.get(normalize(characterNode.characterType))
  if (matched) return matched

  const rows = characterRows(charactersPayload)
  const position = siblings?.findIndex((node) => node.id === characterNode.id)
  if (position >= 0 && rows[position]?.slug) {
    return rows[position].slug
  }

  return null
}
