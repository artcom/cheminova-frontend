import LaNau from "@ui/assets/LaNau.webp"
import CharacterShowcase from "@components/CharacterShowcase"
import PhotoCapture from "@components/PhotoCapture"

export const createMainLayoutScreens = (setScreenIndex) => [
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
    headline: "La Nau",
    descriptionTitle: "Choose your guide",
    descriptionText:
      "Select your guide for this immersive journey through La Nau.",
    backgroundImage: LaNau,
    vignetteIntensity: 50,
    navigationMode: "single",
    children: (
      <CharacterShowcase onCharacterSelected={() => setScreenIndex(2)} />
    ),
  },
  {
    headline: "Character Selected!",
    subheadline: "Your journey begins",
    descriptionTitle: "Welcome to your adventure",
    descriptionText:
      "You have successfully selected your character. Your personalized experience awaits!",
    vignetteIntensity: 20,
    backgroundImage: LaNau,
    navigationMode: "dual",
  },
  {
    headline: "Ready to Explore",
    subheadline: "The adventure continues",
    descriptionTitle: "Discover Camp Nou",
    descriptionText:
      "Step into the world of FC Barcelona and explore every corner of this iconic stadium. Your personalized journey through history awaits.",
    vignetteIntensity: 25,
    backgroundImage: LaNau,
    navigationMode: "dual",
  },
  {
    children: <PhotoCapture />,
  },
]
