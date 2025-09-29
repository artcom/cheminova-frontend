import useDevicePlatform from "@hooks/useDevicePlatform"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

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

export default function PhotoCapture({
  goToExploration,
  onImageCaptured,
  capturedImages = [],
}) {
  const { t } = useTranslation()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const { tasks, taskImages, currentTaskIndex, handleFileObject, retake } =
    usePhotoTasks({
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
          <HeaderText>{t("photoCapture.title")}</HeaderText>
        </HeaderContainer>

        <TasksContainer>
          {tasks.map((task, index) => (
            <TaskCard key={index}>
              <TaskHeadline>{task}</TaskHeadline>

              <TaskContent>
                {taskImages[index] && (
                  <>
                    <SmallButton onClick={() => retake(index)}>
                      {t("photoCapture.buttons.retake")}
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
                          {t("photoCapture.buttons.takePhoto")}
                        </SmallButton>
                        <SmallButton onClick={handleOpenGallery}>
                          {t("photoCapture.buttons.gallery")}
                        </SmallButton>
                      </>
                    ) : (
                      <SmallButton onClick={handleOpenGallery}>
                        {t("photoCapture.buttons.takePhoto")}
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
