import { useCharactersFromAll, useUploadFromAll } from "@/api/hooks"
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

  // Fetch upload data from CMS and character data
  const { data: uploadData } = useUploadFromAll(currentCharacterIndex)
  const { data: charactersData } = useCharactersFromAll()

  const uploadImageMutation = useUploadImage()
  const isUploading = uploadImageMutation.isPending
  const validImages = images.filter(Boolean)

  // Get current character info for user feedback
  const currentCharacter = charactersData?.[currentCharacterIndex]
  const characterName = currentCharacter?.name || "Unknown Character"
  const hasValidCharacter = Boolean(currentCharacter?.slug)

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

    // Check for character context before starting upload
    if (!hasValidCharacter) {
      setUploadErrors([
        {
          error: t("errors.noCharacterSelected", {
            defaultValue:
              "No character selected. Please select a character first.",
          }),
        },
      ])
      setUploadProgress(t("errors.uploadFailed"))
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

      // Process uploads sequentially to maintain consistent character context
      for (let index = 0; index < validImages.length; index++) {
        const imageData = validImages[index]
        try {
          const file = dataURLToFile(
            imageData,
            `photo-${timestamp}-${index}.jpg`,
          )

          if (!file) {
            throw new Error(`Invalid image data for photo ${index + 1}`)
          }
          const title = `Photo ${index + 1}`

          const result = await uploadImageMutation.mutateAsync({ file, title })
          uploadResults.push(result)

          // Update progress for each successful upload
          setUploadProgress(
            t("upload.status.uploadProgress", {
              current: index + 1,
              total: validImages.length,
              character: characterName,
              defaultValue: `Uploaded ${index + 1} of ${validImages.length} images to ${characterName}'s collection`,
            }),
          )
        } catch (error) {
          console.error(`Upload error for image ${index + 1}:`, error)
          uploadErrors.push({
            index: index + 1,
            error: error.message || t("errors.unexpectedError"),
          })
        }
      }

      // Handle results
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
        // Partial success
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
        // All failed
        setUploadErrors(uploadErrors)
        setUploadProgress(t("errors.uploadFailed"))
      }
    } catch (error) {
      console.error("Upload error:", error)
      const errorMessage = error.message || t("errors.unexpectedError")

      // Provide specific feedback for character-related errors
      if (
        errorMessage.includes("Character") &&
        errorMessage.includes("not found")
      ) {
        setUploadErrors([
          {
            error: t("errors.characterNotFound", {
              character: characterName,
              defaultValue: `Character '${characterName}' not found on server. Please try selecting a different character.`,
            }),
          },
        ])
      } else if (errorMessage.includes("No character selected")) {
        setUploadErrors([
          {
            error: t("errors.noCharacterSelected", {
              defaultValue:
                "No character selected. Please select a character first.",
            }),
          },
        ])
      } else {
        setUploadErrors([{ error: errorMessage }])
      }

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
    if (!hasValidCharacter) {
      return t("upload.buttons.selectCharacter", {
        defaultValue: "Select Character First",
      })
    }
    return yesButtonText
  }

  const getUploadDescription = () => {
    if (validImages.length === 0) {
      return t("upload.noImages")
    }

    if (!hasValidCharacter) {
      return t("upload.noCharacterSelected", {
        defaultValue: "Please select a character before uploading your photos.",
      })
    }

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
          <SmallButton
            onClick={handleUpload}
            disabled={
              isUploading || (!hasValidCharacter && validImages.length > 0)
            }
          >
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
