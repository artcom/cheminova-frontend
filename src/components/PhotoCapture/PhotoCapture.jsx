import useDevicePlatform from "@hooks/useDevicePlatform"
import { useRef } from "react"

import SmallButton from "@ui/SmallButton"

import Navigation from "../UI/Navigation"
import usePhotoTasks from "./hooks/usePhotoTasks"
import {
  HeaderContainer,
  HeaderText,
  HiddenInput,
  PhotoCaptureContainer,
  TaskCard,
  TaskContent,
  TaskHeadline,
  TaskImage,
  TasksContainer,
} from "./styles"

export default function PhotoCapture({ goToExploration }) {
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const { tasks, taskImages, currentTaskIndex, handleFileObject, retake } =
    usePhotoTasks()

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) handleFileObject(file)
    // Reset the input value so selecting the same file again still triggers change
    event.target.value = ""
  }

  const handleOpenCamera = () => cameraInputRef.current?.click()
  const handleOpenGallery = () => galleryInputRef.current?.click()

  return (
    <>
      <PhotoCaptureContainer>
        <HiddenInput
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          ref={cameraInputRef}
        />

        <HiddenInput
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={galleryInputRef}
        />

        <HeaderContainer>
          <HeaderText>
            Frame your <br /> perspective
          </HeaderText>
        </HeaderContainer>

        <TasksContainer>
          {tasks.map((task, index) => (
            <TaskCard key={index}>
              <TaskHeadline>{task}</TaskHeadline>

              <TaskContent>
                {taskImages[index] && (
                  <>
                    <SmallButton onClick={() => retake(index)}>
                      Retake
                    </SmallButton>
                    <TaskImage
                      src={taskImages[index]}
                      alt={`Task ${index + 1} completed`}
                    />
                  </>
                )}

                {index === currentTaskIndex && !taskImages[index] && (
                  <>
                    {isAndroid ? (
                      <>
                        <SmallButton onClick={handleOpenCamera}>
                          Take Photo
                        </SmallButton>
                        <SmallButton onClick={handleOpenGallery}>
                          Gallery
                        </SmallButton>
                      </>
                    ) : (
                      <SmallButton onClick={handleOpenGallery}>
                        Take Photo
                      </SmallButton>
                    )}
                  </>
                )}
              </TaskContent>
            </TaskCard>
          ))}
        </TasksContainer>
        <Navigation mode="single" onSelect={goToExploration} />
      </PhotoCaptureContainer>
    </>
  )
}
