import { styled } from "styled-components"

import Button from "@ui/Button"
import IconButton from "@ui/IconButton"

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

export default function Navigation({
  mode,
  singleButtonVariant,
  position,
  selectLabel,
  iconColor,
  onSelect,
  onNext,
  onPrev,
}) {
  const navigationMode = mode || "horizontal"
  const buttonVariant = singleButtonVariant || "arrowDown"
  const navPosition = position || "bottom"
  const label = selectLabel || "Select"

  if (navigationMode === "single") {
    return (
      <NavigationContainer $mode="single" $position={navPosition}>
        <IconButton
          variant={buttonVariant}
          onClick={onSelect}
          color={iconColor}
        />
      </NavigationContainer>
    )
  }

  if (navigationMode === "select") {
    return (
      <NavigationContainer $mode="select" $position={navPosition}>
        <IconButton variant="arrowLeft" onClick={onPrev} color={iconColor} />
        <Button onClick={onSelect}>{label}</Button>
        <IconButton variant="arrowRight" onClick={onNext} color={iconColor} />
      </NavigationContainer>
    )
  }

  if (navigationMode === null) {
    return <NavigationContainer $position={navPosition} />
  }

  return (
    <NavigationContainer $mode="horizontal" $position={navPosition}>
      <IconButton variant="arrowLeft" onClick={onPrev} color={iconColor} />
      <IconButton variant="arrowRight" onClick={onNext} color={iconColor} />
    </NavigationContainer>
  )
}
