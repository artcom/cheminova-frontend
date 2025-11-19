import { useNavigate, useOutletContext } from "react-router-dom"

import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function WelcomeContext() {
  const { welcome } = useOutletContext()
  const navigate = useNavigate()

  if (!welcome) return null

  return (
    <WelcomeStepLayout
      headline={welcome.title}
      subheadline={welcome.siteName}
      descriptionTitle={welcome.description}
      descriptionText={welcome.introText.replace(/<[^>]*>/g, "")}
      navigationProps={{
        mode: "single",
        onSelect: () => navigate("/onboarding"),
      }}
    />
  )
}
