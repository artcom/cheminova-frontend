import { useNavigate, useOutletContext } from "react-router-dom"

import IntroLanguageChooser from "../components/IntroLanguageChooser"

export default function WelcomeLanguage() {
  const { welcomeLanguage, locale: welcomeLanguageLocale } = useOutletContext()
  const navigate = useNavigate()

  return (
    <>
      <IntroLanguageChooser
        welcomeLanguage={welcomeLanguage}
        currentContentLocale={welcomeLanguageLocale}
        onLanguageSelected={() => navigate("/intro")}
      />
    </>
  )
}
