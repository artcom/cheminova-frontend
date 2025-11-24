import { styled } from "styled-components"

const StyledButton = styled.button`
  all: unset;
  width: 8.875rem;
  height: 3.4375rem;
  border-radius: 2.75rem;
  border: 2px solid #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  text-align: center;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

export default function Button({ children, ...props }) {
  return <StyledButton {...props}>{children}</StyledButton>
}
