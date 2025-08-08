import { styled } from "styled-components"
import IconButton from "@ui/IconButton"
import Button from "@ui/Button"

const NavigationContainer = styled.div`
  display: flex;
  width: 90%;
  height: 7.3125rem;
  flex-shrink: 0;
  z-index: 10;
  margin: 0 auto;
  ${({ $position }) =>
    $position === "bottom"
      ? `
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
  `
      : ``};

  ${({ $mode }) => {
    switch ($mode) {
      case "single":
        return `
          padding: 1.9375rem 0;
          justify-content: center;
          align-items: center;
        `
      case "horizontal":
        return `
          padding: 2rem 0 1.875rem 0;
          justify-content: space-between;
          align-items: center;
        `
      case "select":
        return `
          padding: 2rem 0 1.875rem 0;
          justify-content: space-between;
          align-items: center;
        `
      default:
        return `
          padding: 1.9375rem 1.5625rem;
          justify-content: center;
          align-items: flex-start;
          gap: 14.5625rem;
        `
    }
  }}
`

export default function aNavigation({
  mode = "horizontal",
  onPrev,
  onNext,
  onSelect,
  singleButtonVariant = "arrowDown",
  position = "default",
  selectLabel = "Select",
}) {
  if (mode === "single") {
    return (
      <NavigationContainer $mode="single" $position={position}>
        <IconButton variant={singleButtonVariant} onClick={onNext} />
      </NavigationContainer>
    )
  }

  if (mode === "select") {
    return (
      <NavigationContainer $mode="select" $position={position}>
        <IconButton variant="arrowLeft" onClick={onPrev} />
        <Button onClick={onSelect}>{selectLabel}</Button>
        <IconButton variant="arrowRight" onClick={onNext} />
      </NavigationContainer>
    )
  }

  if (mode === null) {
    return <NavigationContainer $position={position} />
  }

  return (
    <NavigationContainer $mode="horizontal" $position={position}>
      <IconButton variant="arrowLeft" onClick={onPrev} />
      <IconButton variant="arrowRight" onClick={onNext} />
    </NavigationContainer>
  )
}
