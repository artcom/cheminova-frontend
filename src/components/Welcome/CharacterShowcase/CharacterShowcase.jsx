import { useCharactersFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"

import CharacterCarousel from "./components/CharacterCarousel"
import Intro from "./components/Intro"
import { MainLayoutContainer } from "./styles"

export default function CharacterShowcase({
  showIntro,
  setShowIntro,
}) {
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()
  const { data: charactersData } = useCharactersFromAll()

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
