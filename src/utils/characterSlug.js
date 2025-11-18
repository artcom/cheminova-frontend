const NAME_TO_SLUG = {
  amara: "artist",
  mateo: "janitor",
  nova: "future",
}

const INDEX_TO_SLUG = {
  0: "artist",
  1: "janitor",
  2: "future",
}

export const getCharacterSlug = (character, characters = null) => {
  if (!character) return null

  if (character.slug) {
    return character.slug
  }

  if (character.name) {
    const normalizedName = character.name.toLowerCase().trim()
    const slug = NAME_TO_SLUG[normalizedName]
    if (slug) {
      return slug
    }
  }

  if (character.title) {
    const normalizedTitle = character.title.toLowerCase().trim()
    const slug = NAME_TO_SLUG[normalizedTitle]
    if (slug) {
      return slug
    }
  }

  if (characters) {
    const index = characters.indexOf(character)
    if (index >= 0 && INDEX_TO_SLUG[index]) {
      return INDEX_TO_SLUG[index]
    }
  }

  console.warn("Character slug fallback failed: no slug found", character)
  return null
}

export const findCharacterIndexBySlug = (characters, slug) => {
  if (!characters || !slug) return null

  const normalizedSlug = slug.toLowerCase().trim()

  const index = characters.findIndex((char) => {
    const charSlug = getCharacterSlug(char, characters)
    return charSlug?.toLowerCase() === normalizedSlug
  })

  return index >= 0 ? index : null
}
