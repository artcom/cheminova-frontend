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

const LinkSpan = styled.span`
  text-decoration: underline;
`

export default function LegalNotice({ setShowScreen }) {
  return (
    <LegalNoticeContainer>
      <LinkSpan onClick={() => setShowScreen("imprint")}>Legal Notice</LinkSpan>
      &nbsp;&amp;&nbsp;
      <LinkSpan onClick={() => setShowScreen("privacy")}>
        Privacy Policy
      </LinkSpan>
    </LegalNoticeContainer>
  )
}
