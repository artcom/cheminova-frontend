import { extractFromContentTree } from "@/api/hooks"
import useCapturedImages from "@/hooks/useCapturedImages"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import { useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import FooterContainer from "./Footer"
import usePhotoTasks from "./hooks/usePhotoTasks"
import {
  HeaderContainer,
  HeaderText,
  HiddenInput,
  PhotoCaptureContainer,
  TaskHeadline,
} from "./styles"
import TaskCards from "./TaskCards"

const DEFAULT_TASK_KEYS = ["laNau", "surroundings", "special"]

export default function PhotoCapture() {
  const { t } = useTranslation()
  const { capturedImages, setCapturedImageAt } = useCapturedImages()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const { photography } = useLoaderData()

  const heading = photography?.heading || t("photoCapture.title")

  const fallbackTitles = useMemo(
    () => DEFAULT_TASK_KEYS.map((key) => t(`photoCapture.tasks.${key}`)),
    [t],
  )

  const taskMetadata = useMemo(() => {
    const cmsTasks = photography?.imageDescriptions
    if (cmsTasks && cmsTasks.length > 0) {
      return cmsTasks.map((item, index) => {
        const titleFallback = fallbackTitles[index] || fallbackTitles[0] || ""
        return {
          title: item?.shortDescription?.trim() || titleFallback,
          description: (item?.description || "").trim(),
        }
      })
    }

    return fallbackTitles.map((title) => ({
      title,
      description: "",
    }))
  }, [photography.imageDescriptions, fallbackTitles])

  const tasksForHook = useMemo(
    () =>
      taskMetadata.map(({ description, title }) => description || title || ""),
    [taskMetadata],
  )

  const {
    taskImages,
    currentTaskIndex,
    setCurrentTaskIndex,
    handleFileObject,
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
        />
        <FooterContainer
          taskMetadata={taskMetadata}
          currentTaskIndex={currentTaskIndex}
        />
      </PhotoCaptureContainer>
    </>
  )
}

export async function clientLoader({ params }) {
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
