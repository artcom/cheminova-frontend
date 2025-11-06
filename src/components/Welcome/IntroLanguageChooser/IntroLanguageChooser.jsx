import { changeLanguage, getCurrentLocale } from "@/i18n"
import { useLanguages } from "@/providers/LanguageProvider"
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

export default function IntroLanguageChooser() {
  const [currentLocale, setCurrentLocale] = useState(() => getCurrentLocale())
  const [hasSelected, setHasSelected] = useState(false)
  const { supportedLanguages, isLoading, isSuccess } = useLanguages()

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

  const languageEntries = Object.entries(supportedLanguages)

  if (isLoading || !isSuccess) {
    return null
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
          <Title>Choose Language</Title>
          <LanguageOptions>
            {languageEntries.map(([code, name]) => (
              <LanguageOption
                key={code}
                onClick={() => handleLanguageChange(code)}
                $isSelected={currentLocale === code}
              >
                <RadioButton $isSelected={currentLocale === code}>
                  <RadioCircle $isSelected={currentLocale === code} />
                </RadioButton>
                <span>{name}</span>
              </LanguageOption>
            ))}
          </LanguageOptions>
        </MotionChooserContainer>
      )}
    </AnimatePresence>
  )
}
