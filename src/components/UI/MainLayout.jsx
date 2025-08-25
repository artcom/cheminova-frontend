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
  flex-direction: column;
  justify-content: ${({ $hasDescription }) =>
    $hasDescription ? "space-between" : "flex-start"};
  align-items: flex-start;
  gap: 0;
  flex: 1 0 0;
`

const ChildrenContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  z-index: 1;
`

export default function MainLayout({
  headline,
  subheadline,
  descriptionTitle,
  descriptionText,
  onPrev,
  onNext,
  onSelect,
  backgroundImage,
  children,
  vignetteIntensity = 25,
  navigationMode = "dual",
  singleButtonVariant = "arrowDown",
  navigationPosition = "default",
  isFirstPage = false,
  screenIndex = 0,
  setShowScreen,
}) {
  if (children && !headline && !descriptionTitle && !navigationMode) {
    return <Layout>{children}</Layout>
  }

  return (
    <Layout $backgroundImage={backgroundImage}>
      {children && <ChildrenContainer>{children}</ChildrenContainer>}
      {(backgroundImage || vignetteIntensity) && (
        <Vignette
          intensity={vignetteIntensity}
          isCharacterScreen={screenIndex === 1}
          screenIndex={screenIndex}
        />
      )}
      {isFirstPage && <FullscreenButton />}
      {(headline || descriptionTitle) && (
        <TextLayout $hasDescription={!!descriptionTitle}>
          {headline && (
            <Header
              headline={headline}
              subheadline={subheadline}
              legalNotice={isFirstPage}
              setShowScreen={setShowScreen}
            />
          )}
          {descriptionTitle && (
            <Description
              title={descriptionTitle}
              text={descriptionText}
              headline={headline}
              subheadline={subheadline}
            />
          )}
        </TextLayout>
      )}
      <Navigation
        mode={navigationMode}
        onPrev={onPrev}
        onNext={onNext}
        onSelect={onSelect}
        singleButtonVariant={singleButtonVariant}
        position={navigationPosition}
      />
    </Layout>
  )
}
