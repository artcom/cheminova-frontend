import { styled } from "styled-components"

export const PhotoCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 0 34.75rem 0;
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
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
  text-align: center;
`

export const TasksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
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
`

export const TaskHeadline = styled.h2`
  color: #000;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin: 0;
`

export const TaskContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  width: 100%;
`

export const TaskImage = styled.img`
  width: 7rem;
  height: 7rem;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 2rem;
  border-radius: 1rem;
  object-fit: cover;
`

export const HiddenInput = styled.input`
  display: none;
`
export const CameraButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 7rem;
  position: absolute;
  bottom: 0;
`
