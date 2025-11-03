import { styled } from "styled-components"

const StyledSmallButton = styled.button`
  width: 7.8125rem;
  height: 2.4375rem;
  border-radius: 2.75rem;
  border: 1px solid ${({ color }) => color || "black"};
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ color }) => color || "black"};
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
