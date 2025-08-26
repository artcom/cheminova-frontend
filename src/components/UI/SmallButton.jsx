import { styled } from "styled-components"

const StyledSmallButton = styled.button`
  width: 7.8125rem;
  height: 2.4375rem;
  border-radius: 2.75rem;
  border: 1px solid black;
  background: transparent;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  text-align: center;
  font-family:
    "Bricolage Grotesque",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  &:hover {
    opacity: 0.8;
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default function SmallButton({ children, ...props }) {
  return <StyledSmallButton {...props}>{children}</StyledSmallButton>
}
