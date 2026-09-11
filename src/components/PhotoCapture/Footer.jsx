import { useExperience } from "@/experience/experienceContext"

import Navigation from "../UI/Navigation"
import { Footer, PaginationContainer, PaginationDot } from "./styles"

export default function FooterContainer({
  taskMetadata,
  currentTaskIndex,
  setCurrentTaskIndex,
  hasImages,
}) {
  const { next, goTo } = useExperience()

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

    goTo(next)
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
        selectLabel={hasImages ? "Continue" : "Proceed without photos"}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelect={handleSelect}
        prevDisabled={currentTaskIndex === 0}
        nextDisabled={currentTaskIndex === taskMetadata.length - 1}
        iconColor="#FFF"
        buttonStyle={{ fontSize: "0.875rem" }}
      />
    </Footer>
  )
}
