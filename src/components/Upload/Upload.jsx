import useCapturedImages from "@/hooks/useCapturedImages"
import usePhotoTasks from "@/hooks/usePhotoTasks"
import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

import SmallButton from "@ui/SmallButton"

import TaskCarousel from "../PhotoCapture/TaskCarousel"
import {
  Actions,
  ErrorList,
  Preview,
  PreviewContainer,
  ProgressMessage,
  Question,
  QuestionBlock,
  TaskLabel,
  UploadContainer,
} from "./styles"
import { useUploadImage } from "./useUploadImage"

const dataURLToFile = (dataURL, filename) => {
  const [metadata, base64Data] = dataURL.split(",")
  const mimeMatch = metadata.match(/:(.*?);/)
  const binaryString = atob(base64Data)
  const length = binaryString.length
  const u8arr = new Uint8Array(length)

  for (let i = 0; i < length; i++) {
    u8arr[i] = binaryString.charCodeAt(i)
  }

  return new File([u8arr], filename, { type: mimeMatch[1] })
}

export default function Upload() {
  const { t } = useTranslation()
  const { capturedImages } = useCapturedImages()
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadErrors, setUploadErrors] = useState([])
  const [didCompleteUpload, setDidCompleteUpload] = useState(false)
  const uploadAttemptRef = useRef(0)
  const { tasks, currentTaskIndex, setCurrentTaskIndex } = usePhotoTasks()
  const navigate = useNavigate()
  const { characterSlug, character, upload: uploadData } = useLoaderData()

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending
  const images = capturedImages || []
  const validImageEntries = images
    .map((imageData, taskIndex) =>
      imageData
        ? {
            imageData,
            taskIndex,
          }
        : null,
    )
    .filter(Boolean)
  const validImages = validImageEntries.map(({ imageData }) => imageData)
  const validImageCount = validImageEntries.length
  const hasValidImages = validImageCount > 0

  useEffect(() => {
    if (!hasValidImages) {
      if (currentTaskIndex !== 0) {
        setCurrentTaskIndex(0)
      }
      return
    }

    if (currentTaskIndex > validImageCount - 1) {
      setCurrentTaskIndex(validImageCount - 1)
    }
  }, [hasValidImages, validImageCount, currentTaskIndex, setCurrentTaskIndex])

  const characterName = character?.name || ""

  const uploadDescription = uploadData?.description
    ? uploadData.description.replace(/<[^>]*>/g, "")
    : t("upload.question")
  const yesButtonText = uploadData?.yesButtonText || t("upload.buttons.yes")
  const noButtonText = uploadData?.noButtonText || t("upload.buttons.no")
  const noImagesCopy = t("upload.noImages", {
    defaultValue: "No photos to upload yet. Capture a photo before uploading.",
  })

  const goToGallery = () => {
    const destination = characterSlug === "future" ? "timeline" : "gallery"
    navigate(`/characters/${characterSlug}/${destination}`)
  }

  const goToPhotoCapture = () => {
    navigate(`/characters/${characterSlug}/photo-capture`)
  }

  const handleUpload = async () => {
    if (didCompleteUpload) {
      goToGallery()
      return
    }

    setUploadErrors([])

    if (!hasValidImages) {
      setUploadProgress(noImagesCopy)
      return
    }

    try {
      const attemptId = uploadAttemptRef.current + 1
      uploadAttemptRef.current = attemptId
      setDidCompleteUpload(false)
      const uploadingMessage = t("upload.status.uploadingToCharacter", {
        count: validImages.length,
        character: characterName,
        defaultValue: `Uploading ${validImages.length} images to ${characterName}'s collection...`,
      })
      setUploadProgress(uploadingMessage)

      const uploadResults = []
      const uploadErrors = []

      for (let index = 0; index < validImages.length; index++) {
        const imageData = validImages[index]
        try {
          const file = dataURLToFile(
            imageData,
            `photo-${characterSlug}-${attemptId}-${index}.jpg`,
          )
          const result = await uploadImageMutation.mutateAsync({ file })
          uploadResults.push(result)
        } catch (error) {
          uploadErrors.push({
            index: index + 1,
            error: error.message || t("errors.unexpectedError"),
          })
        }
      }

      if (uploadErrors.length === 0) {
        setUploadProgress(
          t("upload.status.allCompleteForCharacter", {
            character: characterName,
            defaultValue: `All uploads completed successfully for ${characterName}!`,
          }),
        )
        setDidCompleteUpload(true)
      } else if (uploadResults.length > 0) {
        setUploadErrors(uploadErrors)
        setUploadProgress(
          t("upload.status.partialSuccess", {
            successful: uploadResults.length,
            failed: uploadErrors.length,
            total: validImages.length,
            defaultValue: `${uploadResults.length} of ${validImages.length} uploads completed. ${uploadErrors.length} failed.`,
          }),
        )
      } else {
        setUploadErrors(uploadErrors)
        setUploadProgress(t("errors.uploadFailed"))
      }
    } catch (error) {
      setUploadErrors([{ error: error.message }])
      setUploadProgress(t("errors.uploadFailed"))
    }
  }

  const getButtonText = () => {
    if (isUploading) return uploadProgress || t("upload.buttons.uploading")
    if (didCompleteUpload)
      return t("upload.buttons.viewCollection", {
        defaultValue: "View collection",
      })
    if (uploadErrors.length > 0) return t("upload.buttons.retry")
    return yesButtonText
  }

  const getUploadDescription = () => {
    if (!hasValidImages) return noImagesCopy

    const baseDescription = uploadDescription || t("upload.question")
    return t("upload.questionWithCharacter", {
      description: baseDescription,
      character: characterName,
      defaultValue: `${baseDescription} Your photos will be added to ${characterName}'s collection.`,
    })
  }

  const statusMessage = hasValidImages ? uploadProgress : ""
  const displayedTaskLabel = (() => {
    if (!hasValidImages) return tasks[currentTaskIndex]
    const activeEntry = validImageEntries[currentTaskIndex]
    if (!activeEntry) return tasks[currentTaskIndex]
    return tasks[activeEntry.taskIndex] || tasks[currentTaskIndex]
  })()

  return (
    <UploadContainer>
      <TaskLabel>{displayedTaskLabel}</TaskLabel>
      <TaskCarousel
        selectedIndex={currentTaskIndex}
        onSelectionChange={setCurrentTaskIndex}
        style={{ flex: 1 }}
      >
        {validImages.map((imageData, index) => (
          <PreviewContainer key={index}>
            <Preview src={imageData} />
          </PreviewContainer>
        ))}
      </TaskCarousel>

      <QuestionBlock>
        <Question>{getUploadDescription()}</Question>

        {statusMessage && (
          <ProgressMessage $hasErrors={uploadErrors.length > 0}>
            {statusMessage}
          </ProgressMessage>
        )}

        {uploadErrors.length > 0 && (
          <ErrorList>
            {uploadErrors.map((error, index) => (
              <div key={index}>
                {error.index && `Photo ${error.index}: `}
                {error.error?.message || error.error || "Unknown error"}
              </div>
            ))}
          </ErrorList>
        )}

        <Actions $stacked={!hasValidImages}>
          {hasValidImages ? (
            didCompleteUpload ? (
              <SmallButton onClick={goToGallery}>
                {t("upload.buttons.viewCollection", {
                  defaultValue: "View collection",
                })}
              </SmallButton>
            ) : (
              <>
                <SmallButton onClick={handleUpload} disabled={isUploading}>
                  {getButtonText()}
                </SmallButton>
                <SmallButton onClick={goToGallery} disabled={isUploading}>
                  {isUploading ? t("upload.buttons.pleaseWait") : noButtonText}
                </SmallButton>
              </>
            )
          ) : (
            <>
              <SmallButton onClick={goToPhotoCapture}>
                {t("upload.buttons.goToPhotoCapture", {
                  defaultValue: "Go to photo capture",
                })}
              </SmallButton>
              <SmallButton onClick={goToGallery}>
                {t("upload.buttons.proceedWithoutPhotos", {
                  defaultValue: "Proceed without photos",
                })}
              </SmallButton>
            </>
          )}
        </Actions>
      </QuestionBlock>
    </UploadContainer>
  )
}

export const clientLoader = async ({ params }) => {
  const {
    section: upload,
    characterSlug,
    characterIndex,
    character,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getUpload(content, characterIndex),
    { missingMessage: "Upload data missing from CMS" },
  )

  return { characterIndex, characterSlug, upload, character }
}
