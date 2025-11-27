import { getCharacterSlug } from "@/utils/characterSlug"
import { preloadImages } from "@/utils/preloadImages"
import { useEffect, useState } from "react"
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

  useEffect(() => {
    if (!currentCharacter) return

    const preloadAssets = async () => {
      // The introduction is the first child of the character node
      const introduction = currentCharacter.children?.[0]

      if (!introduction) return

      const imagesToPreload = [
        introduction.backgroundImage?.file,
        introduction.image?.file,
        introduction.characterImage?.file,
        currentCharacter.selectedImage,
        currentCharacter.characterImage?.file,
      ].filter(Boolean)

      // Start preloading images
      preloadImages(imagesToPreload)

      // Preload Rive animation for artist
      if (currentCharacterSlug === "artist") {
        fetch("/amaraWriting.riv").then((response) => response.blob())
      }
    }

    preloadAssets()
  }, [selectedIndex, currentCharacter, currentCharacterSlug])

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
        selectDisabled: false,
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
