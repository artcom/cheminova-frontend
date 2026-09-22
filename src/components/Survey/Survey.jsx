import useCapturedImages from "@/hooks/useCapturedImages"
import { useNavigate } from "react-router-dom"
import { styled } from "styled-components"

import Button from "../UI/Button"
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

const NavigationWrapper = styled.div`
  margin-top: auto;
  padding-top: 2rem;
`

export default function Survey({ node }) {
  const navigate = useNavigate()
  const { clearCapturedImages } = useCapturedImages()

  const restart = () => {
    clearCapturedImages()
    navigate("/")
  }

  const heading = node.heading || node.title || ""
  const description = node.description
  const surveyUrl = node.surveyUrl || ""
  const surveyLabel = node.surveyButtonText || "Take the survey"
  const restartLabel = node.returnToMonumentButtonText || "Restart"

  return (
    <Screen>
      <Content>
        <Headline>{heading}</Headline>

        <Description html={description} />

        {surveyUrl && (
          <Button
            as="a"
            href={surveyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {surveyLabel}
          </Button>
        )}

        <NavigationWrapper>
          <Navigation
            mode="single"
            singleButtonVariant="text"
            selectLabel={restartLabel}
            onSelect={restart}
          />
        </NavigationWrapper>
      </Content>
    </Screen>
  )
}
