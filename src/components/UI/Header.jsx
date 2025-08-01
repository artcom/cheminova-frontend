import { styled } from "styled-components"
import { motion } from "framer-motion"
import Headline from "./Headline"
import SubHeadline from "./SubHeadline"

const HeaderContainer = styled(motion.div)`
  display: flex;
  width: 24.5625rem;
  height: 10.5625rem;
  padding: 3.625rem 0.625rem 0.625rem 0.625rem;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
`

const AnimatedSubHeadline = styled(motion.div)`
  width: 100%;
`

const AnimatedHeadline = styled(motion.div)`
  width: 100%;
`

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

function Header({ headline, subheadline }) {
  return (
    <HeaderContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {subheadline && (
        <AnimatedSubHeadline variants={itemVariants}>
          <SubHeadline>{subheadline}</SubHeadline>
        </AnimatedSubHeadline>
      )}
      <AnimatedHeadline variants={itemVariants}>
        <Headline>{headline}</Headline>
      </AnimatedHeadline>
    </HeaderContainer>
  )
}

export default Header
