import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import useDevicePlatform from "@hooks/useDevicePlatform"
import { useLoaderData } from "react-router-dom"

import IconButton from "../UI/IconButton"
import {
  CameraButtonContainer,
  DeleteButtonWrapper,
  ExtraBorder,
  TaskCard,
  TaskContent,
  TaskDescription,
  TaskImage,
} from "./styles"
import TaskCarousel from "./TaskCarousel"

const CHARACTER_SLUG_JANITOR = "janitor"
const CHARACTER_SLUG_FUTURE = "future"

export default function TaskCards({
  taskImages,
  setCurrentTaskIndex,
  currentTaskIndex,
  handleOpenCamera,
  handleOpenGallery,
  taskMetadata,
  onDelete,
}) {
  const { isAndroid } = useDevicePlatform()

  const { characterSlug } = useLoaderData()

  return (
    <TaskCarousel
      selectedIndex={currentTaskIndex}
      onSelectionChange={setCurrentTaskIndex}
      style={{ flex: 1 }}
    >
      {taskMetadata.map((task, index) => {
        const taskDescription = sanitizeDescription(task.description)
        const isActive = index === currentTaskIndex

        return (
          <TaskCard key={index} $characterId={characterSlug}>
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
                  <DeleteButtonWrapper>
                    <IconButton
                      variant="trash"
                      color={
                        characterSlug === CHARACTER_SLUG_FUTURE
                          ? "white"
                          : "black"
                      }
                      onClick={() => onDelete(index)}
                      size="2.5rem"
                    />
                  </DeleteButtonWrapper>
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
                  size="2.5rem"
                />
              </CameraButtonContainer>
            </TaskContent>
          </TaskCard>
        )
      })}
    </TaskCarousel>
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

const sanitizeDescription = (description) => description.replace(/<[^>]*>/g, "")
