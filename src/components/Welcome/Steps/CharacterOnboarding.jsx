import { useNavigate, useOutletContext } from "react-router-dom"

import CharacterIntro from "../components/CharacterIntro"
import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function CharacterOnboarding() {
  const { characterOverview, characters } = useOutletContext()
  const navigate = useNavigate()

  const handleCharacterSelect = (index) => {
    navigate("/characters", { state: { initialIndex: index } })
  }

  return (
    <WelcomeStepLayout
      headline={characterOverview.title}
      subheadline={characterOverview.siteName}
      descriptionText={characterOverview.onboarding.replace(/<[^>]*>/g, "")}
      navigationProps={{
        mode: "single",
        onSelect: () => navigate("/characters"),
      }}
    >
      <CharacterIntro
        characters={characters}
        onCharacterSelect={handleCharacterSelect}
      />
    </WelcomeStepLayout>
  )
}
