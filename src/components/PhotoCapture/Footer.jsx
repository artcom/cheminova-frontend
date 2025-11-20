import { getNextRoute } from "@/characterRoutesConfig"
import { useLoaderData, useNavigate } from "react-router-dom"

import Navigation from "../UI/Navigation"
import { Footer, PaginationContainer, PaginationDot } from "./styles"

export default function FooterContainer({
  taskMetadata,
  currentTaskIndex,
  setCurrentTaskIndex,
}) {
  const { characterSlug } = useLoaderData()
  const navigate = useNavigate()

  const handlePrev = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentTaskIndex < taskMetadata.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1)
    }
  }

  const handleSelect = () => {
    // ...

    const nextRoute = getNextRoute(characterSlug, "photo-capture")
    navigate(`/characters/${characterSlug}/${nextRoute}`)
  }

  return (
    <Footer>
      <PaginationContainer>
        {taskMetadata.map((_, index) => (
          <PaginationDot key={index} $isActive={index === currentTaskIndex} />
        ))}
      </PaginationContainer>
      <Navigation
        mode="select"
        selectLabel="Continue"
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={handleSelect}
        prevDisabled={currentTaskIndex === 0}
        nextDisabled={currentTaskIndex === taskMetadata.length - 1}
        iconColor="#FFF"
      />
    </Footer>
  )
}
