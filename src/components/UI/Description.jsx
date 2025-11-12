import { motion } from "motion/react"
import { styled } from "styled-components"

const DescriptionBlock = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
`

const DescriptionTitle = styled.div`
  height: 1.6875rem;
  align-self: stretch;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const DescriptionText = styled.div`
  align-self: stretch;
  color: #fff;
  text-align: justify;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
  hyphens: auto;
`

export default function Description({ title, text, headline, subheadline }) {
  return (
    <DescriptionBlock
      key={`description-${headline}-${subheadline}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.6,
        ease: "easeOut",
      }}
    >
      <DescriptionTitle>{title}</DescriptionTitle>
      <DescriptionText>{text}</DescriptionText>
    </DescriptionBlock>
  )
}
