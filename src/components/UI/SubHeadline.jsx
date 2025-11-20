import { styled } from "styled-components"

const SubHeadline = styled.div`
  color: ${({ theme }) => theme.colors.background.paper};
  text-align: center;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  position: relative;
  z-index: 3;
`

export default SubHeadline
