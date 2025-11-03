import { usePhotographyFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import SmallButton from "@ui/SmallButton"

import IconButton from "../UI/IconButton"
import Navigation from "../UI/Navigation"
import usePhotoTasks from "./hooks/usePhotoTasks"
import {
  CameraButtonContainer,
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

  const { tasks, taskImages, currentTaskIndex, handleFileObject, retake } =
    usePhotoTasks({
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

  //const lala = photographyData.imageDescriptions[0].description

  //const plainTextContent = lala.replace(/<[^>]*>/g, "")

  console.log()

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

        <TasksContainer>
          {tasks.map((task, index) => (
            <TaskCard key={index}>
              <TaskHeadline>{task}</TaskHeadline>

              <TaskContent>
                {taskImages[index] && (
                  <>
                    <SmallButton onClick={() => retake(index)}>
                      {retakeText}
                    </SmallButton>
                    <TaskImage
                      src={taskImages[index]}
                      alt={`Task ${index + 1} completed`}
                    />
                  </>
                )}

                {index === currentTaskIndex && !taskImages[index] && (
                  <CameraButtonContainer>
                    <IconButton
                      variant="camera"
                      onClick={isAndroid ? handleOpenCamera : handleOpenGallery}
                    />
                  </CameraButtonContainer>
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
