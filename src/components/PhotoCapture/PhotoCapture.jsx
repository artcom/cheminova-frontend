import useDevicePlatform from "@hooks/useDevicePlatform"
import { useState, useRef } from "react"

export default function PhotoCapture() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskImages, setTaskImages] = useState({})
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const tasks = ["Take a picture of the stadium", "Take a picture of yourself"]

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setTaskImages((prev) => ({
        ...prev,
        [currentTaskIndex]: imageUrl,
      }))

      if (currentTaskIndex < tasks.length - 1) {
        setCurrentTaskIndex((prev) => prev + 1)
      }
    }
  }

  const handleRetake = (taskIndex) => {
    setTaskImages((prev) => {
      const newImages = { ...prev }
      delete newImages[taskIndex]
      return newImages
    })
    setCurrentTaskIndex(taskIndex)
  }

  const handleOpenCamera = () => {
    cameraInputRef.current.click()
  }

  const handleOpenGallery = () => {
    galleryInputRef.current.click()
  }

  return (
    <div
      style={{
        color: "#fff",
        padding: "20px",
        backgroundColor: "#000",
        width: "100%",
        height: "100%",
      }}
    >
      <h1>Photo Capture</h1>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        ref={cameraInputRef}
        style={{ display: "none" }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={galleryInputRef}
        style={{ display: "none" }}
      />

      <h2>Photo Tasks</h2>

      {tasks.map((task, index) => (
        <div
          key={index}
          style={{
            marginBottom: "20px",
            padding: "10px",
            border:
              index === currentTaskIndex ? "2px solid blue" : "1px solid gray",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                fontWeight: index === currentTaskIndex ? "bold" : "normal",
              }}
            >
              {index + 1}. {task}
            </span>

            {taskImages[index] && (
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <img
                  src={taskImages[index]}
                  alt={`Task ${index + 1} completed`}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                />
                <button onClick={() => handleRetake(index)}>Retake</button>
              </div>
            )}
          </div>

          {index === currentTaskIndex && !taskImages[index] && (
            <div style={{ marginTop: "10px" }}>
              {isAndroid ? (
                <>
                  <button onClick={handleOpenCamera}>Take Photo</button>
                  <button onClick={handleOpenGallery}>
                    Choose from Gallery
                  </button>
                </>
              ) : (
                <button onClick={handleOpenGallery}>
                  Take or Choose Photo
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      {Object.keys(taskImages).length === tasks.length && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "lightgreen",
          }}
        >
          <h3>All tasks completed!</h3>
        </div>
      )}
    </div>
  )
}
