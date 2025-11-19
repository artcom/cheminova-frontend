import { sanitizeRichText } from "@/utils/text"
import { useNavigate, useOutletContext } from "react-router-dom"

import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function WelcomeIntro() {
  const { welcomeIntro } = useOutletContext()
  const navigate = useNavigate()

  return (
    <>
      <WelcomeStepLayout
        headline={welcomeIntro.title}
        subheadline={welcomeIntro.siteName}
        descriptionTitle={welcomeIntro.description}
        descriptionText={sanitizeRichText(welcomeIntro.introText)}
        legalNotice={true}
        navigationProps={{
          mode: "single",
          onSelect: () => navigate("/context"),
        }}
      />
    </>
  )
}
