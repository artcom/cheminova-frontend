import { styled } from "styled-components"

const Container = styled.button`
  all: unset;
  width: 8.875rem;
  height: 3.4375rem;
  border-radius: 2.75rem;
  border: 2px solid #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;

  text-align: center;
  font-family: "Bricolage Grotesque";
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

function Button({ children, ...props }) {
  return <Container {...props}>{children}</Container>
}

export default Button
