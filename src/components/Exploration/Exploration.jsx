import { getCharacterPersonaFlags } from "@/utils/characterPersona"
import { extractFromContentTree } from "@/utils/cmsHelpers"
import { loadCharacterSection } from "@/utils/loaderHelpers"
import { sanitizeRichText, splitIntoParagraphs } from "@/utils/text"
import { motion } from "motion/react"
import { useRef } from "react"
import { useLoaderData, useNavigate } from "react-router-dom"

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

import Navigation from "../UI/Navigation"

export default function Exploration() {
  const { characterSlug, character, exploration } = useLoaderData()
  const containerRef = useRef(null)
  const navigate = useNavigate()

  const { isFuturePerson, isArtist, isJanitor } =
    getCharacterPersonaFlags(characterSlug)

  if (!character) {
    throw new Error("Character data is required but missing from CMS")
  }

  if (!exploration) {
    throw new Error("Exploration data is required but missing from CMS")
  }

  const characterImageUrl =
    exploration.heroImage?.file ||
    character.selectedImage ||
    character.characterImage?.file ||
    null

  const backgroundImageUrl = exploration.backgroundImage?.file || null

  const descriptionParagraphs = splitIntoParagraphs(exploration?.description)

  const additionalParagraphs = Object.entries(exploration ?? {})
    .filter(([key, value]) => {
      if (key === "description" || key === "heading") return false
      if (!/description|text|content/i.test(key)) return false
      return typeof value === "string"
    })
    .flatMap(([, value]) => splitIntoParagraphs(value))

  const paragraphs =
    descriptionParagraphs.length > 0 || additionalParagraphs.length > 0
      ? [...descriptionParagraphs, ...additionalParagraphs]
      : []

  const heading = sanitizeRichText(exploration?.heading, { trim: true })

  if (!heading) {
    throw new Error("Exploration heading is required but missing from CMS")
  }

  if (paragraphs.length === 0) {
    throw new Error("Exploration description is required but missing from CMS")
  }

  const topImage = exploration?.topImage?.file || null

  const bottomImage = exploration?.bottomImage?.file || null

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
            <CharacterText key={index} $isFuturePerson={isFuturePerson}>
              {paragraph}
            </CharacterText>
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
              onSelect={() =>
                navigate(`/characters/${characterSlug}/perspective`)
              }
              iconColor={isFuturePerson ? "white" : "black"}
            />
          </CharacterActionContainer>
        </CharacterContentCard>
      </CharacterContentWrapper>
    </CharacterNarrativeContainer>
  )
}

export const clientLoader = async ({ params }) => {
  const {
    section: exploration,
    characterSlug,
    characterIndex,
    character,
  } = await loadCharacterSection(
    params,
    (content, characterIndex) =>
      extractFromContentTree.getExploration(content, characterIndex),
    { missingMessage: "Exploration data missing from CMS" },
  )

  return { characterIndex, characterSlug, character, exploration }
}
