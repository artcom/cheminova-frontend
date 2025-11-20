import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"

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
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;
`

const TitleSection = styled.div`
  margin-bottom: 20px;
  text-align: left;
  width: 100%;
  max-width: 340px;
`

const MainTitle = styled.h1`
  font-family: "Bricolage Grotesque Variable", sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0;
`

const ExitButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`

const ChevronWrapper = styled.div`
  position: fixed;
  bottom: 12rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChevronButton = styled.button`
  width: 44px;
  height: 44px;
  border: 2px solid white;
  border-radius: 30px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      background: transparent;
    }
  }

  svg {
    width: 22px;
    height: 12px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }
`

export default function JanitorLogbook() {
  const { data, isLoading } = useJanitorLogbookData()
  const navigate = useNavigate()
  const { characterId } = useParams()
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleExit = () => {
    navigate(`/characters/${characterId}/ending`)
  }

  const handleNext = () => {
    if (currentIndex < data.length) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  if (isLoading) {
    return <PageContainer>Loading...</PageContainer>
  }

  const isEnd = currentIndex >= data.length

  return (
    <PageContainer>
      <ExitButton onClick={handleExit}>Go to ending</ExitButton>

      <TitleSection>
        <MainTitle>Someone before you noticed a similar detail.</MainTitle>
      </TitleSection>

      <LogbookStack
        items={data}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />

      <ChevronWrapper>
        <ChevronButton onClick={handleNext} disabled={isEnd}>
          <svg viewBox="0 0 22 12">
            <polyline points="1,1 11,11 21,1" />
          </svg>
        </ChevronButton>
      </ChevronWrapper>
    </PageContainer>
  )
}
