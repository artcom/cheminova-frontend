import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import { getCurrentLocale } from "@/i18n"
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

export default function Perspective() {
  const { characterIndex: currentCharacterIndex, perspective } = useLoaderData()
  const [imageLoaded, setImageLoaded] = useState(false)
  const navigate = useNavigate()
  const isLoading = false

  useEffect(() => {
    const imageUrl = perspective?.backgroundImage?.file
    if (imageUrl) {
      const img = new Image()
      img.onload = () => setImageLoaded(true)
      img.onerror = () => setImageLoaded(false)
      img.src = imageUrl
    } else {
      setImageLoaded(false)
    }
  }, [perspective?.backgroundImage])

  const heading = perspective?.heading || ""
  const description = perspective?.description
    ? perspective.description.replace(/<[^>]*>/g, "")
    : ""

  const backgroundImageUrl =
    imageLoaded && perspective?.backgroundImage?.file
      ? perspective.backgroundImage.file
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

      <Navigation
        mode="single"
        onSelect={() => navigate(`/characters/${currentCharacterIndex}/upload`)}
        disabled={isLoading}
      />
    </Screen>
  )
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const locale = getCurrentLocale()
    const query = allContentQuery(locale)
    const content = await queryClient.ensureQueryData(query)

    const characterId = params.characterId
    const characterIndex = Number.parseInt(characterId ?? "", 10)

    if (Number.isNaN(characterIndex) || characterIndex < 0) {
      throw new Response("Character not found", { status: 404 })
    }

    const perspective = extractFromContentTree.getPerspective(
      content,
      characterIndex,
    )

    if (!perspective) {
      throw new Response("Perspective not found", { status: 404 })
    }
    return { characterIndex, perspective }
  }
