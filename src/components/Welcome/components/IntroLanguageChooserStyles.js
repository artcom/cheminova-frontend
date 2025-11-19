import { styled } from "styled-components"

export const ChooserContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 9.4375rem 5.1875rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.125rem;
  border-radius: 1.125rem;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.55) 33.17%,
    rgba(0, 0, 0, 0.55) 62.98%,
    rgba(0, 0, 0, 0) 100%
  );
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
`

export const Title = styled.h2`
  color: var(--dark-mode, #fff);
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.875rem; /* 125% */
  letter-spacing: -0.0075rem;
  margin: 0 0 0.5rem 0;
  text-align: center;
`

export const LanguageOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  width: 100%;
`

export const LanguageOption = styled.button`
  display: flex;
  height: 2.375rem;
  align-items: center;
  gap: 1rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: var(--dark-mode, #fff);
  font-family:
    "Bricolage Grotesque Variable", "Bricolage Grotesque", sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.25rem;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  span {
    flex: 1;
    text-align: left;
  }
`

export const RadioButton = styled.div`
  display: flex;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid
    ${({ $isSelected }) => ($isSelected ? "#fff" : "rgba(255, 255, 255, 0.5)")};
  transition: border-color 0.2s ease;
`

export const RadioCircle = styled.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background: ${({ $isSelected }) => ($isSelected ? "#fff" : "transparent")};
  transition: background 0.2s ease;
`
