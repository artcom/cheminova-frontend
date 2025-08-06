import { motion } from "motion/react"
import { styled } from "styled-components"
import Header from "./Header"
import Navigation from "./Navigation"
import FullscreenButton from "@ui/FullscreenButton"
import Vignette from "./Vignette"

const Layout = styled.div`
  width: 100dvw;
  height: 100dvh;
  display: grid;
  row-gap: 31.25rem;
  flex: 1 0 0;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-columns: repeat(1, minmax(0, 1fr));
  background-color: ${(props) => props.theme.colors.background.dark};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : "none"};
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
`

const AnimatedHeader = styled(motion.div)`
  flex: 1 0 0;
  align-self: stretch;
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
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
  width: 100dvw;
  height: 100dvh;
  position: absolute;
  top: 0;
  left: 0;
`

export default function MainLayout({
  headline,
  subheadline,
  descriptionTitle,
  descriptionText,
  onPrev,
  onNext,
  backgroundImage,
  children,
  vignetteIntensity = 25,
  navigationMode = "dual",
  singleButtonVariant = "arrowDown",
  isFirstPage = false,
}) {
  if (children) {
    return <FullscreenContainer>{children}</FullscreenContainer>
  }

  return (
    <Layout $backgroundImage={backgroundImage}>
      {backgroundImage && <Vignette $intensity={vignetteIntensity} />}

      {isFirstPage && <FullscreenButton />}

      <AnimatedHeader
        key={`header-${headline}-${subheadline}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Header headline={headline} subheadline={subheadline} />
      </AnimatedHeader>

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
        <DescriptionTitle>{descriptionTitle}</DescriptionTitle>
        <DescriptionText>{descriptionText}</DescriptionText>

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
