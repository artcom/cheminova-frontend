import { styled } from "styled-components"

import Headline from "@ui/Headline"
import LegalNotice from "@ui/LegalNotice"
import SubHeadline from "@ui/SubHeadline"

const HeaderLayout = styled.div`
  display: flex;
  width: 100%;
  height: 10.5625rem;
  padding: 1.625rem 0;
  flex-direction: column;
  align-items: center;
  z-index: 3;
`

export default function Header({ headline, subheadline, legalNotice }) {
  return (
    <HeaderLayout>
      {subheadline && (
        <SubHeadline>
          {legalNotice && <LegalNotice />}
          {subheadline}
        </SubHeadline>
      )}
      <Headline>{headline}</Headline>
    </HeaderLayout>
  )
}
