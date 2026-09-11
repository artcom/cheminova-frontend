import useCapturedImages from "@/hooks/useCapturedImages"
import { useRef } from "react"

import FooterContainer from "./Footer"
import {
  HeaderContainer,
  HeaderText,
  HiddenInput,
  PhotoCaptureContainer,
  TaskHeadline,
} from "./styles"
import TaskCards from "./TaskCards"
import { usePhotoCaptureData } from "./usePhotoCaptureData"
import usePhotoTasks from "./usePhotoTasks"

export default function PhotoCapture({ node }) {
  const { capturedImages, setCapturedImageAt } = useCapturedImages()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const photography = node

  const { heading, taskMetadata, tasksForHook } =
    usePhotoCaptureData(photography)

  const {
    taskImages,
    currentTaskIndex,
    setCurrentTaskIndex,
    handleFileObject,
    retake,
  } = usePhotoTasks({
    tasks: tasksForHook,
    onImageCaptured: (dataUrl, taskIndex) => {
      setCapturedImageAt(taskIndex, dataUrl)
    },
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
          <HeaderText>{heading}</HeaderText>
        </HeaderContainer>
        <TaskHeadline>{taskMetadata[currentTaskIndex].title}</TaskHeadline>
        <TaskCards
          taskImages={taskImages}
          currentTaskIndex={currentTaskIndex}
          setCurrentTaskIndex={setCurrentTaskIndex}
          handleOpenCamera={handleOpenCamera}
          handleOpenGallery={handleOpenGallery}
          taskMetadata={taskMetadata}
          onDelete={retake}
        />
        <FooterContainer
          taskMetadata={taskMetadata}
          currentTaskIndex={currentTaskIndex}
          setCurrentTaskIndex={setCurrentTaskIndex}
          hasImages={Object.keys(taskImages).length > 0}
        />
      </PhotoCaptureContainer>
    </>
  )
}
