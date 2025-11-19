import { AnimatePresence, motion } from "motion/react"

import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"

import { ChildrenContainer, TextLayout } from "../styles"

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
      {children && <ChildrenContainer>{children}</ChildrenContainer>}

      <TextLayout $hasDescription={hasDescription}>
        <AnimatePresence mode="wait">
          <motion.div
            key={headline || "empty"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: hasDescription ? "space-between" : "flex-start",
            }}
          >
            {headline && (
              <Header
                headline={headline}
                subheadline={subheadline}
                legalNotice={legalNotice}
              />
            )}
            {descriptionText && (
              <Description
                title={descriptionTitle || ""}
                text={descriptionText}
                headline={headline}
                subheadline={subheadline}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </TextLayout>

      {navigationProps && (
        <Navigation position="default" {...navigationProps} />
      )}
    </>
  )
}
