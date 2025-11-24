import { motion } from "motion/react"

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
      {children && (
        <ChildrenContainer
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </ChildrenContainer>
      )}

      <TextLayout $hasDescription={hasDescription}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: hasDescription ? "space-between" : "flex-start",
          }}
        >
          {(headline || subheadline) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: "auto" }}
            >
              <Header
                headline={headline}
                subheadline={subheadline}
                legalNotice={legalNotice}
              />
            </motion.div>
          )}
          {descriptionText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
        </motion.div>
      </TextLayout>

      {navigationProps && (
        <Navigation position="default" {...navigationProps} />
      )}
    </>
  )
}
