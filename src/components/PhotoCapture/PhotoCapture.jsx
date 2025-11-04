import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { getCurrentLocale } from "@/i18n"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import SmallButton from "@ui/SmallButton"

import Navigation from "../UI/Navigation"
import usePhotoTasks from "./hooks/usePhotoTasks"
import PhotoCaptureMetadata from "./PhotoCaptureMetadata"
import {
  HeaderContainer,
  HeaderText,
  HiddenInput,
  MetadataOverlay,
  PhotoCaptureContainer,
  TaskCard,
  TaskContent,
  TaskDescription,
  TaskHeadline,
  TaskImage,
  TasksContainer,
} from "./styles"

const DEFAULT_TASK_KEYS = ["laNau", "surroundings", "special"]

export default function PhotoCapture() {
  const { t } = useTranslation()
  const { capturedImages, setCapturedImageAt } = useGlobalState()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()
  const navigate = useNavigate()

  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const [pendingImageData, setPendingImageData] = useState(null)
  const [photoMetadata, setPhotoMetadata] = useState({})

  const { characterIndex, photography } = useLoaderData()

  const heading = photography?.heading || t("photoCapture.title")
  const takePhotoText =
    photography?.takePhotoButtonText || t("photoCapture.buttons.takePhoto")
  const retakeText =
    photography?.retakePhotoButtonText || t("photoCapture.buttons.retake")
  const galleryText =
    photography?.galleryButtonText || t("photoCapture.buttons.gallery")

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
  }, [photography?.imageDescriptions, fallbackTitles])

  const tasksForHook = useMemo(
    () =>
      taskMetadata.map(({ description, title }) => description || title || ""),
    [taskMetadata],
  )

  const { taskImages, currentTaskIndex, handleFileObject, retake } =
    usePhotoTasks({
      tasks: tasksForHook,
      onImageCaptured: (dataUrl, taskIndex) => {
        setPendingImageData({ dataUrl, taskIndex })
        setShowMetadataModal(true)
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

  const handleMetadataSave = ({ text, userName, taskIndex }) => {
    setPhotoMetadata((prev) => ({
      ...prev,
      [taskIndex]: { text, userName },
    }))

    if (pendingImageData) {
      setCapturedImageAt(taskIndex, pendingImageData.dataUrl)
    }

    setShowMetadataModal(false)
    setPendingImageData(null)
  }

  const handleMetadataSkip = (taskIndex) => {
    if (pendingImageData) {
      setCapturedImageAt(taskIndex, pendingImageData.dataUrl)
    }

    setShowMetadataModal(false)
    setPendingImageData(null)
  }

  const getMetadataForTask = (taskIndex) => {
    return photoMetadata[taskIndex] || { text: "", userName: "" }
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
          <HeaderText>{heading}</HeaderText>
        </HeaderContainer>

        <TasksContainer>
          {taskMetadata.map((task, index) => {
            const metadata = getMetadataForTask(index)
            const hasMetadata = metadata.text || metadata.userName

            return (
              <TaskCard key={index}>
                {task.title && <TaskHeadline>{task.title}</TaskHeadline>}
                {task.description && (
                  <TaskDescription
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                )}

                {hasMetadata && taskImages[index] && (
                  <TaskDescription>
                    {metadata.userName && (
                      <strong>{metadata.userName}: </strong>
                    )}
                    {metadata.text && <em>{metadata.text}</em>}
                  </TaskDescription>
                )}

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
                    <>
                      {isAndroid ? (
                        <>
                          <SmallButton onClick={handleOpenCamera}>
                            {takePhotoText}
                          </SmallButton>
                          <SmallButton onClick={handleOpenGallery}>
                            {galleryText}
                          </SmallButton>
                        </>
                      ) : (
                        <SmallButton onClick={handleOpenGallery}>
                          {takePhotoText}
                        </SmallButton>
                      )}
                    </>
                  )}
                </TaskContent>
              </TaskCard>
            )
          })}
        </TasksContainer>
        <Navigation
          mode="single"
          onSelect={() => navigate(`/characters/${characterIndex}/exploration`)}
        />
      </PhotoCaptureContainer>

      {showMetadataModal && pendingImageData && (
        <>
          <MetadataOverlay
            onClick={() => handleMetadataSkip(pendingImageData.taskIndex)}
          />
          <PhotoCaptureMetadata
            taskIndex={pendingImageData.taskIndex}
            taskTitle={taskMetadata[pendingImageData.taskIndex]?.title}
            onSave={handleMetadataSave}
            onSkip={handleMetadataSkip}
          />
        </>
      )}
    </>
  )
}

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const locale = getCurrentLocale()
    const query = allContentQuery(locale)
    const content = await queryClient.ensureQueryData(query)

    const characterId = params.characterId
    const characterIndex = Number.parseInt(characterId ?? "", 10)

    if (Number.isNaN(characterIndex) || characterIndex < 0) {
      throw new Response("Character not found", { status: 404 })
    }

    const photography = extractFromContentTree.getPhotography(
      content,
      characterIndex,
    )

    return { characterIndex, photography }
  }
