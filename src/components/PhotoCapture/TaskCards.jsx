import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import { useSwipe } from "@/hooks/useSwipe"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { findCharacterIndexBySlug } from "@/utils/characterSlug"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

import IconButton from "../UI/IconButton"
import {
  CameraButtonContainer,
  cardPositions,
  ExtraBorder,
  TaskCard,
  TaskContent,
  TaskDescription,
  TaskImage,
  TasksContainer,
} from "./styles"

const DEFAULT_TASK_KEYS = ["laNau", "surroundings", "special"]

export default function PhotoCapture({
  taskImages,
  currentTaskIndex,
  setCurrentTaskIndex,
  handleOpenCamera,
  handleOpenGallery,
}) {
  const { t } = useTranslation()
  const { currentCharacterIndex } = useGlobalState()

  const { isAndroid } = useDevicePlatform()

  const { photography } = useLoaderData()

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

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
    () => cycleCards("right"),
    () => cycleCards("left"),
  )

  return (
    <TasksContainer
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {taskMetadata.map((task, index) => {
        const taskDescription = sanitizeDescription(task.description)
        const isActive = index === currentTaskIndex
        const positionIndex =
          (index - currentTaskIndex + taskMetadata.length) % taskMetadata.length
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
