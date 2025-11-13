import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
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
const CHARACTER_SLUG_JANITOR = "janitor"
const CHARACTER_SLUG_FUTURE = "future"

export default function PhotoCapture({
  taskImages,
  currentTaskIndex,
  handleOpenCamera,
  handleOpenGallery,
}) {
  const { t } = useTranslation()

  const { isAndroid } = useDevicePlatform()

  const { photography, characterSlug } = useLoaderData()
  console.log(characterSlug)

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

  return (
    <TasksContainer>
      {taskMetadata.map((task, index) => {
        const taskDescription = sanitizeDescription(task.description)
        const isActive = index === currentTaskIndex
        const positionIndex =
          (index - currentTaskIndex + taskMetadata.length) % taskMetadata.length
        const { x, y, opacity, zIndex } = cardPositions[positionIndex]

        return (
          <TaskCard
            key={index}
            $characterId={characterSlug}
            $top={y}
            $left={`calc(50% + ${x})`}
            transform={`translate(-50%, -50%)`}
            opacity={opacity}
            $zIndex={zIndex}
          >
            {!taskImages[index] && (
              <>
                {characterSlug === CHARACTER_SLUG_JANITOR && <ExtraBorder />}
                <TaskDescription $characterId={characterSlug}>
                  {taskDescription}
                </TaskDescription>
              </>
            )}

            <TaskContent $characterId={characterSlug}>
              {taskImages[index] && (
                <>
                  <TaskImage
                    $characterId={characterSlug}
                    src={taskImages[index]}
                    alt={`Task ${index + 1} completed`}
                  />
                </>
              )}
              <CameraButtonContainer>
                <IconButton
                  variant="camera"
                  color={
                    characterSlug === CHARACTER_SLUG_FUTURE ? "white" : "black"
                  }
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
