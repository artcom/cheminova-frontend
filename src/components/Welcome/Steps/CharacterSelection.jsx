import CharacterCarousel from "../components/CharacterCarousel"
import WelcomeStepLayout from "../components/WelcomeStepLayout"

export default function CharacterSelection({ node, siblings, next, goTo }) {
  const characters = siblings.length > 0 ? siblings : [node]
  const selectedIndex = Math.max(
    characters.findIndex((character) => character.id === node.id),
    0,
  )

  const goToCharacter = (index) => {
    const target = characters[index]
    if (target && target.id !== node.id) goTo(target)
  }

  return (
    <WelcomeStepLayout
      headline={node.name}
      subheadline={node.characterType}
      descriptionText={node.description?.replace(/<[^>]*>/g, "")}
      navigationProps={{
        mode: "select",
        onSelect: () => goTo(next),
        onPrev: () => goToCharacter(selectedIndex - 1),
        onNext: () => goToCharacter(selectedIndex + 1),
        prevDisabled: selectedIndex === 0,
        nextDisabled: selectedIndex === characters.length - 1,
        selectLabel: node.selectButtonText,
        selectDisabled: false,
      }}
    >
      <CharacterCarousel
        selectedIndex={selectedIndex}
        onSelectionChange={goToCharacter}
        characters={characters}
      />
    </WelcomeStepLayout>
  )
}
