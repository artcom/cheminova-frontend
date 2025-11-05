import { usePhotographyFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import SmallButton from "@ui/SmallButton"

import IconButton from "../UI/IconButton"
import usePhotoTasks from "./hooks/usePhotoTasks"
import {
  CameraButtonContainer,
  cardPositions,
  ExtraBorder,
  HeaderContainer,
  HeaderText,
  HiddenInput,
  PaginationContainer,
  PaginationDot,
  PhotoCaptureContainer,
  TaskCard,
  TaskContent,
  TaskDescription,
  TaskHeadline,
  TaskImage,
  TasksContainer,
} from "./styles"

export default function PhotoCapture({
  goToExploration,
  onImageCaptured,
  capturedImages = [],
}) {
  const { t } = useTranslation()
  const { currentCharacterIndex } = useGlobalState()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const { data: photographyData } = usePhotographyFromAll(currentCharacterIndex)

  const heading = photographyData?.heading || t("photoCapture.title")

  const retakeText =
    photographyData?.retakePhotoButtonText || t("photoCapture.buttons.retake")

  const cmsTaskDescriptions =
    photographyData?.imageDescriptions?.map((item) => item.description) || []

  const {
    tasks,
    taskImages,
    currentTaskIndex,
    setCurrentTaskIndex,
    handleFileObject,
    retake,
  } = usePhotoTasks({
    tasks: cmsTaskDescriptions.length > 0 ? cmsTaskDescriptions : undefined,
    onImageCaptured,
    initialImages: capturedImages,
  })

  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const swipeThreshold = 50

    if (swipeDistance > swipeThreshold) {
      cycleCards("left")
    } else if (swipeDistance < -swipeThreshold) {
      cycleCards("right")
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) handleFileObject(file)
    event.target.value = ""
  }

  const handleOpenCamera = () => cameraInputRef.current?.click()
  const handleOpenGallery = () => galleryInputRef.current?.click()

  const cycleCards = (direction) => {
    setCurrentTaskIndex((prevIndex) => {
      if (direction === "left") {
        return (prevIndex + 1) % tasks.length
      } else if (direction === "right") {
        return (prevIndex - 1 + tasks.length) % tasks.length
      }
      return prevIndex
    })
  }

  return (
    <>
      <PhotoCaptureContainer
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
          <HeaderText>{heading}</HeaderText>
        </HeaderContainer>
        <TaskHeadline>
          {photographyData.imageDescriptions[currentTaskIndex].shortDescription}
        </TaskHeadline>

        <TasksContainer>
          {tasks.map((task, index) => {
            const isActive = index === currentTaskIndex
            const taskDescriptionRaw =
              photographyData.imageDescriptions[index].description
            const taskDescription = taskDescriptionRaw.replace(/<[^>]*>/g, "")

            const positionIndex =
              (index - currentTaskIndex + tasks.length) % tasks.length
            const { x, y, opacity, zIndex } = cardPositions[positionIndex]

            return (
              <TaskCard
                key={index}
                $characterIndex={currentCharacterIndex}
                top={y}
                left={`calc(50% + ${x})`}
                transform={`translate(-50%, -50%)`}
                opacity={opacity}
                zIndex={zIndex}
              >
                {!taskImages[index] && (
                  <>
                    {currentCharacterIndex === 0 && <ExtraBorder />}
                    <TaskDescription $characterIndex={currentCharacterIndex}>
                      {taskDescription}
                    </TaskDescription>
                  </>
                )}

                <TaskContent $characterIndex={currentCharacterIndex}>
                  {taskImages[index] && (
                    <>
                      <SmallButton onClick={() => retake(index)}>
                        {retakeText}
                      </SmallButton>
                      <TaskImage
                        $characterIndex={currentCharacterIndex}
                        src={taskImages[index]}
                        alt={`Task ${index + 1} completed`}
                      />
                    </>
                  )}
                  <CameraButtonContainer>
                    <IconButton
                      variant="camera"
                      color={currentCharacterIndex === 1 ? "white" : "black"}
                      onClick={
                        isActive
                          ? isAndroid
                            ? handleOpenCamera
                            : handleOpenGallery
                          : undefined
                      }
                    />
                  </CameraButtonContainer>
                </TaskContent>
              </TaskCard>
            )
          })}
        </TasksContainer>
        <PaginationContainer>
          {tasks.map((_, index) => (
            <PaginationDot key={index} $isActive={index === currentTaskIndex} />
          ))}
        </PaginationContainer>
        <SmallButton color="#FFF" onClick={goToExploration}>
          {photographyData.continueButtonText}
        </SmallButton>
      </PhotoCaptureContainer>
    </>
  )
}
