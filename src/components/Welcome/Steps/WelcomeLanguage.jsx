import IntroLanguageChooser from "../components/IntroLanguageChooser"

export default function WelcomeLanguage({ node, locale, next, goTo }) {
  return (
    <IntroLanguageChooser
      welcomeLanguage={node}
      currentContentLocale={locale}
      onLanguageSelected={() => goTo(next)}
    />
  )
}
