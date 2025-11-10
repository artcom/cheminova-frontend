import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { useSwipe } from "@/hooks/useSwipe"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import IconButton from "../UI/IconButton"
import Navigation from "../UI/Navigation"
import usePhotoTasks from "./hooks/usePhotoTasks"
import PhotoCaptureMetadata from "./PhotoCaptureMetadata"
import {
  CameraButtonContainer,
  cardPositions,
  ExtraBorder,
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
  const { currentCharacterIndex } = useGlobalState()
  const { capturedImages, setCapturedImageAt } = useGlobalState()
  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)
  const { isAndroid } = useDevicePlatform()

  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const [pendingImageData, setPendingImageData] = useState(null)
  const [photoMetadata, setPhotoMetadata] = useState({})
  const navigate = useNavigate()

  const { characterSlug, photography } = useLoaderData()

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
  }, [photography?.imageDescriptions, fallbackTitles])

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
      setPendingImageData({ dataUrl, taskIndex })
      setShowMetadataModal(true)
    },
    initialImages: capturedImages,
  })

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
    () => cycleCards("right"),
    () => cycleCards("left"),
  )

  const cycleCards = (direction) => {
    setCurrentTaskIndex((prevIndex) => {
      if (direction === "left") {
        return (prevIndex + 1) % taskMetadata.length
      } else if (direction === "right") {
        return (prevIndex - 1 + taskMetadata.length) % taskMetadata.length
      }
      return prevIndex
    })
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0]
    if (file) handleFileObject(file)
    event.target.value = ""
  }

  const handleOpenCamera = () => cameraInputRef.current?.click()
  const handleOpenGallery = () => galleryInputRef.current?.click()

  const handleMetadataSave = ({ text, userName, taskIndex }) => {
    console.log(text, userName, taskIndex)
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
        <TaskHeadline>{taskMetadata[currentTaskIndex].title}</TaskHeadline>

        <TasksContainer>
          {taskMetadata.map((task, index) => {
            const metadata = getMetadataForTask(index)
            const hasMetadata = metadata.text || metadata.userName
            const taskDescription = sanitizeDescription(task.description)
            const isActive = index === currentTaskIndex
            const positionIndex =
              (index - currentTaskIndex + taskMetadata.length) %
              taskMetadata.length
            const { x, y, opacity, zIndex } = cardPositions[positionIndex]

            return (
              <TaskCard
                key={index}
                $characterIndex={currentCharacterIndex}
                $top={y}
                $left={`calc(50% + ${x})`}
                transform={`translate(-50%, -50%)`}
                opacity={opacity}
                $zIndex={zIndex}
              >
                {hasMetadata && taskImages[index] && (
                  <TaskDescription>
                    {metadata.userName && (
                      <strong>{metadata.userName}: </strong>
                    )}
                    {metadata.text && <em>{metadata.text}</em>}
                  </TaskDescription>
                )}

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
        <Navigation
          mode="single"
          onSelect={() => navigate(`/characters/${characterSlug}/exploration`)}
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

export async function clientLoader({ params }) {
  const characterSlug = params.characterId
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characters = extractFromContentTree.getCharacters(content)
  const characterIndex = findCharacterIndexBySlug(characters, characterSlug)

  if (characterIndex === null) {
    throw new Response("Character not found", { status: 404 })
  }

  const photography = extractFromContentTree.getPhotography(
    content,
    characterIndex,
  )

  return { characterIndex, characterSlug, photography }
}

const sanitizeDescription = (description) => description.replace(/<[^>]*>/g, "")
