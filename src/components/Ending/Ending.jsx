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

export default function Ending({ goToWelcome }) {
  return (
    <>
      <Headline>Thank You</Headline>
      <Description>
        Thank you for contributing to this monument and keeping it alive. Now
        take a further look around La Nau.
      </Description>
      <Navigation mode="single" onSelect={goToWelcome} />
    </>
  )
}
