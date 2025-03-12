import { useState } from "react"
import useFullscreen from "../../hooks/useFullscreen"
import useSwipeGesture from "../../hooks/useSwipeGesture"

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id: 1, title: "Step 1", content: "This is the first step content." },
    { id: 2, title: "Step 2", content: "This is the second step content." },
    { id: 3, title: "Step 3", content: "This is the third step content." },
  ]

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const containerRef = useSwipeGesture({
    onSwipeLeft: goNext,
    onSwipeRight: goPrevious,
  })

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Cheminova Frontend</h1>

      <div
        ref={containerRef}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "20px",
          margin: "20px 0",
          minHeight: "200px",
          touchAction: "pan-y",
        }}
      >
        <h2 style={{ marginTop: 0 }}>{steps[currentStep].title}</h2>
        <p>{steps[currentStep].content}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "40px",
          }}
        >
          <button
            onClick={goPrevious}
            disabled={currentStep === 0}
            style={{
              padding: "8px 16px",
              backgroundColor: currentStep === 0 ? "#ccc" : "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentStep === 0 ? "default" : "pointer",
            }}
          >
            Previous
          </button>

          <div
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {steps.map((_, index) => (
              <span
                key={index}
                style={{
                  width: index === currentStep ? "16px" : "8px",
                  height: "8px",
                  backgroundColor: index === currentStep ? "#4a90e2" : "#ccc",
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentStep === steps.length - 1}
            style={{
              padding: "8px 16px",
              backgroundColor:
                currentStep === steps.length - 1 ? "#ccc" : "#4a90e2",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: currentStep === steps.length - 1 ? "default" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      </div>

      <FullscreenButton />
    </div>
  )
}

function FullscreenButton() {
  const { isFullscreen, isIOSDevice, toggleFullscreen } = useFullscreen()

  if (isIOSDevice) {
    return null
  }

  return (
    <button onClick={toggleFullscreen}>
      {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </button>
  )
}
