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

function LegalNotice({ setShowScreen }) {
  return (
    <LegalNoticeContainer>
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => setShowScreen && setShowScreen("imprint")}
      >
        Legal Notice
      </span>
      &nbsp;&amp;&nbsp;
      <span
        style={{
          textDecoration: "underline",
          cursor: "pointer",
        }}
        onClick={() => setShowScreen && setShowScreen("privacy")}
      >
        Privacy Policy
      </span>
    </LegalNoticeContainer>
  )
}

export default LegalNotice
