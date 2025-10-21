import usePerspectiveContent from "@/hooks/usePerspectiveContent"
import { processImageUrl } from "@/utils/apiUtils"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
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

const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #ff6b6b;
  font-family: "Bricolage Grotesque";
  font-size: 1rem;
  font-weight: 500;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
`

const FallbackContent = styled.div`
  opacity: 0.8;
  font-style: italic;
`

export default function Perspective({ goToUpload }) {
  const { t } = useTranslation()
  const {
    data: perspectiveData,
    isLoading,
    error,
    isError,
  } = usePerspectiveContent()
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    const imageUrl = processImageUrl(perspectiveData?.backgroundImage)
    if (imageUrl) {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
      img.src = imageUrl
    } else {
      setImageLoaded(false)
    }
  }, [perspectiveData?.backgroundImage])

  // Always prefer translations over API content for proper localization
  const title = t("perspective.title")
  const description = t("perspective.description")

  const backgroundImageUrl =
    imageLoaded && perspectiveData?.backgroundImage
      ? processImageUrl(perspectiveData.backgroundImage)
      : null

  return (
    <Screen>
      <BackgroundImage $imageUrl={backgroundImageUrl} />

      <Content>
        <Headline $isLoading={isLoading}>{title}</Headline>

        {isError && (
          <ErrorMessage>
            {error?.message || t("errors.networkError")}
          </ErrorMessage>
        )}

        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              {t("perspective.loading")}
            </div>
          </LoadingContainer>
        )}

        <Description $isLoading={isLoading}>
          <FallbackContent>{description}</FallbackContent>
        </Description>
      </Content>

      <Navigation mode="single" onSelect={goToUpload} disabled={isLoading} />
    </Screen>
  )
}
