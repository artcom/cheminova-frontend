import { motion, AnimatePresence } from "motion/react"
import { styled } from "styled-components"
import Headline from "./Headline"
import SubHeadline from "./SubHeadline"
import LegalNotice from "./LegalNotice"

const HeaderLayout = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 10.5625rem;
  padding: 3.625rem 0.625rem 0.625rem 0.625rem;
  flex-direction: column;
  align-items: center;
  z-index: 3;
`

function Header({ headline, subheadline, legalNotice, setShowScreen }) {
  return (
    <HeaderLayout>
      <AnimatePresence mode="popLayout">
        {legalNotice && <LegalNotice setShowScreen={setShowScreen} />}
        {subheadline && (
          <SubHeadline
            key={`subheadline-${subheadline}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {subheadline}
          </SubHeadline>
        )}

        <Headline
          key={`headline-${headline}`}
          layoutId={`headline`}
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

export default Header
