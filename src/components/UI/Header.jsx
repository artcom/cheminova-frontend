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

const AnimatedSubHeadline = styled.div`
  width: 100%;
`

const AnimatedHeadline = styled.div`
  width: 100%;
`

function Header({ headline, subheadline }) {
  return (
    <HeaderContainer>
      {subheadline && (
        <AnimatedSubHeadline>
          <SubHeadline>{subheadline}</SubHeadline>
        </AnimatedSubHeadline>
      )}
      <AnimatedHeadline>
        <Headline>{headline}</Headline>
      </AnimatedHeadline>
    </HeaderContainer>
  )
}

export default Header
