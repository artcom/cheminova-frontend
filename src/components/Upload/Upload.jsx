import { extractFromContentTree } from "@/api/hooks"
import { allContentQuery } from "@/api/queries"
import useGlobalState from "@/hooks/useGlobalState"
import usePhotoTasks from "@/hooks/usePhotoTasks"
import { useUploadImage } from "@/hooks/useUploadImage"
import { getCurrentLocale } from "@/i18n"
import { queryClient } from "@/queryClient"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate } from "react-router-dom"

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
  const { capturedImages } = useGlobalState()
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadErrors, setUploadErrors] = useState([])
  const { tasks } = usePhotoTasks()
  const navigate = useNavigate()
  const {
    characterIndex: currentCharacterIndex,
    character,
    upload: uploadData,
  } = useLoaderData()

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending
  const images = capturedImages || []
  const validImages = images.filter(Boolean)

  const characterName = character?.name || ""

  const uploadDescription = uploadData?.description
    ? uploadData.description.replace(/<[^>]*>/g, "")
    : t("upload.question")
  const yesButtonText = uploadData?.yesButtonText || t("upload.buttons.yes")
  const noButtonText = uploadData?.noButtonText || t("upload.buttons.no")

  const goToGallery = () =>
    navigate(`/characters/${currentCharacterIndex}/gallery`)

  const handleUpload = async () => {
    setUploadErrors([])

    if (validImages.length === 0) {
      goToGallery()
      return
    }

    try {
      setUploadProgress(
        t("upload.status.uploadingToCharacter", {
          count: validImages.length,
          character: characterName,
          defaultValue: `Uploading ${validImages.length} images to ${characterName}'s collection...`,
        }),
      )

      const timestamp = Date.now()
      const uploadResults = []
      const uploadErrors = []

      for (let index = 0; index < validImages.length; index++) {
        const imageData = validImages[index]
        try {
          const file = dataURLToFile(
            imageData,
            `photo-${timestamp}-${index}.jpg`,
          )
          const result = await uploadImageMutation.mutateAsync({ file })
          uploadResults.push(result)

          setUploadProgress(
            t("upload.status.uploadProgress", {
              current: index + 1,
              total: validImages.length,
              character: characterName,
              defaultValue: `Uploaded ${index + 1} of ${validImages.length} images to ${characterName}'s collection`,
            }),
          )
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
        setTimeout(() => {
          goToGallery()
        }, 2000)
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
    if (uploadErrors.length > 0) return t("upload.buttons.retry")
    return yesButtonText
  }

  const getUploadDescription = () => {
    if (validImages.length === 0) return t("upload.noImages")

    const baseDescription = uploadDescription || t("upload.question")
    return t("upload.questionWithCharacter", {
      description: baseDescription,
      character: characterName,
      defaultValue: `${baseDescription} Your photos will be added to ${characterName}'s collection.`,
    })
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
        <Question>{getUploadDescription()}</Question>

        {uploadProgress && (
          <ProgressMessage $hasErrors={uploadErrors.length > 0}>
            {uploadProgress}
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

export async function clientLoader({ params }) {
  const locale = getCurrentLocale()
  const query = allContentQuery(locale)
  const content = await queryClient.ensureQueryData(query)

  const characterId = params.characterId
  const characterIndex = Number.parseInt(characterId ?? "", 10)

  if (Number.isNaN(characterIndex) || characterIndex < 0) {
    throw new Response("Character not found", { status: 404 })
  }

  const character = extractFromContentTree.getCharacter(content, characterIndex)

  if (!character) {
    throw new Response("Character not found", { status: 404 })
  }

  const upload = extractFromContentTree.getUpload(content, characterIndex)

  return { characterIndex, character, upload }
}
