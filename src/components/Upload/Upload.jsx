import { useUploadFromAll } from "@/api/hooks"
import useGlobalState from "@/hooks/useGlobalState"
import usePhotoTasks from "@/hooks/usePhotoTasks"
import { useUploadImage } from "@/hooks/useUploadImage"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import SmallButton from "@ui/SmallButton"

import {
  Actions,
  ErrorList,
  ImageRow,
  ImagesGrid,
  Preview,
  ProgressMessage,
  Question,
  QuestionBlock,
  TaskLabel,
  UploadContainer,
} from "./styles"

const dataURLToFile = (dataURL, filename) => {
  if (typeof dataURL !== "string") {
    return null
  }

  const [metadata, base64Data] = dataURL.split(",")
  if (!metadata || !base64Data) {
    return null
  }

  const mimeMatch = metadata.match(/:(.*?);/)
  if (!mimeMatch) {
    return null
  }

  let binaryString
  try {
    binaryString = atob(base64Data)
  } catch (error) {
    console.warn("Failed to decode data URL", error)
    return null
  }

  let length = binaryString.length
  const u8arr = new Uint8Array(length)

  while (length--) {
    u8arr[length] = binaryString.charCodeAt(length)
  }

  return new File([u8arr], filename, { type: mimeMatch[1] })
}

export default function Upload({ goToGallery, images = [] }) {
  const { t } = useTranslation()
  const { currentCharacterIndex } = useGlobalState()
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadErrors, setUploadErrors] = useState([])
  const { tasks } = usePhotoTasks()

  // Fetch upload data from CMS
  const { data: uploadData } = useUploadFromAll(currentCharacterIndex)

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending
  const validImages = images.filter(Boolean)

  // Use CMS data if available, otherwise fallback to translations
  const uploadDescription = uploadData?.description
    ? uploadData.description.replace(/<[^>]*>/g, "")
    : t("upload.question")
  const yesButtonText = uploadData?.yesButtonText || t("upload.buttons.yes")
  const noButtonText = uploadData?.noButtonText || t("upload.buttons.no")

  const handleUpload = async () => {
    setUploadErrors([])

    if (validImages.length === 0) {
      goToGallery()
      return
    }

    try {
      setUploadProgress(
        `${t("upload.status.uploading")} ${validImages.length} images...`,
      )

      const timestamp = Date.now()

      const uploadPromises = validImages.map(async (imageData, index) => {
        const file = dataURLToFile(imageData, `photo-${timestamp}-${index}.jpg`)

        if (!file) {
          throw new Error("Invalid image data")
        }
        const title = `Photo ${index + 1}`

        return uploadImageMutation.mutateAsync({ file, title })
      })

      await Promise.all(uploadPromises)

      setUploadProgress(t("upload.status.allComplete"))

      setTimeout(() => {
        goToGallery()
      }, 2000)
    } catch (error) {
      console.error("Upload error:", error)
      setUploadErrors([{ error: error.message || t("errors.unexpectedError") }])
      setUploadProgress(t("errors.uploadFailed"))
    }
  }

  const getButtonText = () => {
    if (isUploading) {
      return uploadProgress || t("upload.buttons.uploading")
    }
    if (uploadErrors.length > 0) {
      return t("upload.buttons.retry")
    }
    return yesButtonText
  }

  return (
    <UploadContainer>
      <ImagesGrid>
        {validImages.map((imageData, index) => (
          <ImageRow key={index}>
            <TaskLabel>{tasks[index]}</TaskLabel>
            <Preview src={imageData} />
          </ImageRow>
        ))}
      </ImagesGrid>

      <QuestionBlock>
        <Question>
          {validImages.length > 0 ? uploadDescription : t("upload.noImages")}
        </Question>

        {uploadProgress && (
          <ProgressMessage $hasErrors={uploadErrors.length > 0}>
            {uploadProgress}
          </ProgressMessage>
        )}

        {uploadErrors.length > 0 && (
          <ErrorList>
            {uploadErrors.map((error, index) => (
              <div key={index}>
                {error.error?.message || error.error || "Unknown error"}
              </div>
            ))}
          </ErrorList>
        )}

        <Actions>
          <SmallButton onClick={handleUpload} disabled={isUploading}>
            {getButtonText()}
          </SmallButton>
          <SmallButton onClick={goToGallery} disabled={isUploading}>
            {isUploading ? t("upload.buttons.pleaseWait") : noButtonText}
          </SmallButton>
        </Actions>
      </QuestionBlock>
    </UploadContainer>
  )
}
