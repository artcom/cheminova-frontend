import { styled } from "styled-components"
import IconButton from "@ui/IconButton"

const NavigationContainer = styled.div`
  display: grid;
  width: 80%;
  height: 7.3125rem;
  flex-shrink: 0;
  margin: 0 auto;
  z-index: 10;

  ${({ $mode }) => {
    switch ($mode) {
      case "single":
        return `
          grid-template-rows: repeat(1, minmax(0, 1fr));
          grid-template-columns: repeat(1, minmax(0, 1fr));
          place-items: center;
        `
      case "dual":
      default:
        return `
          grid-template-rows: repeat(1, minmax(0, 1fr));
          grid-template-columns: repeat(2, minmax(0, 1fr));
        `
    }
  }}
`

const DirectedButton = styled(IconButton)`
  flex-shrink: 0;
  width: 3.4375rem;
  height: 3.4375rem;
  grid-row: 1 / span 1;
  grid-column: ${({ direction, $mode }) => {
    if ($mode === "single") return "1 / span 1"
    return direction === "right" ? "2 / span 1" : "1 / span 1"
  }};
  justify-self: ${({ direction, $mode }) => {
    if ($mode === "single") return "center"
    return direction === "right" ? "end" : "start"
  }};
`

export default function Navigation({
  mode = "dual",
  onPrev,
  onNext,
  singleButtonVariant = "arrowDown",
}) {
  if (mode === "single") {
    return (
      <NavigationContainer $mode="single">
        <DirectedButton
          variant={singleButtonVariant}
          onClick={onNext}
          $mode="single"
        />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer $mode="dual">
      {onPrev ? (
        <DirectedButton
          direction="left"
          variant="arrowLeft"
          onClick={onPrev}
          $mode="dual"
        />
      ) : (
        <DirectedButton direction="left" variant="arrowLeft" $mode="dual" />
      )}
      {onNext ? (
        <DirectedButton
          direction="right"
          variant="arrowRight"
          onClick={onNext}
          $mode="dual"
        />
      ) : (
        <DirectedButton direction="right" variant="arrowRight" $mode="dual" />
      )}
    </NavigationContainer>
  )
}
