/**
 * Character Slug Utilities
 *
 * Handles conversion between character slugs (used in URLs) and
 * array indices (used for CMS data access).
 */

/**
 * Hardcoded slug mapping based on character names
 * This maps character names to their API slugs
 */
const NAME_TO_SLUG = {
  amara: "janitor",
  "amara marroquí": "janitor",
  // Add other character name variations here as needed
}

/**
 * Hardcoded index to slug mapping (fallback)
 * Must match the order in the CMS:
 * Index 0: Artist
 * Index 1: Janitor (Amara)
 * Index 2: Future
 */
const INDEX_TO_SLUG = {
  0: "artist",
  1: "janitor",
  2: "future",
}

/**
 * Extract character slug from CMS character data
 * @param {Object} character - Character object from CMS
 * @param {Array} characters - Optional: All characters array (for index-based fallback)
 * @returns {string|null} - Character slug or null
 */
export const getCharacterSlug = (character, characters = null) => {
  if (!character) return null

  // Try slug field first (if CMS provides it)
  if (character.slug) {
    return character.slug
  }

  // Try name-based lookup
  if (character.name) {
    const normalizedName = character.name.toLowerCase().trim()
    const slug = NAME_TO_SLUG[normalizedName]
    if (slug) {
      return slug
    }
  }

  // Try title-based lookup
  if (character.title) {
    const normalizedTitle = character.title.toLowerCase().trim()
    const slug = NAME_TO_SLUG[normalizedTitle]
    if (slug) {
      return slug
    }
  }

  // Fallback to index-based mapping
  if (characters) {
    const index = characters.indexOf(character)
    if (index >= 0 && INDEX_TO_SLUG[index]) {
      return INDEX_TO_SLUG[index]
    }
  }

  console.warn("Character slug fallback failed: no slug found", character)
  return null
}

/**
 * Find character index by slug from characters array
 * @param {Array} characters - Array of character objects
 * @param {string} slug - Character slug to find
 * @returns {number|null} - Character index or null if not found
 */
export const findCharacterIndexBySlug = (characters, slug) => {
  if (!characters || !slug) return null

  const normalizedSlug = slug.toLowerCase().trim()

  const index = characters.findIndex((char) => {
    const charSlug = getCharacterSlug(char, characters)
    return charSlug?.toLowerCase() === normalizedSlug
  })

  return index >= 0 ? index : null
}

/**
 * Get character slug by index (fallback method)
 * @param {number} index - Character index
 * @returns {string|null} - Character slug or null
 */
export const getCharacterSlugByIndex = (index) => {
  const INDEX_TO_SLUG = {
    0: "janitor",
    1: "future",
    2: "artist",
  }
  return INDEX_TO_SLUG[index] || null
}
