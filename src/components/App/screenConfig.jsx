import LaNau from "@ui/assets/LaNau.webp"
import CharacterShowcase from "@components/CharacterShowcase"
import PhotoCapture from "@components/PhotoCapture"
import Introduction from "@components/Introduction"
import Gallery from "@components/Gallery"

export const createMainLayoutScreens = (
  setScreenIndex,
  selectedCharacter = null,
  onCharacterChange = null,
  characterNavHandlers = null,
) => [
  {
    headline: "La Nau",
    subheadline: "Experiencing",
    backgroundImage: LaNau,
    vignetteIntensity: 30,
    navigationMode: "single",
    singleButtonVariant: "arrowDown",
    isFirstPage: true,
  },
  {
    headline: selectedCharacter ? selectedCharacter.title : "La Nau",
    descriptionTitle: selectedCharacter
      ? selectedCharacter.name
      : "Choose your guide",
    descriptionText: selectedCharacter
      ? selectedCharacter.description
      : "Select your guide for this immersive journey through La Nau.",
    backgroundImage: LaNau,
    vignetteIntensity: 50,
    navigationMode: selectedCharacter ? "select" : null,
    onPrev: characterNavHandlers?.onPrev,
    onNext: characterNavHandlers?.onNext,
    onSelect: characterNavHandlers?.onSelect,
    children: (
      <CharacterShowcase
        onCharacterSelected={() => setScreenIndex(2)}
        onCharacterChange={onCharacterChange}
        onPrev={characterNavHandlers?.onPrev}
        onNext={characterNavHandlers?.onNext}
        onSelect={characterNavHandlers?.onSelect}
      />
    ),
  },
  {
    children: <Introduction onNext={() => setScreenIndex(3)} />,
    navigationMode: null,
  },
  {
    children: <PhotoCapture />,
    navigationMode: "single",
    navigationPosition: "bottom",
    singleButtonVariant: "arrowDown",
    vignetteIntensity: 0,
  },
  {
    children: <Gallery />,
    navigationMode: null,
  },
]
