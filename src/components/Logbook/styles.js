import styled from "styled-components"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #1c1c1e; /* Dark background from screenshot */
  color: white;
  padding: 24px;
  box-sizing: border-box;
`

export const Header = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 32px;
  margin-top: 40px;
`

export const Card = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`

export const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 16px;
  background-color: #333;
`

export const Info = styled.div`
  display: flex;
  flex-direction: column;
`

export const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
`

export const DateText = styled.span`
  font-size: 14px;
  color: #8e8e93;
`

export const TextArea = styled.textarea`
  width: 100%;
  height: 150px;
  background-color: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 16px;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  margin-bottom: 16px;

  &::placeholder {
    color: #8e8e93;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0a84ff;
  }
`

export const Input = styled.input`
  width: 100%;
  height: 48px;
  background-color: #2c2c2e;
  border: none;
  border-radius: 12px;
  padding: 0 16px;
  color: white;
  font-size: 16px;
  box-sizing: border-box;
  font-family: inherit;

  &::placeholder {
    color: #8e8e93;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #0a84ff;
  }
`

export const Footer = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-bottom: 40px;
`

export const CheckButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: transparent;
  border: 2px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 0.6;
  }

  svg {
    width: 32px;
    height: 32px;
  }
`
