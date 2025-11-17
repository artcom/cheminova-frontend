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
  gap: 11.75rem;
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
  font-weight: 700;
  font-style: Bold;
  font-size: 1.5rem;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0%;
  text-align: center;
  margin-top: 2rem;
`

export const Preview = styled.img`
  width: 85%;
  height: auto;
  aspect-ratio: 1;
  position: absolute;
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1rem;
  object-fit: cover;
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
  gap: 1rem;
  text-align: center;
  width: 80%;
`

export const Question = styled.h1`
  font-size: 1.1rem;
  margin: 0;
  font-weight: 700;
`

export const Actions = styled.div`
  display: flex;
  flex-direction: ${({ $stacked }) => ($stacked ? "column" : "row")};
  align-items: ${({ $stacked }) => ($stacked ? "stretch" : "center")};
  width: ${({ $stacked }) => ($stacked ? "100%" : "auto")};
  gap: 1rem;

  & > button {
    border-color: ${theme.colors.background.light};
    color: ${theme.colors.background.light};
    width: ${({ $stacked }) => ($stacked ? "100%" : "auto")};
  }
`

export const StatusIndicator = styled.span`
  margin-left: 8px;
  font-size: 0.7rem;
  color: ${({ $status }) => {
    switch ($status) {
      case "success":
        return "#4ecdc4"
      case "error":
        return "#ff6b6b"
      default:
        return "#ffa500"
    }
  }};
`

export const ProgressMessage = styled.div`
  color: ${({ $hasErrors }) => ($hasErrors ? "#ff6b6b" : "#4ecdc4")};
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`

export const ErrorList = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  font-size: 0.8rem;
  text-align: center;

  div {
    margin-bottom: 0.25rem;
  }
`
