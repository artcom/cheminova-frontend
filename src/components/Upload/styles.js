import theme from "@/theme"
import { styled } from "styled-components"

export const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.75rem 0 7rem; /* leave bottom space for nav */
  box-sizing: border-box;
  gap: 1.75rem;
  color: #fff;
`

export const ImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 2rem;
  justify-content: flex-start;
`

export const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f1ece1;
  border-radius: 0 1.25rem 1.25rem 0;
  padding: 0.75rem 0.75rem 0.75rem 1rem;
  position: relative;
  min-height: 6.25rem;
  overflow: hidden;
  width: 80%;
`

export const TaskLabel = styled.h2`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #000;
  flex: 1;
`

export const Preview = styled.img`
  width: 5.5rem;
  height: 5.5rem;
  object-fit: cover;
  border-radius: 0.75rem;
  background: #ccc;
`

export const Missing = styled.div`
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

export const QuestionBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  text-align: center;
  max-width: 32rem;
  width: 80%;
`

export const Question = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  font-weight: 700;
`

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
  & > button {
    border-color: ${theme.colors.background.light};
    color: ${theme.colors.background.light};
  }
`
