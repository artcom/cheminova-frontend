/**
 * Character Slug Utilities
 *
 * Handles conversion between character slugs (used in URLs) and
 * array indices (used for CMS data access).
 */

/**
 * Extract character slug from CMS character data
 * @param {Object} character - Character object from CMS
 * @returns {string|null} - Character slug or null
 */
export const getCharacterSlug = (character) => {
  if (!character) return null

  // Try slug field first
  if (character.slug) {
    return character.slug
  }

  // Fallback to lowercased name
  if (character.name) {
    return character.name.toLowerCase().trim()
  }

  // Fallback to title
  if (character.title) {
    return character.title.toLowerCase().trim()
  }

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
    const charSlug = getCharacterSlug(char)
    return charSlug?.toLowerCase() === normalizedSlug
  })

  return index >= 0 ? index : null
}
