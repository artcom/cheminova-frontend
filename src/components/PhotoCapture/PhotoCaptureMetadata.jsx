import { useState } from "react"
import { useTranslation } from "react-i18next"

import SmallButton from "@ui/SmallButton"

import {
  MetadataActions,
  MetadataContainer,
  MetadataInput,
  MetadataLabel,
  MetadataSection,
  MetadataTextarea,
} from "./styles"

export default function PhotoCaptureMetadata({
  onSave,
  onSkip,
  taskIndex,
  taskTitle,
}) {
  const { t } = useTranslation()
  const [comment, setComment] = useState("")
  const [username, setUsername] = useState("")

  const handleSave = () => {
    onSave({
      text: comment.trim(),
      userName: username.trim(),
      taskIndex,
    })
  }

  const handleSkip = () => {
    onSkip(taskIndex)
  }

  return (
    <MetadataContainer>
      <MetadataSection>
        <h3>
          {t("photoCapture.metadata.title", {
            defaultValue: "Add details for your photo",
          })}
        </h3>
        {taskTitle && <p>{taskTitle}</p>}
      </MetadataSection>

      <MetadataSection>
        <MetadataLabel htmlFor={`comment-${taskIndex}`}>
          {t("photoCapture.metadata.comment", {
            defaultValue: "Comment (optional)",
          })}
        </MetadataLabel>
        <MetadataTextarea
          id={`comment-${taskIndex}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("photoCapture.metadata.commentPlaceholder", {
            defaultValue: "Share your thoughts about this photo...",
          })}
          maxLength={255}
          rows={3}
        />
      </MetadataSection>

      <MetadataSection>
        <MetadataLabel htmlFor={`username-${taskIndex}`}>
          {t("photoCapture.metadata.username", {
            defaultValue: "Your name (optional)",
          })}
        </MetadataLabel>
        <MetadataInput
          id={`username-${taskIndex}`}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("photoCapture.metadata.usernamePlaceholder", {
            defaultValue: "Enter your name",
          })}
          maxLength={150}
        />
      </MetadataSection>

      <MetadataActions>
        <SmallButton onClick={handleSkip}>
          {t("photoCapture.metadata.skip", { defaultValue: "Skip" })}
        </SmallButton>
        <SmallButton onClick={handleSave}>
          {t("photoCapture.metadata.save", { defaultValue: "Save" })}
        </SmallButton>
      </MetadataActions>
    </MetadataContainer>
  )
}
