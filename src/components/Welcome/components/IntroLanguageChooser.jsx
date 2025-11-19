import { changeLanguage, getCurrentLocale } from "@/i18n"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

import {
  ChooserContainer,
  LanguageOption,
  LanguageOptions,
  RadioButton,
  RadioCircle,
  Title,
} from "./IntroLanguageChooserStyles"

const MotionChooserContainer = motion.create(ChooserContainer)

export default function IntroLanguageChooser({
  welcomeLanguage,
  onLanguageSelected,
}) {
  const [currentLocale, setCurrentLocale] = useState(() => getCurrentLocale())
  const [hasSelected, setHasSelected] = useState(false)

  const handleLanguageChange = async (languageCode) => {
    // Update state immediately for instant UI feedback
    setCurrentLocale(languageCode)

    // Wait a bit to show the selection change before fading out
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Then update i18n and localStorage
    await changeLanguage(languageCode)

    // Finally trigger fade out
    setHasSelected(true)
    onLanguageSelected?.()
  }

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
          <LanguageOptions
            as={motion.div}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {welcomeLanguage.languages.map(({ languageId, language }) => (
              <LanguageOption
                as={motion.button}
                key={languageId}
                onClick={() => handleLanguageChange(languageId)}
                $isSelected={currentLocale === languageId}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    },
                  },
                }}
                whileTap={{ scale: 0.98 }}
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
