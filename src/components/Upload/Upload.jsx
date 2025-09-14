import { useEffect, useMemo, useState } from "react"

import SmallButton from "@ui/SmallButton"

import {
  Actions,
  ImageRow,
  ImagesGrid,
  Missing,
  Preview,
  Question,
  QuestionBlock,
  TaskLabel,
  UploadContainer,
} from "./styles"

export default function Upload({ goToGallery }) {
  const [images, setImages] = useState([])
  const tasks = useMemo(
    () => ["La Nau", "Your surroundings", "Something special"],
    [],
  )

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("personalImages") || "[]")
    if (Array.isArray(stored)) setImages(stored)
  }, [])

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
          <SmallButton onClick={goToGallery}>Yes</SmallButton>
          <SmallButton onClick={goToGallery}>No</SmallButton>
        </Actions>
      </QuestionBlock>
    </UploadContainer>
  )
}
