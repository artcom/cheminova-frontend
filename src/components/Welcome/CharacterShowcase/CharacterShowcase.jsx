import useGlobalState from "@/hooks/useGlobalState"
import { useRouteLoaderData } from "react-router-dom"

import CharacterCarousel from "./components/CharacterCarousel"
import Intro from "./components/Intro"
import { MainLayoutContainer } from "./styles"

export default function CharacterShowcase({
  showIntro,
  setShowIntro,
  characters,
}) {
  const { currentCharacterIndex, setCurrentCharacterIndex } = useGlobalState()
  const loaderData = useRouteLoaderData("welcome")

  const charactersData = characters ?? loaderData?.characters ?? []

  const handleCharacterSelection = (index) => {
    if (charactersData && charactersData.length > 0) {
      setCurrentCharacterIndex(index)
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
