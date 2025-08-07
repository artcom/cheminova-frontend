import useDevicePlatform from "@hooks/useDevicePlatform"
import SmallButton from "@components/UI/SmallButton"
import { useState, useRef } from "react"
import { styled } from "styled-components"

const PhotoCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 0 34.75rem 0;
`

const HeaderContainer = styled.div`
  display: flex;
  width: 21.4375rem;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.5625rem;
`

const HeaderText = styled.h1`
  color: #fff;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
  text-align: center;
`

const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  align-items: flex-start;
`

const TaskCard = styled.div`
  display: flex;
  width: 23rem;
  height: 9.4375rem;
  padding: 1.75rem 1.625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.125rem;
  flex-shrink: 0;
  border-radius: 0 1.75rem 1.75rem 0;
  background-color: #f1ece1;
`

const TaskHeadline = styled.h2`
  color: #000;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
`

const TaskContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
`

const TaskImage = styled.img`
  width: 3rem;
  height: 3rem;
  object-fit: cover;
  border-radius: 0.5rem;
`

const HiddenInput = styled.input`
  display: none;
`

export default function PhotoCapture() {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskImages, setTaskImages] = useState({})
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const tasks = ["Of La Nau", "Of yourself", "Of the atmosphere"]

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
                    <TaskImage
                      src={taskImages[index]}
                      alt={`Task ${index + 1} completed`}
                    />
                    <SmallButton onClick={() => handleRetake(index)}>
                      Retake
                    </SmallButton>
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
      </PhotoCaptureContainer>

      <TasksContainer>
        {tasks.map((task, index) => (
          <TaskCard key={index}>
            <TaskHeadline>{task}</TaskHeadline>

            <TaskContent>
              {taskImages[index] && (
                <>
                  <TaskImage
                    src={taskImages[index]}
                    alt={`Task ${index + 1} completed`}
                  />
                  <SmallButton onClick={() => handleRetake(index)}>
                    Retake
                  </SmallButton>
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

      {Object.keys(taskImages).length === tasks.length && (
        <TaskCard>
          <TaskHeadline>All tasks completed!</TaskHeadline>
        </TaskCard>
      )}
    </>
  )
}
