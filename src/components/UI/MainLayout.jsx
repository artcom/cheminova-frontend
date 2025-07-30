import { styled } from "styled-components"
import Header from "./Header"
import IconButton from "@ui/IconButton"

const Layout = styled.div`
  width: 100vw;
  height: 100vh;
  display: grid;
  row-gap: 31.25rem;
  flex: 1 0 0;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  grid-template-columns: repeat(1, minmax(0, 1fr));
`

const StyledHeader = styled(Header)`
  flex: 1 0 0;
  align-self: stretch;
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
`

const DescriptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 0.75rem;
  flex: 1 0 0;
  align-self: stretch;
  grid-row: 2 / span 1;
  grid-column: 1 / span 1;
`

const DescriptionTitle = styled.div`
  height: 1.6875rem;
  align-self: stretch;
  color: #fff;
  text-align: center;
  font-family: "Bricolage Grotesque";
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`

const DescriptionText = styled.div`
  align-self: stretch;
  color: #fff;
  text-align: center;
  font-family: "Bricolage Grotesque";
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const ButtonLayout = styled.div`
  display: grid;
  width: 80%;
  height: 7.3125rem;
  flex-shrink: 0;
  grid-template-rows: repeat(1, minmax(0, 1fr));
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0 auto;
`

const ButtonLeft = styled(IconButton)`
  width: 3.4375rem;
  height: 3.4375rem;
  flex-shrink: 0;
  grid-row: 1 / span 1;
  grid-column: 1 / span 1;
`

const ButtonRight = styled(IconButton)`
  width: 3.4375rem;
  height: 3.4375rem;
  flex-shrink: 0;
  grid-row: 1 / span 1;
  grid-column: 2 / span 1;
  justify-self: end;
`

export default function MainLayout({
  headline,
  subheadline,
  descriptionTitle,
  descriptionText,
  prevButton,
  nextButton,
}) {
  return (
    <Layout>
      <StyledHeader headline={headline} subheadline={subheadline} />
      <DescriptionBlock>
        <DescriptionTitle>{descriptionTitle}</DescriptionTitle>
        <DescriptionText>{descriptionText}</DescriptionText>
        <ButtonLayout>
          {prevButton || <ButtonLeft variant="arrowLeft" />}
          {nextButton || <ButtonRight variant="arrowRight" />}
        </ButtonLayout>
      </DescriptionBlock>
    </Layout>
  )
}
