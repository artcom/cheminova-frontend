import theme from "@theme"
import { motion } from "motion/react"
import { styled } from "styled-components"

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90vh;
  width: 100%;
  background-color: ${theme.colors.background.dark};
  color: ${theme.colors.background.paper};
  font-family: ${theme.fontFamily};
`

const SpinnerRing = styled(motion.div)`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border: 3px solid ${theme.colors.background.paper}30;
  border-top: 3px solid ${theme.colors.background.paper};
  border-radius: 50%;
`

const Title = styled.h2`
  margin: 20px 0 10px 0;
  font-size: 24px;
  font-weight: 300;
  color: ${theme.colors.background.paper};
`

const Subtitle = styled.p`
  margin: 0 0 20px 0;
  font-size: 16px;
  color: ${theme.colors.background.paper};
  opacity: 0.8;
`

const ProgressBar = styled.div`
  width: 300px;
  height: 4px;
  background-color: ${theme.colors.background.paper}30;
  border-radius: 2px;
  overflow: hidden;
`

const ProgressFill = styled(motion.div)`
  height: 100%;
  background-color: ${theme.colors.background.paper};
  border-radius: 2px;
`

const Hint = styled.p`
  margin: 10px 0 0 0;
  font-size: 14px;
  text-align: center;
  max-width: 400px;
  color: ${theme.colors.background.paper};
  opacity: 0.6;
`

export default function GalleryLoader({ loadedCount, totalImages }) {
  const progress = (loadedCount / totalImages) * 100

  return (
    <Wrapper>
      <SpinnerRing
        $size={60}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, ease: "linear", repeat: Infinity }}
      />

      <Title>Loading Gallery</Title>

      <Subtitle>
        {loadedCount} of {totalImages} images loaded
      </Subtitle>

      <ProgressBar>
        <ProgressFill
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </ProgressBar>

      <Hint>Please wait while we prepare your image gallery experience</Hint>
    </Wrapper>
  )
}
