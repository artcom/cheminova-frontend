import { extractFromContentTree } from "@/api/hooks"
import {
  loadCharacterContext,
  requireContentSection,
} from "@/utils/loaderHelpers"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useLoaderData } from "react-router-dom"

import SliderWheel from "../shared/SliderWheel/SliderWheel"
import IconButton from "../UI/IconButton"
import {
  CameraButtonContainer,
  ExtraBorder,
  TaskCard,
  TaskContent,
  TaskDescription,
  TaskImage,
} from "./styles"

const CHARACTER_SLUG_JANITOR = "janitor"
const CHARACTER_SLUG_FUTURE = "future"

export default function TaskCards({
  taskImages,
  setCurrentTaskIndex,
  currentTaskIndex,
  handleOpenCamera,
  handleOpenGallery,
  taskMetadata,
}) {
  const { isAndroid } = useDevicePlatform()

  const { characterSlug } = useLoaderData()

  return (
    <SliderWheel
      currentTaskIndex={currentTaskIndex}
      setCurrentTaskIndex={setCurrentTaskIndex}
      taskMetadata={taskMetadata}
      characterSlug={characterSlug}
    >
      {taskMetadata.map((task, index) => {
        const taskDescription = sanitizeDescription(task.description)
        const isActive = index === currentTaskIndex

        return (
          <TaskCard key={index}>
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
              <CameraButtonContainer
                onTouchStart={(event) => event.stopPropagation()}
                onTouchMove={(event) => event.stopPropagation()}
                onTouchEnd={(event) => event.stopPropagation()}
              >
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
    </SliderWheel>
  )
}

export async function clientLoader({ params }) {
  const { content, characterSlug, characterIndex } =
    await loadCharacterContext(params)

  const photography = requireContentSection(
    extractFromContentTree.getPhotography(content, characterIndex),
    "Photography data missing from CMS",
  )

  return { characterIndex, characterSlug, photography }
}

const sanitizeDescription = (description) => description.replace(/<[^>]*>/g, "")
