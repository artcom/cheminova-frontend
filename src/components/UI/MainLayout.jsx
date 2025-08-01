import { styled } from "styled-components"
import { motion } from "framer-motion"
import Header from "./Header"
import Navigation from "./Navigation"
import Vignette from "./Vignette"

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  row-gap: 31.25rem;
  flex: 1 0 0;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-columns: repeat(1, minmax(0, 1fr));
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : "none"};
  background-size: cover;
  background-position: center;
  position: relative;
`

const StyledHeader = styled(Header)`
  flex: 1 0 0;
  align-self: stretch;
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
  position: relative;
  z-index: 2;
`

const DescriptionBlock = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  flex: 1 0 0;
  align-self: stretch;
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
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
  text-align: center;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const FullscreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`

export default function MainLayout({
  headline,
  subheadline,
  descriptionTitle,
  descriptionText,
  onPrev,
  onNext,
  backgroundImage,
  topRightAction,
  children,
  fullscreenComponent,
  vignetteIntensity = 25,
  navigationMode = "dual",
  singleButtonVariant = "arrowDown",
}) {
  // If fullscreenComponent is provided, render it without navigation
  if (fullscreenComponent) {
    return (
      <FullscreenContainer>
        {topRightAction}
        {fullscreenComponent}
      </FullscreenContainer>
    )
  }

  // Default layout for regular content
  return (
    <Layout $backgroundImage={backgroundImage}>
      {backgroundImage && <Vignette intensity={vignetteIntensity} />}
      {topRightAction}
      <StyledHeader headline={headline} subheadline={subheadline} />
      <DescriptionBlock
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.8,
          ease: "easeOut",
        }}
      >
        <DescriptionTitle>{descriptionTitle}</DescriptionTitle>
        <DescriptionText>{descriptionText}</DescriptionText>
        {children}
        <Navigation
          mode={navigationMode}
          onPrev={onPrev}
          onNext={onNext}
          singleButtonVariant={singleButtonVariant}
        />
      </DescriptionBlock>
    </Layout>
  )
}
