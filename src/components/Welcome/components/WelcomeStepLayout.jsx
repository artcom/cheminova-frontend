import { AnimatePresence, motion } from "motion/react"

import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"

import { ChildrenContainer, TextLayout } from "../styles"

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeIn",
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.8, ease: "easeOut" },
      y: { duration: 0.8, ease: "easeOut" },
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
}

export default function WelcomeStepLayout({
  headline,
  subheadline,
  descriptionTitle,
  descriptionText,
  legalNotice = false,
  navigationProps,
  children,
}) {
  const hasDescription = !!(headline || descriptionText)

  return (
    <>
      {children && (
        <ChildrenContainer
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </ChildrenContainer>
      )}

      <TextLayout $hasDescription={hasDescription}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: hasDescription ? "space-between" : "flex-start",
          }}
        >
          <AnimatePresence mode="wait">
            {headline && (
              <motion.div
                key={`header-${headline}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ pointerEvents: "auto" }}
              >
                <Header
                  headline={headline}
                  subheadline={subheadline}
                  legalNotice={legalNotice}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence mode="wait">
            {descriptionText && (
              <motion.div
                key={`desc-${descriptionTitle || descriptionText.substring(0, 10)}`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ pointerEvents: "auto" }}
              >
                <Description
                  title={descriptionTitle || ""}
                  text={descriptionText}
                  headline={headline}
                  subheadline={subheadline}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </TextLayout>

      {navigationProps && (
        <Navigation position="default" {...navigationProps} />
      )}
    </>
  )
}
