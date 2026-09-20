import { richTextOrNull } from "@ui/richTextOrNull"

import CharacterIntro from "../components/CharacterIntro"
import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function CharacterOnboarding({ node, branches, goTo }) {
  return (
    <WelcomeStepLayout
      subheadline={node.siteName}
      descriptionText={richTextOrNull(node.onboarding)}
      navigationProps={{
        mode: "single",
        onSelect: () => goTo(branches[0]),
      }}
    >
      <CharacterIntro
        characters={branches}
        onCharacterSelect={(index) => goTo(branches[index])}
      />
    </WelcomeStepLayout>
  )
}
