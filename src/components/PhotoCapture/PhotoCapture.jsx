import useDevicePlatform from "../../hooks/useDevicePlatform"
import { useState, useRef } from "react"

export default function PhotoCapture() {
  const [capturedImage, setCapturedImage] = useState(null)
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setCapturedImage(imageUrl)
    }
  }

  const handleOpenCamera = () => {
    cameraInputRef.current.click()
  }

  const handleOpenGallery = () => {
    galleryInputRef.current.click()
  }

  return (
    <>
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

      {isAndroid ? (
        <>
          <button onClick={handleOpenCamera}>Take Photo</button>
          <button onClick={handleOpenGallery}>Choose from Gallery</button>
        </>
      ) : (
        <button onClick={handleOpenGallery}>Take or Choose Photo</button>
      )}

      {capturedImage && (
        <div>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </>
  )
}
