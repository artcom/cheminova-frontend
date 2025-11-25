import useCapturedImages from "@/hooks/useCapturedImages"
import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import { useRef } from "react"
import { useLoaderData } from "react-router-dom"

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

export default function PhotoCapture() {
  const { capturedImages, setCapturedImageAt } = useCapturedImages()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const { photography } = useLoaderData()

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

export const clientLoader = async ({ params }) => {
  const {
    section: photography,
    characterSlug,
    characterIndex,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getPhotography(content, characterIndex),
    { missingMessage: "Photography data missing from CMS" },
  )

  return { characterIndex, characterSlug, photography }
}
