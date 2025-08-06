import { motion } from "motion/react"
import { styled } from "styled-components"
import Headline from "./Headline"
import SubHeadline from "./SubHeadline"

const HeaderLayout = styled(motion.div)`
  display: flex;
  width: 100%;
  height: 10.5625rem;
  padding: 3.625rem 0.625rem 0.625rem 0.625rem;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
`

function Header({ headline, subheadline }) {
  return (
    <HeaderLayout
      key={`header-${headline}-${subheadline}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {subheadline && (
        <SubHeadline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {subheadline}
        </SubHeadline>
      )}
      <Headline
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {headline}
      </Headline>
    </HeaderLayout>
  )
}

export default Header
