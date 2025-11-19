import { getCharacterSlug } from "@/utils/characterSlug"
import { useState } from "react"
import { useLocation, useNavigate, useOutletContext } from "react-router-dom"

import CharacterCarousel from "../components/CharacterCarousel"
import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function CharacterSelection() {
  const { characters } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [selectedIndex, setSelectedIndex] = useState(
    location.state?.initialIndex || 0,
  )

  const currentCharacter = characters[selectedIndex]
  const currentCharacterSlug = currentCharacter
    ? getCharacterSlug(currentCharacter, characters)
    : null

  const handleNext = () => {
    if (selectedIndex < characters.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    }
  }

  const handleSelect = () => {
    if (currentCharacterSlug) {
      navigate(`/characters/${currentCharacterSlug}/introduction`)
    }
  }

  return (
    <WelcomeStepLayout
      headline={currentCharacter?.name}
      subheadline={currentCharacter?.characterType}
      descriptionText={currentCharacter?.description.replace(/<[^>]*>/g, "")}
      navigationProps={{
        mode: "select",
        onSelect: handleSelect,
        onPrev: handlePrev,
        onNext: handleNext,
        prevDisabled: selectedIndex === 0,
        nextDisabled: selectedIndex === characters.length - 1,
        selectLabel: currentCharacter?.selectButtonText,
      }}
    >
      <CharacterCarousel
        selectedIndex={selectedIndex}
        onSelectionChange={setSelectedIndex}
        characters={characters}
      />
    </WelcomeStepLayout>
  )
}
