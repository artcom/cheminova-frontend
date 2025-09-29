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
  const arr = dataURL.split(",")
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}

export default function Upload({ goToGallery, images = [] }) {
  const { t } = useTranslation()
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadErrors, setUploadErrors] = useState([])
  const { tasks } = usePhotoTasks()

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending
  const validImages = images.filter(Boolean)

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

      const uploadPromises = validImages.map(async (imageData, index) => {
        const file = dataURLToFile(
          imageData,
          `photo-${Date.now()}-${index}.jpg`,
        )
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
    return t("upload.buttons.yes")
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
          {validImages.length > 0 ? t("upload.question") : t("upload.noImages")}
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
            {isUploading
              ? t("upload.buttons.pleaseWait")
              : t("upload.buttons.no")}
          </SmallButton>
        </Actions>
      </QuestionBlock>
    </UploadContainer>
  )
}
