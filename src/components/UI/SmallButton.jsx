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

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const ButtonText = styled.span`
  display: flex;
  width: 6.75069rem;
  height: 1.875rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
`

export default function SmallButton({ children, onClick, disabled, ...props }) {
  return (
    <StyledSmallButton onClick={onClick} disabled={disabled} {...props}>
      <ButtonText>{children}</ButtonText>
    </StyledSmallButton>
  )
}
