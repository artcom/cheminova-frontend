import { useNavigate, useOutletContext } from "react-router-dom"

import IntroLanguageChooser from "../components/IntroLanguageChooser"

export default function WelcomeLanguage() {
  const { welcomeLanguage } = useOutletContext()
  const navigate = useNavigate()

  return (
    <>
      <IntroLanguageChooser
        welcomeLanguage={welcomeLanguage}
        onLanguageSelected={() => navigate("/intro")}
      />
    </>
  )
}
