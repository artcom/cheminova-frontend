import { styled } from "styled-components"

export const cardPositions = [
  { x: "0px", y: "28rem", opacity: 1, zIndex: 2 },
  { x: "11rem", y: "25.5rem", opacity: 0.5, zIndex: 1 },
  { x: "-11rem", y: "25.5rem", opacity: 0.5, zIndex: 1 },
]

const characterStyles = [
  {
    backgroundColor: "#f1ece1",
    textColor: "#000",
    imageBorder: "1px solid #000",
  },
  {
    backgroundColor: "#1f1f1f99",
    border: "1px solid #fff",
    textColor: "#ffffff",
  },
  {
    backgroundColor: "#f1ece1",
    border: "1px solid #000",
    textColor: "#000",
  },
]

export const PhotoCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 0 34.75rem 0;
  justify-content: space-between;
`

export const HeaderContainer = styled.div`
  display: flex;
  width: 21.4375rem;
  flex-direction: column;
  justify-items: center;
  padding: 1.5625rem;
`

export const HeaderText = styled.h1`
  color: #fff;
  font-size: 2.375rem;
  font-style: bold;
  font-weight: 700;
  line-height: normal;
  margin: 0;
  text-align: center;
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  width: 19.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const TaskCard = styled.div`
  position: absolute;
  width: 19.25rem;
  height: 24.625rem;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.625rem;
  border-radius: 1.75rem;
  transform: ${({ transform }) => transform};
  opacity: ${({ opacity }) => opacity};
  z-index: ${({ $zIndex }) => $zIndex};
  background-color: ${({ $characterIndex }) =>
    characterStyles[$characterIndex]?.backgroundColor || "#f1ece1"};
  border: ${({ $characterIndex }) =>
    characterStyles[$characterIndex]?.border || "none"};
  transition:
    all 0.3s ease,
    opacity 0.3s ease;
`

export const TaskDescription = styled.h2`
  color: ${({ $characterIndex }) =>
    characterStyles[$characterIndex]?.textColor || "#000"};
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin: 0;
`

export const TaskHeadline = styled.h2`
  color: #fff;
  width: 21.4375rem;
  font-size: 1.5rem;
  font-style: bold;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  margin: 0;
`

export const TaskContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  color: ${({ $characterIndex }) =>
    characterStyles[$characterIndex]?.textColor || "#000"};
`

export const TaskImage = styled.img`
  width: 16.875rem;
  height: 16.875rem;
  position: absolute;
  top: 1rem;
  border-radius: 1rem;
  object-fit: cover;
  border: ${({ $characterIndex }) =>
    characterStyles[$characterIndex]?.imageBorder || "none"};
`

export const ExtraBorder = styled.img`
  width: 17.438rem;
  height: 16.375rem;
  position: absolute;
  top: 0.9rem;
  left: 0.9rem;
  border-radius: 1rem;
  border: 1px solid #000;
`

export const HiddenInput = styled.input`
  display: none;
`

export const CameraButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 1.5rem;
`

export const Footer = styled.div`
  position: absolute;
  top: 10rem;
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 33rem;
  margin-bottom: 3rem;
`

export const PaginationDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: ${({ $isActive }) => ($isActive ? "#fff" : "transparent")};
  transition: background-color 0.3s ease;
`

export const MetadataContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f1ece1;
  border-radius: 1.75rem;
  padding: 2rem;
  width: 90%;
  max-width: 25rem;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`

export const MetadataSection = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    color: #000;
    font-size: 1.2rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }
`

export const MetadataLabel = styled.label`
  display: block;
  color: #000;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`

export const MetadataInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #666;
  }
`

export const MetadataTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #666;
  }
`

export const MetadataActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`

export const MetadataOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`
