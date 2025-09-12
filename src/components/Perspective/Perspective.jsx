import { styled } from "styled-components"

import Navigation from "../UI/Navigation"

const Headline = styled.h1`
  position: fixed;
  top: 11.75rem;
  left: 1.625rem;
  color: #fff;

  font-family: "Bricolage Grotesque";
  font-size: 2.625rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const Description = styled.p`
  position: fixed;
  top: 20.5rem;
  left: 1.625rem;
  width: 21.375rem;
  height: 13.75rem;
  flex-shrink: 0;

  color: #fff;

  /* Subheadline */
  font-family: "Bricolage Grotesque";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

export default function Perspective({ goToUpload }) {
  return (
    <>
      <Headline>
        Your <br></br> Perspective
      </Headline>
      <Description>
        You’ve seen the monument through new eyes. Now, add your vision to a
        living collage, together with others who care, just like you.
      </Description>
      <Navigation mode="single" onSelect={goToUpload} />
    </>
  )
}
