import { styled } from "styled-components"
import Headline from "./Headline"
import SubHeadline from "./SubHeadline"

const HeaderContainer = styled.div`
  display: flex;
  width: 24.5625rem;
  height: 10.5625rem;
  padding: 3.625rem 0.625rem 0.625rem 0.625rem;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 3;
`

function Header({ headline, subheadline }) {
  return (
    <HeaderContainer>
      {subheadline && <SubHeadline>{subheadline}</SubHeadline>}
      <Headline>{headline}</Headline>
    </HeaderContainer>
  )
}

export default Header
