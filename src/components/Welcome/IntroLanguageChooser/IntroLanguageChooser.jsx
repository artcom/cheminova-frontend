import { changeLanguage, getCurrentLocale } from "@/i18n"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import {
  ChooserContainer,
  LanguageOption,
  LanguageOptions,
  RadioButton,
  RadioCircle,
  Title,
} from "./styles"

export default function IntroLanguageChooser({ welcomeLanguage }) {
  const [currentLocale, setCurrentLocale] = useState(() => getCurrentLocale())
  const [hasSelected, setHasSelected] = useState(false)

  useEffect(() => {
    // Update local state when language changes
    const handleStorageChange = () => {
      setCurrentLocale(getCurrentLocale())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleLanguageChange = async (languageCode) => {
    setHasSelected(true)
    await changeLanguage(languageCode)
    setCurrentLocale(languageCode)
  }

  const MotionChooserContainer = motion.create(ChooserContainer)

  return (
    <AnimatePresence>
      {!hasSelected && (
        <MotionChooserContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <Title>{welcomeLanguage.chooseLanguageText}</Title>
          <LanguageOptions>
            {welcomeLanguage.languages.map(({ languageId, language }) => (
              <LanguageOption
                key={languageId}
                onClick={() => handleLanguageChange(languageId)}
                $isSelected={currentLocale === languageId}
              >
                <RadioButton $isSelected={currentLocale === languageId}>
                  <RadioCircle $isSelected={currentLocale === languageId} />
                </RadioButton>
                <span>{language}</span>
              </LanguageOption>
            ))}
          </LanguageOptions>
        </MotionChooserContainer>
      )}
    </AnimatePresence>
  )
}
