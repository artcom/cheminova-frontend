import { styled } from "styled-components"

export const PhotoCaptureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 0 0 34.75rem 0;
`

export const HeaderContainer = styled.div`
  display: flex;
  width: 21.4375rem;
  flex-direction: column;
  align-items: flex-start;
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
  align-items: flex-start;
`

export const TaskCard = styled.div`
  display: flex;
  width: 23rem;
  height: 9.4375rem;
  padding: 1.75rem 1.625rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.125rem;
  flex-shrink: 0;
  border-radius: 0 1.75rem 1.75rem 0;
  background-color: #f1ece1;
  position: relative;
`

export const TaskHeadline = styled.h2`
  color: #000;
  font-size: 1.3rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
`

export const TaskDescription = styled.div`
  color: #000;
  font-size: 0.3rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;

  p {
    margin: 0;
  }
`

export const TaskContent = styled.div`
  display: flex;
  align-items: center;
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
