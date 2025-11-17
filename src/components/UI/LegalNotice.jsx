import { Link } from "react-router-dom"
import { styled } from "styled-components"

const LegalNoticeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-shrink: 0;

  text-align: center;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  height: 1.5rem;
`

const LegalLink = styled(Link)`
  text-decoration: underline;
  color: inherit;
`

export default function LegalNotice() {
  return (
    <LegalNoticeContainer>
      <LegalLink to="/imprint">Legal Notice</LegalLink>
      &nbsp;&amp;&nbsp;
      <LegalLink to="/privacy">Privacy Policy</LegalLink>
    </LegalNoticeContainer>
  )
}
