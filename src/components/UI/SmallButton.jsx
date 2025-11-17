import { styled } from "styled-components"

const StyledSmallButton = styled.button`
  min-width: 9.5rem;
  height: 2.75rem;
  padding: 0 1.5rem;
  border-radius: 2.75rem;
  border: 1px solid ${({ color }) => color || "black"};
  background: transparent;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color || "white"};
  text-align: center;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
  }
`

export default function SmallButton({ children, ...props }) {
  return <StyledSmallButton {...props}>{children}</StyledSmallButton>
}
