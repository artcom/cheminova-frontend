import { styled } from "styled-components"

import Navigation from "../UI/Navigation"

const Screen = styled.div`
  position: relative;
  width: 100dvw;
  height: 100dvh;
  padding: var(--safe-inset-top) 1.625rem calc(var(--safe-inset-bottom) + 7rem)
    1.625rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  color: #fff;
  overflow: hidden; /* kiosk style */
`

const Headline = styled.h1`
  margin-top: 10.75rem; /* approximate previous visual spacing (top 11.75rem minus top padding) */
  font-family: "Bricolage Grotesque";
  font-size: 2.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  z-index: 1;
`

const Description = styled.p`
  margin-top: 1.5rem;
  width: 21.375rem;
  max-width: 100%;
  font-family: "Bricolage Grotesque";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  z-index: 1;
`

export default function Perspective({ goToUpload }) {
  // Access to global state retained if personalization reintroduced:
  // const { currentCharacterIndex } = useGlobalState()

  return (
    <Screen>
      <Headline>
        Your <br /> Perspective
      </Headline>
      <Description>
        You’ve seen the monument through new eyes. Now, add your vision to a
        living collage, together with others who care, just like you.
      </Description>
      <Navigation mode="single" onSelect={goToUpload} />
    </Screen>
  )
}
