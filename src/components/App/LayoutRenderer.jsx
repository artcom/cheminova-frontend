import useGlobalState from "@/hooks/useGlobalState"
import { styled } from "styled-components"

import Description from "@ui/Description"
import FullscreenButton from "@ui/FullscreenButton"
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

const FullLayoutContainer = styled.div`
  width: 100dvw;
  height: 100dvh;
  position: relative;
`

export default function LayoutRenderer({ screen, setShowScreen }) {
  const { component: Component, layout = {}, navigation = {} } = screen
  const { currentScreenIndex } = useGlobalState()
  const isFirstPage = currentScreenIndex === 0

  if (layout.type === "full") {
    return (
      <FullLayoutContainer>
        <Component />
      </FullLayoutContainer>
    )
  }

  const {
    backgroundImage,
    headline,
    subheadline,
    description,
    showFullscreenButton = false,
  } = layout

  const {
    mode = "none",
    position = "default",
    variant = "arrowDown",
  } = navigation

  return (
    <Layout $backgroundImage={backgroundImage}>
      {Component && (
        <ChildrenContainer>
          <Component />
        </ChildrenContainer>
      )}

      <Vignette screenIndex={currentScreenIndex} />

      {(showFullscreenButton || isFirstPage) && <FullscreenButton />}

      {(headline || description) && (
        <TextLayout $hasDescription={!!description}>
          {headline && (
            <Header
              headline={headline}
              subheadline={subheadline}
              legalNotice={isFirstPage}
              setShowScreen={setShowScreen}
            />
          )}
          {description && (
            <Description
              title={description.title}
              text={description.text}
              headline={headline}
              subheadline={subheadline}
            />
          )}
        </TextLayout>
      )}

      {mode !== "none" && (
        <Navigation
          mode={mode}
          singleButtonVariant={variant}
          position={position}
        />
      )}
    </Layout>
  )
}
