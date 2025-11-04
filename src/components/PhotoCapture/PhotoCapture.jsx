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
    //setCurrentTaskIndex,
    handleFileObject,
    retake,
  } = usePhotoTasks({
    tasks: cmsTaskDescriptions.length > 0 ? cmsTaskDescriptions : undefined,
    onImageCaptured,
    initialImages: capturedImages,
  })

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) handleFileObject(file)
    event.target.value = ""
  }

  const handleOpenCamera = () => cameraInputRef.current?.click()
  const handleOpenGallery = () => galleryInputRef.current?.click()

  //const totalTasks = tasks.length

  // const handleNextTask = () => {
  //   setCurrentTaskIndex((prevIndex) => (prevIndex + 1) % totalTasks) // Cycle through cards
  // }

  //const lala = photographyData.imageDescriptions[0].description

  //const plainTextContent = lala.replace(/<[^>]*>/g, "")

  console.log(currentTaskIndex)

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
          <HeaderText>{heading}</HeaderText>
        </HeaderContainer>
        <TaskHeadline>
          {photographyData.imageDescriptions[currentTaskIndex].shortDescription}
        </TaskHeadline>

        <TasksContainer>
          {tasks.map((task, index) => (
            <>
              <TaskCard
                key={index}
                isActive={index === currentTaskIndex}
                $characterIndex={currentCharacterIndex}
              >
                {!taskImages[index] && (
                  <>
                    {currentCharacterIndex === 0 && <ExtraBorder />}
                    <TaskDescription $characterIndex={currentCharacterIndex}>
                      {task}
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

                  {index === currentTaskIndex && (
                    <CameraButtonContainer>
                      <IconButton
                        variant="camera"
                        color={currentCharacterIndex === 1 ? "white" : "black"}
                        onClick={
                          isAndroid ? handleOpenCamera : handleOpenGallery
                        }
                      />
                    </CameraButtonContainer>
                  )}
                </TaskContent>
              </TaskCard>
            </>
          ))}
        </TasksContainer>
        <PaginationContainer>
          {tasks.map((_, index) => (
            <PaginationDot key={index} isActive={index === currentTaskIndex} />
          ))}
        </PaginationContainer>
        <SmallButton color="#FFF" onClick={goToExploration}>
          {photographyData.continueButtonText}
        </SmallButton>
      </PhotoCaptureContainer>
    </>
  )
}
