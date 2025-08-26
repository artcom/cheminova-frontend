import { motion } from "motion/react"
import { styled } from "styled-components"

const Headline = styled(motion.div)`
  color: ${(props) => props.theme.colors.background.paper};
  text-align: center;
  font-size: 2.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position: relative;
  z-index: 3;
  width: 100%;
`

export default Headline
