import { getCharacterPersonaFlags } from "@/utils/characterPersona"
import { hasRichTextContent } from "@/utils/richText"
import { sanitizeRichText } from "@/utils/text"
import { motion } from "motion/react"
import { useRef } from "react"

import {
  CharacterActionContainer,
  CharacterContentCard,
  CharacterContentImage,
  CharacterContentWrapper,
  CharacterHeadline,
  CharacterImageWrapper,
  CharacterMediaContainer,
  CharacterMediaImage,
  CharacterNarrativeContainer,
  CharacterText,
} from "@ui/CharacterNarrativeStyles"
import RichText from "@ui/RichText"

import Navigation from "../UI/Navigation"

export default function Exploration({
  node: exploration,
  characterNode: character,
  characterCode,
  next,
  goTo,
}) {
  const containerRef = useRef(null)

  const { isFuturePerson, isArtist, isJanitor } =
    getCharacterPersonaFlags(characterCode)

  const characterImageUrl =
    exploration.heroImage?.file ||
    character?.selectedImage ||
    character?.characterImage?.file ||
    null

  const backgroundImageUrl = exploration.backgroundImage?.file || null

  const additionalTexts = Object.entries(exploration ?? {})
    .filter(([key, value]) => {
      if (key === "description" || key === "heading") return false
      if (!/description|text|content/i.test(key)) return false
      return typeof value === "string"
    })
    .map(([, value]) => value)

  const paragraphs = [exploration?.description, ...additionalTexts].filter(
    hasRichTextContent,
  )

  const heading = sanitizeRichText(exploration?.heading, { trim: true })

  if (!heading) {
    throw new Error("Exploration heading is required but missing from CMS")
  }

  if (paragraphs.length === 0) {
    throw new Error("Exploration description is required but missing from CMS")
  }

  const topImage = exploration?.topImage?.file || null

  const bottomImage = exploration?.bottomImage?.file || null

  const handleContinue = () => goTo(next)

  return (
    <CharacterNarrativeContainer
      ref={containerRef}
      data-exploration-container
      $backgroundImage={backgroundImageUrl}
    >
      <CharacterMediaContainer>
        {characterImageUrl ? (
          <CharacterMediaImage
            src={characterImageUrl}
            alt={
              character?.name ? `${character.name} portrait` : "Character image"
            }
          />
        ) : null}
      </CharacterMediaContainer>

      <CharacterContentWrapper>
        <CharacterContentCard
          as={motion.div}
          $isFuturePerson={isFuturePerson}
          $isArtist={isArtist}
          $isJanitor={isJanitor}
        >
          <CharacterHeadline
            $isFuturePerson={isFuturePerson}
            $isJanitor={isJanitor}
          >
            {heading}
          </CharacterHeadline>

          {topImage ? (
            <CharacterImageWrapper>
              <CharacterContentImage
                src={topImage}
                alt="Exploration illustration"
                $isJanitor={isJanitor}
              />
            </CharacterImageWrapper>
          ) : null}

          {paragraphs.map((paragraph, index) => (
            <CharacterText
              key={index}
              as={RichText}
              html={paragraph}
              $isFuturePerson={isFuturePerson}
            />
          ))}

          {bottomImage ? (
            <CharacterImageWrapper>
              <CharacterContentImage
                src={bottomImage}
                alt="Supporting exploration illustration"
                $isJanitor={isJanitor}
              />
            </CharacterImageWrapper>
          ) : null}

          <CharacterActionContainer $isCompact>
            <Navigation
              mode="single"
              position="static"
              onSelect={handleContinue}
              iconColor={isFuturePerson ? "white" : "black"}
            />
          </CharacterActionContainer>
        </CharacterContentCard>
      </CharacterContentWrapper>
    </CharacterNarrativeContainer>
  )
}
