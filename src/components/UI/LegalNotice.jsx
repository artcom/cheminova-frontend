import { styled } from "styled-components"

const LegalNoticeContainer = styled.div`
  display: flex;
  width: 20.4375rem;
  height: 2rem;
  flex-direction: row;
  justify-content: center;
  flex-shrink: 0;

  color: #fff;

  text-align: center;
  font-size: 0.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
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
