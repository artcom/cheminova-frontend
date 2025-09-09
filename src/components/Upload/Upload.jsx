import { uploadPost } from "@/api/uploadData"
import useGlobalState from "@/hooks/useGlobalState"
import { theme } from "@/theme"
import { useCallback, useEffect, useMemo, useState } from "react"
import { styled } from "styled-components"

import SmallButton from "@ui/SmallButton"

const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem 1.25rem 7rem; /* leave bottom space for nav */
  box-sizing: border-box;
  gap: 1.75rem;
  color: #fff;
`

const ImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`

const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f1ece1;
  border-radius: 0 1.25rem 1.25rem 0;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
  position: relative;
  min-height: 6.25rem;
  overflow: hidden;
`

const TaskLabel = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #000;
  flex: 1;
`

const Preview = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  object-fit: cover;
  border-radius: 0.75rem;
  background: #ccc;
`

const Missing = styled.div`
  width: 5.5rem;
  height: 5.5rem;
  border-radius: 0.75rem;
  background: #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #333;
  font-weight: 600;
`

const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
  max-width: 32rem;
`

const Question = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  font-weight: 700;
`

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  & > button {
    border-color: ${theme.colors.background.light};
    color: ${theme.colors.background.light};
  }
`

const Hint = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #999;
`

export default function Upload() {
  const { navigateToScreenById } = useGlobalState()
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const tasks = useMemo(
    () => ["La Nau", "Your surroundings", "Something special"],
    [],
  )

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("personalImages") || "[]")
    if (Array.isArray(stored)) setImages(stored)
  }, [])

  const handleUpload = useCallback(async () => {
    setSubmitting(true)
    try {
      // Prepare payload: pair each task with image (if present)
      const payload = tasks.map((label, i) => ({ label, image: images[i] }))
      await uploadPost({ items: payload, createdAt: Date.now() })
      navigateToScreenById("gallery")
    } catch (e) {
      // Silently fail for now – could add UI feedback
      console.error("Upload failed", e)
    } finally {
      setSubmitting(false)
    }
  }, [images, navigateToScreenById, tasks])

  const handleDecline = () => {
    navigateToScreenById("exploration")
  }

  const allPresent = tasks.every((_, i) => !!images[i])

  return (
    <UploadContainer>
      <ImagesGrid>
        {tasks.map((task, i) => (
          <ImageRow key={task}>
            <TaskLabel>{task}</TaskLabel>
            {images[i] ? (
              <Preview src={images[i]} alt={task} />
            ) : (
              <Missing>Missing</Missing>
            )}
          </ImageRow>
        ))}
      </ImagesGrid>
      <QuestionBlock>
        <Question>Do you want to upload collection?</Question>
        <Actions>
          <SmallButton
            onClick={handleUpload}
            disabled={!allPresent || submitting}
          >
            Yes
          </SmallButton>
          <SmallButton onClick={handleDecline} disabled={submitting}>
            No
          </SmallButton>
        </Actions>
        {!allPresent && <Hint>Please complete all three images first.</Hint>}
      </QuestionBlock>
    </UploadContainer>
  )
}
