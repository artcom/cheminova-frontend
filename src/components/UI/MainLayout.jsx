import { styled } from "styled-components"

import Description from "@ui/Description"
import Header from "@ui/Header"
import Navigation from "@ui/Navigation"
import Vignette from "@ui/Vignette"

const Layout = styled.div`
  display: flex;
  width: 100dvw;
  height: 100dvh;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.625rem;
  background-color: ${({ theme }) => theme.colors.background.dark};
  background-image: ${({ $backgroundImage }) => `url(${$backgroundImage})`};
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
  vignetteIntensity,
  navigationMode,
  singleButtonVariant,
  navigationPosition,
  isFirstPage,
  screenIndex,
  setShowScreen,
}) {
  if (children && !headline && !descriptionTitle && !navigationMode) {
    return <Layout>{children}</Layout>
  }

  return (
    <Layout $backgroundImage={backgroundImage}>
      {children && <ChildrenContainer>{children}</ChildrenContainer>}
      <Vignette
        intensity={vignetteIntensity || 25}
        isCharacterScreen={screenIndex === 1}
        screenIndex={screenIndex || 0}
      />
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
        mode={navigationMode || "dual"}
        onPrev={onPrev}
        onNext={onNext}
        onSelect={onSelect}
        singleButtonVariant={singleButtonVariant || "arrowDown"}
        position={navigationPosition || "default"}
      />
    </Layout>
  )
}
