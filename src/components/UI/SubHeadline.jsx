import { styled } from "styled-components"

const SubHeadline = styled.div`
  color: ${(props) => props.theme.colors.text.primary};
  text-align: center;
  font-family: ${(props) => props.theme.fontFamily};
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

export default SubHeadline
