import { useLocalizedQuery } from "@/hooks/useLocalizedQuery"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"

import { fetchAll, fetchApiRoot } from "./djangoApi"

export const queryKeys = {
  apiRoot: ["django", "api-root"],
  all: ["django", "all-content"],
}

export const extractFromContentTree = {
  getWelcome: (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null
    return data[0]
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

  getCollection: (data, characterIndex) => {
    const photography = extractFromContentTree.getPhotography(
      data,
      characterIndex,
    )
    if (!photography?.children || photography.children.length === 0) return null
    return photography.children[0]
  },

  getPerspective: (data, characterIndex) => {
    const photography = extractFromContentTree.getPhotography(
      data,
      characterIndex,
    )
    if (!photography?.children || photography.children.length === 0) return null
    const collection = photography.children[0]
    if (!collection?.children || collection.children.length === 0) return null
    return collection.children[0]
  },

  getEnding: (data, characterIndex) => {
    const perspective = extractFromContentTree.getPerspective(
      data,
      characterIndex,
    )
    if (!perspective?.children || perspective.children.length === 0) return null
    return perspective.children[0]
  },
}

export const useAllContent = (options = {}) => {
  return useLocalizedQuery({
    queryKey: queryKeys.all,
    queryFn: (localeContent) => localeContent || fetchAll(),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}

export const useWelcomeFromAll = (options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const welcomeData = useMemo(
    () => extractFromContentTree.getWelcome(allContent),
    [allContent],
  )

  return {
    ...queryResult,
    data: welcomeData,
  }
}

export const useCharacterOverviewFromAll = (options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const characterOverviewData = useMemo(
    () => extractFromContentTree.getCharacterOverview(allContent),
    [allContent],
  )

  return {
    ...queryResult,
    data: characterOverviewData,
  }
}

export const useCharactersFromAll = (options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const charactersData = useMemo(
    () => extractFromContentTree.getCharacters(allContent),
    [allContent],
  )

  return {
    ...queryResult,
    data: charactersData,
  }
}

export const useIntroductionFromAll = (characterIndex, options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const introductionData = useMemo(
    () => extractFromContentTree.getIntroduction(allContent, characterIndex),
    [allContent, characterIndex],
  )

  return {
    ...queryResult,
    data: introductionData,
  }
}

export const usePhotographyFromAll = (characterIndex, options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const photographyData = useMemo(
    () => extractFromContentTree.getPhotography(allContent, characterIndex),
    [allContent, characterIndex],
  )

  return {
    ...queryResult,
    data: photographyData,
  }
}

export const useCollectionFromAll = (characterIndex, options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const collectionData = useMemo(
    () => extractFromContentTree.getCollection(allContent, characterIndex),
    [allContent, characterIndex],
  )

  return {
    ...queryResult,
    data: collectionData,
  }
}

export const usePerspectiveFromAll = (characterIndex, options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const perspectiveData = useMemo(
    () => extractFromContentTree.getPerspective(allContent, characterIndex),
    [allContent, characterIndex],
  )

  return {
    ...queryResult,
    data: perspectiveData,
  }
}

export const useEndingFromAll = (characterIndex, options = {}) => {
  const { data: allContent, ...queryResult } = useAllContent(options)

  const endingData = useMemo(
    () => extractFromContentTree.getEnding(allContent, characterIndex),
    [allContent, characterIndex],
  )

  return {
    ...queryResult,
    data: endingData,
  }
}

export const useApiRoot = (options = {}) => {
  return useQuery({
    queryKey: queryKeys.apiRoot,
    queryFn: fetchApiRoot,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  })
}
