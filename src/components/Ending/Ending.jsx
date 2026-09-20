import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

import LoadingSpinner from "../UI/LoadingSpinner"
import Navigation from "../UI/Navigation"
import RichText from "../UI/RichText"
import { richTextStyles } from "../UI/richTextStyles"

const Screen = styled.div`
  position: relative;
  width: 100dvw;
  height: 100dvh;
  padding: 0.5rem 1.625rem calc(var(--safe-inset-bottom) + 7rem) 1.625rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  overflow: hidden;
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

const Description = styled(RichText)`
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

  ${richTextStyles}

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
  margin: 2rem 0;
`

const NavigationWrapper = styled.div`
  margin-top: auto;
  padding-top: 2rem;
`

export default function Ending({ node, next, goTo }) {
  const navigate = useNavigate()
  const isLoading = false

  const heading = node.title || ""
  const description = node.text
  // A Survey child is optional: with one the ending hands over to it, without one it
  // stays the last screen and sends the visitor back to the start.
  const label = next
    ? node.continueButtonText || "Continue"
    : node.returnToMonumentButtonText || "Restart"
  const onSelect = next ? () => goTo(next) : () => navigate("/")

  return (
    <Screen>
      <Content>
        <Headline $isLoading={isLoading}>{heading}</Headline>

        {isLoading && (
          <LoadingContainer>
            <LoadingSpinner />
          </LoadingContainer>
        )}

        {!isLoading && (
          <Description html={description} $isLoading={isLoading} />
        )}

        <NavigationWrapper>
          <Navigation
            mode="single"
            singleButtonVariant="text"
            selectLabel={label}
            onSelect={onSelect}
            disabled={isLoading}
          />
        </NavigationWrapper>
      </Content>
    </Screen>
  )
}
