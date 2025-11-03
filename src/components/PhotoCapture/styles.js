import { css, styled } from "styled-components"

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
  flex-direction: column;
  gap: 1.5rem;
  width: 19.25rem;
  height: 100%;
  justify-content: center;
  align-items: center;
`

export const TaskCard = styled.div`
  display: flex;
  width: 19.25rem;
  height: 24.625rem;
  padding: 1.75rem 1.625rem;
  flex-direction: column;
  justify-items: center;
  gap: 1.125rem;
  flex-shrink: 0;
  border-radius: 1.75rem 1.75rem 1.75rem 1.75rem;
  background-color: #f1ece1;
  position: relative;

  ${({ $characterIndex }) =>
    $characterIndex !== undefined &&
    css`
      background-color: ${characterStyles[$characterIndex]?.backgroundColor ||
      "#f1ece1"};
      border: ${characterStyles[$characterIndex]?.border || "none"};
    `}
`

export const TaskDescription = styled.h2`
  color: #000;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
  ${({ $characterIndex }) =>
    $characterIndex !== undefined &&
    css`
      color: ${characterStyles[$characterIndex]?.textColor || "#000"};
    `}
`

export const TaskHeadline = styled.h2`
  color: #000;
  font-size: 1.5rem;
  font-style: bold;
  font-weight: 600;
  line-height: normal;
  text-align: center;
  color: #fff;
  margin: 0;
`

export const TaskContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  ${({ $characterIndex }) =>
    $characterIndex !== undefined &&
    css`
      color: ${characterStyles[$characterIndex]?.textColor || "#000"};
    `}
`

export const TaskImage = styled.img`
  width: 16.875rem;
  height: 16.875rem;
  position: absolute;
  border-radius: 1rem;
  object-fit: cover;
  ${({ $characterIndex }) =>
    $characterIndex !== undefined &&
    css`
      border: ${characterStyles[$characterIndex]?.border || "none"};
    `}
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

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  margin-bottom: 3rem;
`

export const PaginationDot = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  border: 2px solid #fff;
  background-color: ${({ isActive }) => (isActive ? "#fff" : "#transparent")};
  transition: background-color 0.3s ease;
`

const characterStyles = [
  {
    backgroundColor: "#f1ece1",
    border: "1px solid #000",
    extraBorder: "1px solid #000",
    textColor: "#000",
  },
  {
    backgroundColor: "#1f1f1f99",
    border: "1px solid #fff",
    textColor: "#ffffff",
  },
  {
    backgroundColor: "#f1ece1",
    textColor: "#000",
  },
]
