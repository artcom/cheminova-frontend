import { usePerspectiveFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import { useEffect, useState } from "react"
import { styled } from "styled-components"

import LoadingSpinner from "../UI/LoadingSpinner"
import Navigation from "../UI/Navigation"

const Screen = styled.div`
  position: relative;
  width: 100dvw;
  height: 100dvh;
  padding: var(--safe-inset-top) 1.625rem calc(var(--safe-inset-bottom) + 7rem)
    1.625rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  overflow: hidden;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${(props) =>
    props.$imageUrl ? `url(${props.$imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${(props) => (props.$imageUrl ? "0.3" : "0")};
  z-index: 0;
  transition: opacity 0.5s ease-in-out;
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Headline = styled.h1`
  margin-top: 10.75rem;
  font-family: "Bricolage Grotesque";
  font-size: 2.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 1.5rem;
  opacity: ${(props) => (props.$isLoading ? "0.5" : "1")};
  transition: opacity 0.3s ease-in-out;
`

const Description = styled.div`
  width: 21.375rem;
  max-width: 100%;
  font-family: "Bricolage Grotesque";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 2rem;
  opacity: ${(props) => (props.$isLoading ? "0.5" : "1")};
  transition: opacity 0.3s ease-in-out;

  p {
    margin: 0 0 1rem 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    font-weight: 800;
  }

  em {
    font-style: italic;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`

export default function Perspective({ goToUpload }) {
  const { currentCharacterIndex } = useGlobalState()
  const { data: perspectiveData, isLoading } = usePerspectiveFromAll(
    currentCharacterIndex,
  )
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const imageUrl = perspectiveData?.backgroundImage?.file
    if (imageUrl) {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
      img.src = imageUrl
    } else {
      setImageLoaded(false)
    }
  }, [perspectiveData?.backgroundImage])

  // Use CMS data - it's localized based on current language
  const heading = perspectiveData?.heading || ""
  const description = perspectiveData?.description
    ? perspectiveData.description.replace(/<[^>]*>/g, "")
    : ""

  const backgroundImageUrl =
    imageLoaded && perspectiveData?.backgroundImage?.file
      ? perspectiveData.backgroundImage.file
      : null

  return (
    <Screen>
      <BackgroundImage $imageUrl={backgroundImageUrl} />

      <Content>
        <Headline $isLoading={isLoading}>{heading}</Headline>

        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}

        {!isLoading && description && <Description>{description}</Description>}
      </Content>

      <Navigation mode="single" onSelect={goToUpload} disabled={isLoading} />
    </Screen>
  )
}
