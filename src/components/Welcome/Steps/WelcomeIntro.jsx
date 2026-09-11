import { sanitizeRichText } from "@/utils/text"

import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function WelcomeIntro({ node, next, goTo }) {
  return (
    <WelcomeStepLayout
      headline={node.title}
      subheadline={node.siteName}
      descriptionTitle={node.description}
      descriptionText={sanitizeRichText(node.introText)}
      legalNotice={true}
      navigationProps={{
        mode: "single",
        onSelect: () => goTo(next),
      }}
    />
  )
}
