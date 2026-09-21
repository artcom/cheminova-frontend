import { styled } from "styled-components"

import IconButton from "../UI/IconButton"
import RichText from "../UI/RichText"
import { richTextStyles } from "../UI/richTextStyles"

const SCREEN_BACKGROUND = "#1F1F1F"
const CARD_BACKGROUND = "#1F1F1F"
const CARD_BORDER = "rgba(212, 175, 55, 0.2)"
const ACCENT = "#d4af37"
const MUTED_TEXT = "#9e9ca5"

const Screen = styled.div`
  width: 100dvw;
  height: 100dvh;
  padding: 1.875rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: ${SCREEN_BACKGROUND};
  color: #fff;
  overflow-y: auto;
  font-variation-settings:
    "opsz" 14,
    "wdth" 100;
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0 1.5rem;
`

const Byline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`

const BylineText = styled.p`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${ACCENT};
  white-space: nowrap;
`

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Headline = styled.h1`
  margin: 0;
  font-size: 1.875rem;
  font-style: bold;
  font-weight: 700;
  line-height: 2.75rem;
  letter-spacing: -0.8px;
  word-break: break-word;
`

const Description = styled(RichText)`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.25rem;
  color: ${MUTED_TEXT};

  ${richTextStyles}
`

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1.25rem;
`

const Card = styled.button`
  all: unset;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid ${CARD_BORDER};
  border-radius: 1rem;
  background: ${CARD_BACKGROUND};
  cursor: pointer;
  overflow: hidden;

  &:active {
    transform: scale(0.99);
  }
`

const CardImage = styled.img`
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  object-fit: cover;
  flex-shrink: 0;
`

const CardText = styled.div`
  flex: 1 0 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  word-break: break-word;
`

const CardTitle = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
`

const CardDescription = styled.span`
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1rem;
  color: ${MUTED_TEXT};
`

const CardAction = styled.span`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  pointer-events: none;
`

export default function ChooseOption({ node, characterNode, goTo }) {
  const offered = node.children ?? []
  if (offered.length === 0) {
    console.warn(
      `The choice "${node.title}" (id ${node.id}) offers nothing — it has no published child page in the CMS.`,
    )
  }
  const bylineName = [characterNode?.name, characterNode?.characterType]
    .filter(Boolean)
    .join(" • ")

  return (
    <Screen>
      <Header>
        {(characterNode?.characterImage?.file || bylineName) && (
          <Byline>
            {characterNode?.characterImage?.file && (
              <Avatar src={characterNode.characterImage.file} alt="" />
            )}
            {bylineName && <BylineText>{bylineName}</BylineText>}
          </Byline>
        )}
        <HeaderText>
          {node.heading && <Headline>{node.heading}</Headline>}
          <Description html={node.description} />
        </HeaderText>
      </Header>

      <Cards>
        {offered.map((child) => {
          const label = child.optionLabel ?? child.title

          return (
            <Card key={child.id} onClick={() => goTo(child)} aria-label={label}>
              {child.optionImage?.file && (
                <CardImage src={child.optionImage.file} alt="" />
              )}
              <CardText>
                <CardTitle>{label}</CardTitle>
                {child.optionShortDescription && (
                  <CardDescription>
                    {child.optionShortDescription}
                  </CardDescription>
                )}
              </CardText>
              <CardAction aria-hidden="true">
                <IconButton
                  variant="arrowRight"
                  size="2.75rem"
                  as="span"
                  type={undefined}
                />
              </CardAction>
            </Card>
          )
        })}
      </Cards>
    </Screen>
  )
}
