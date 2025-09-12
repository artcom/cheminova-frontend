import { useEffect } from "react"

import CharacterCarousel from "./components/CharacterCarousel"
import Intro from "./components/Intro"
import { CHARACTER_DATA } from "./constants"
import { MainLayoutContainer } from "./styles"

export default function CharacterShowcase({
  setContent,
  showIntro,
  setShowIntro,
  currentCharacterIndex,
  setCurrentCharacterIndex,
}) {
  useEffect(() => {
    if (!showIntro) {
      const currentCharacter = CHARACTER_DATA[currentCharacterIndex]

      const content = {
        headline: currentCharacter.title,
        description: {
          title: currentCharacter.name,
          text: currentCharacter.description,
        },
      }
      setContent(content)
    }
  }, [currentCharacterIndex, showIntro, setContent])

  const handleCharacterSelection = (index) => {
    setCurrentCharacterIndex(index)
    console.log("Character selected:", CHARACTER_DATA[index].name)
    setShowIntro(false)
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
