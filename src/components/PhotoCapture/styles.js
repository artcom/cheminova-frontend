import { styled } from "styled-components"

import { characterStyles } from "../SliderWheel/styles"

export const PhotoCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100dvh;
  padding: 0 0 2rem 0;
  justify-content: space-between;
`

export const HeaderContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-items: center;
  padding: 1.5625rem 0.78125rem 0.8125rem;
`

export const HeaderText = styled.h1`
  color: #fff;
  font-size: 1.875rem;
  font-style: bold;
  font-weight: 700;
  line-height: normal;
  padding: 0;
  margin: 0;
  width: 100%;
  text-align: center;
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 19.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const TaskCard = styled.div`
  position: relative;
  width: 85vw;
  max-width: 22rem;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  background-color: ${({ $characterId }) =>
    characterStyles[$characterId]?.backgroundColor || "transparent"};
  border: ${({ $characterId }) =>
    characterStyles[$characterId]?.border || "none"};
  border-radius: 1.75rem;
`

export const TaskDescription = styled.h2`
  color: ${({ $characterId }) =>
    characterStyles[$characterId]?.textColor || "#000"};
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-align: center;
  margin: 0 0 1rem 0;
  width: 100%;
  padding: 1rem;
`

export const TaskHeadline = styled.h2`
  color: #fff;
  width: 21.4375rem;
  font-size: 1.2rem;
  font-style: bold;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  margin: 0;
`

export const TaskContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  width: 100%;
  position: relative;
  color: ${({ $characterId }) =>
    characterStyles[$characterId]?.textColor || "#000"};
`

export const TaskImage = styled.img`
  width: 75%;
  height: auto;
  aspect-ratio: 1;
  border-radius: 1rem;
  object-fit: cover;
  border: ${({ $characterId }) =>
    characterStyles[$characterId]?.imageBorder || "none"};
`

export const ExtraBorder = styled.img`
  width: 82%;
  height: auto;
  aspect-ratio: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 1rem;
  border: 1px solid #000;
  pointer-events: none;
`

export const HiddenInput = styled.input`
  display: none;
`

export const CameraButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  min-width: 3.5rem;
  padding: 0.5rem;
  border-radius: 999px;
  touch-action: manipulation;
  gap: 1rem;
`

export const Footer = styled.div`
  position: relative;
`

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
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

export const DeleteButtonWrapper = styled.div`
  position: absolute;
  top: -0.5rem;
  right: 1rem;
  z-index: 10;
`
