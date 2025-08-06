import { styled } from "styled-components"
import IconButton from "@ui/IconButton"
import Button from "@ui/Button"

const NavigationContainer = styled.div`
  display: flex;
  width: 24.5625rem;
  height: 7.3125rem;
  flex-shrink: 0;
  z-index: 10;
  margin: 0 auto;

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
          padding: 1.9375rem 1.5625rem;
          justify-content: center;
          align-items: flex-start;
          gap: 14.5625rem;
        `
      case "select":
        return `
          padding: 2rem 0 1.875rem 0;
          justify-content: center;
          align-items: flex-start;
          gap: 4.4375rem;
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
  mode = "horizontal",
  onPrev,
  onNext,
  onSelect,
  singleButtonVariant = "arrowDown",
}) {
  if (mode === "single") {
    return (
      <NavigationContainer $mode="single">
        <IconButton variant={singleButtonVariant} onClick={onNext} />
      </NavigationContainer>
    )
  }

  if (mode === "select") {
    return (
      <NavigationContainer $mode="select">
        <IconButton variant="arrowLeft" onClick={onPrev} />
        <Button onClick={onSelect}>Select</Button>
        <IconButton variant="arrowRight" onClick={onNext} />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer $mode="horizontal">
      <IconButton variant="arrowLeft" onClick={onPrev} />
      <IconButton variant="arrowRight" onClick={onNext} />
    </NavigationContainer>
  )
}
