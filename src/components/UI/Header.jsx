import { AnimatePresence, motion } from "motion/react"
import { styled } from "styled-components"

import Headline from "@ui/Headline"
import LegalNotice from "@ui/LegalNotice"
import SubHeadline from "@ui/SubHeadline"

const HeaderLayout = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 10.5625rem;
  padding: 3.625rem 0.625rem 0.625rem 0.625rem;
  flex-direction: column;
  align-items: center;
  z-index: 3;
`

export default function Header({
  headline,
  subheadline,
  legalNotice,
  setShowScreen,
}) {
  return (
    <HeaderLayout>
      <AnimatePresence mode="popLayout">
        {subheadline && (
          <SubHeadline
            key={`subheadline-${subheadline}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {legalNotice && (
              <LegalNotice key="test-dino" setShowScreen={setShowScreen} />
            )}
            {subheadline}
          </SubHeadline>
        )}
        <Headline
          key={`headline-${headline}`}
          layoutId="headline"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.5, ease: "easeInOut", delay: 0.5 },
          }}
          exit={{ opacity: 0 }}
          transition={{ layout: { duration: 0.2, ease: "easeInOut" } }}
        >
          {headline}
        </Headline>
      </AnimatePresence>
    </HeaderLayout>
  )
}
