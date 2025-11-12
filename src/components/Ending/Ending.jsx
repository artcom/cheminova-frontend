import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import { useEffect, useState } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"
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
  opacity: ${(props) => (props.$imageUrl ? "0.4" : "0")};
  z-index: 0;
  transition: opacity 0.5s ease-in-out;
`

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
`

const Headline = styled.h1`
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 2.625rem;
  font-style: normal;
  padding-top: 2rem;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 2rem;
  opacity: ${(props) => (props.$isLoading ? "0.5" : "1")};
  transition: opacity 0.3s ease-in-out;
  text-align: left;
`

const Description = styled.div`
  width: 21.375rem;
  max-width: 100%;
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 3rem;
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

const ThankYouMessage = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.125rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transform: ${(props) =>
    props.$visible ? "translateY(0)" : "translateY(20px)"};
  opacity: ${(props) => (props.$visible ? "1" : "0")};
  transition: all 0.5s ease-in-out;
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
`

const NavigationWrapper = styled.div`
  margin-top: auto;
  padding-top: 2rem;
`

export default function Ending() {
  const { ending } = useLoaderData()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const navigate = useNavigate()
  const isLoading = false

  useEffect(() => {
    const imageUrl = ending?.backgroundImage?.file || null

    if (!imageUrl) {
      const timeoutId = setTimeout(() => setImageLoaded(false), 0)
      return () => clearTimeout(timeoutId)
    }

    const resetTimeoutId = setTimeout(() => setImageLoaded(false), 0)
    const img = new Image()
    const handleLoad = () => setImageLoaded(true)
    const handleError = () => setImageLoaded(false)
    img.addEventListener("load", handleLoad)
    img.addEventListener("error", handleError)
    img.src = imageUrl

    return () => {
      clearTimeout(resetTimeoutId)
      img.removeEventListener("load", handleLoad)
      img.removeEventListener("error", handleError)
    }
  }, [ending?.backgroundImage?.file])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCelebration(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Use CMS data - it's localized based on current language
  const heading = ending?.heading || ""
  const description = ending?.description
    ? ending.description.replace(/<[^>]*>/g, "")
    : ""

  const backgroundImageUrl =
    imageLoaded && ending?.backgroundImage?.file
      ? ending.backgroundImage.file
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

        {!isLoading && (
          <ThankYouMessage $visible={showCelebration}>
            {heading}
          </ThankYouMessage>
        )}

        <NavigationWrapper>
          <Navigation
            mode="single"
            onSelect={() => navigate("/")}
            disabled={isLoading}
          />
        </NavigationWrapper>
      </Content>
    </Screen>
  )
}

export async function clientLoader({ params }) {
  const characterSlug = params.characterId
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  const ending = extractFromContentTree.getEnding(content, characterIndex)

  if (!ending) {
    throw new Response("Ending not found", { status: 404 })
  }

  const endingMetas = extractFromContentTree.getEndingMetas(
    content,
    characterIndex,
  )

  return { characterIndex, characterSlug, ending, endingMetas }
}
