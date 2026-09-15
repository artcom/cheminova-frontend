import { descendantOfType } from "@/experience/tree"
import useCapturedImages from "@/hooks/useCapturedImages"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import Navigation from "../UI/Navigation"
import { LogbookStack } from "./LogbookStack"
import { useJanitorLogbookData } from "./useJanitorLogbookData"

const PageContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #1a1a1a; /* Dark background from screenshot */
  color: #f0efe9;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  box-sizing: border-box;
  overflow: hidden;
`

const TitleSection = styled.div`
  margin-bottom: 0.75rem;
  text-align: left;
  width: 100%;
  max-width: min(16rem, 100%);
`

const MainTitle = styled.h1`
  font-family: "Bricolage Grotesque Variable", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
  max-width: 90%;
  text-align: left;
`

const Counter = styled.div`
  font-family: "Bricolage Grotesque Variable", sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.25rem;
`

export default function JanitorLogbook({ node, next, goTo }) {
  const { t } = useTranslation()
  const { data, isLoading } = useJanitorLogbookData()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { capturedImages } = useCapturedImages()

  // Check if any photos were taken
  const hasPhotos = capturedImages && capturedImages.some((img) => img)

  const handleExit = () => {
    const ending = descendantOfType(node, "ending")
    goTo(!hasPhotos && ending ? ending : next)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + data.length) % data.length)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % data.length)
  }

  if (isLoading) {
    return <PageContainer>Loading...</PageContainer>
  }

  return (
    <PageContainer>
      <TitleSection>
        <MainTitle>{t("janitorLogbook.title")}</MainTitle>
        <Counter>
          {currentIndex + 1} / {data.length}
        </Counter>
      </TitleSection>

      <LogbookStack
        items={data}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      <Navigation
        mode="select"
        selectLabel={hasPhotos ? "Create Entry" : "Go to Ending"}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={handleExit}
        prevDisabled={false}
        nextDisabled={false}
        iconColor="#FFF"
      />
    </PageContainer>
  )
}
