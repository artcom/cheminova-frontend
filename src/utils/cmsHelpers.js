const findFirstNodeMatching = (node, predicate) => {
  if (!node) return null
  if (predicate(node)) return node

  if (!Array.isArray(node.children) || node.children.length === 0) {
    return null
  }

  for (const child of node.children) {
    const match = findFirstNodeMatching(child, predicate)
    if (match) return match
  }

  return null
}

const isReflectionNode = (node) =>
  Boolean(node?.reflectionText || node?.returnToMonumentButtonText)

export const extractFromContentTree = {
  getWelcomeLanguage: (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null
    return data[0]
  },

  getWelcomeIntro: (data) => {
    const welcomeLanguage = extractFromContentTree.getWelcomeLanguage(data)
    if (!welcomeLanguage?.children || welcomeLanguage.children.length === 0)
      return null
    return welcomeLanguage.children[0]
  },

  getWelcome: (data) => {
    const welcomeIntro = extractFromContentTree.getWelcomeIntro(data)
    if (!welcomeIntro?.children || welcomeIntro.children.length === 0)
      return null
    return welcomeIntro.children[0]
  },

  getCharacterOverview: (data) => {
    const welcome = extractFromContentTree.getWelcome(data)
    if (!welcome?.children || welcome.children.length === 0) return null
    return welcome.children[0]
  },

  getCharacters: (data) => {
    const characterOverview = extractFromContentTree.getCharacterOverview(data)
    if (!characterOverview?.children) return []
    return characterOverview.children
  },

  getCharacter: (data, index) => {
    const characters = extractFromContentTree.getCharacters(data)
    return characters[index] || null
  },

  getIntroduction: (data, characterIndex) => {
    const character = extractFromContentTree.getCharacter(data, characterIndex)
    if (!character?.children || character.children.length === 0) return null
    return character.children[0]
  },

  getPhotography: (data, characterIndex) => {
    const introduction = extractFromContentTree.getIntroduction(
      data,
      characterIndex,
    )
    if (!introduction?.children || introduction.children.length === 0)
      return null
    return introduction.children[0]
  },

  getExploration: (data, characterIndex) => {
    const photography = extractFromContentTree.getPhotography(
      data,
      characterIndex,
    )
    if (!photography?.children || photography.children.length === 0) return null
    return photography.children[0]
  },

  getPerspective: (data, characterIndex) => {
    const exploration = extractFromContentTree.getExploration(
      data,
      characterIndex,
    )
    if (!exploration?.children || exploration.children.length === 0) return null
    return exploration.children[0]
  },

  getUpload: (data, characterIndex) => {
    const perspective = extractFromContentTree.getPerspective(
      data,
      characterIndex,
    )
    if (!perspective?.children || perspective.children.length === 0) return null
    return perspective.children[0]
  },

  getGallery: (data, characterIndex) => {
    const upload = extractFromContentTree.getUpload(data, characterIndex)
    if (!upload?.children || upload.children.length === 0) return null
    return upload.children[0]
  },

  getEnding: (data, characterIndex) => {
    const gallery = extractFromContentTree.getGallery(data, characterIndex)
    if (!gallery?.children || gallery.children.length === 0) return null
    return gallery.children[0]
  },

  getEndingReflection: (data, characterIndex) => {
    const gallery = extractFromContentTree.getGallery(data, characterIndex)
    if (!gallery) return null
    return findFirstNodeMatching(gallery, isReflectionNode)
  },
}
