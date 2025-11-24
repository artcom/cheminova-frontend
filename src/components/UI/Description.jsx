import { styled } from "styled-components"

const DescriptionBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
`

const DescriptionTitle = styled.div`
  height: 1.6875rem;
  align-self: stretch;
  color: #fff;
  text-align: center;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const DescriptionText = styled.div`
  align-self: stretch;
  color: #fff;
  text-align: center;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

export default function Description({ title, text }) {
  return (
    <DescriptionBlock>
      <DescriptionTitle>{title}</DescriptionTitle>
      <DescriptionText>{text}</DescriptionText>
    </DescriptionBlock>
  )
}
