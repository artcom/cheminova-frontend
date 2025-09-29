import { useCharactersFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useEffect } from "react"

import CharacterCarousel from "./components/CharacterCarousel"
import Intro from "./components/Intro"
import { MainLayoutContainer } from "./styles"

export default function CharacterShowcase({
  setContent,
  showIntro,
  setShowIntro,
}) {
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()
  const { data: charactersData } = useCharactersFromAll()

  useEffect(() => {
    if (!showIntro && charactersData && charactersData.length > 0) {
      const currentCharacter = charactersData[currentCharacterIndex]

      const content = {
        headline: currentCharacter.title || currentCharacter.name,
        description: {
          title: currentCharacter.name,
          text: currentCharacter.description,
        },
      }
      setContent(content)
    }
  }, [currentCharacterIndex, showIntro, setContent, charactersData])

  const handleCharacterSelection = (index) => {
    if (charactersData && charactersData.length > 0) {
      setCurrentCharacterIndex(index)
      console.log("Character selected:", charactersData[index].name)
      setShowIntro(false)
    }
  }

  const handleCharacterChange = (newIndex) => {
    setCurrentCharacterIndex(newIndex)
  }

  return (
    <MainLayoutContainer>
      {showIntro ? (
        <Intro onCharacterSelect={handleCharacterSelection} />
      ) : (
        <CharacterCarousel
          selectedIndex={currentCharacterIndex}
          onSelectionChange={handleCharacterChange}
        />
      )}
    </MainLayoutContainer>
  )
}
