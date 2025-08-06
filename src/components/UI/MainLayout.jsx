import { motion } from "motion/react"
import { styled } from "styled-components"
import Header from "./Header"
import Navigation from "./Navigation"
import Description from "./Description"
import FullscreenButton from "@ui/FullscreenButton"
import Vignette from "./Vignette"

const Layout = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  background-color: ${(props) => props.theme.colors.background.dark};
  background-image: ${({ $backgroundImage }) =>
    $backgroundImage ? `url(${$backgroundImage})` : "none"};
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
`

const TextLayout = styled.div`
  display: flex;
  width: 24.5625rem;
  margin: 0 auto;
  padding: 0 1.5625rem;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 29.9375rem;
  flex: 1 0 0;
`
const AnimatedHeader = styled(motion.div)`
  width: 100%;
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: flex-start;
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
      <TextLayout>
        <AnimatedHeader
          key={`header-${headline}-${subheadline}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Header headline={headline} subheadline={subheadline} />
        </AnimatedHeader>
        <Description
          title={descriptionTitle}
          text={descriptionText}
          headline={headline}
          subheadline={subheadline}
        />
      </TextLayout>
      <Navigation
        mode={navigationMode}
        onPrev={onPrev}
        onNext={onNext}
        singleButtonVariant={singleButtonVariant}
      />
    </Layout>
  )
}
