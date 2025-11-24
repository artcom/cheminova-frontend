import { forwardRef } from "react"
import { Link } from "react-router-dom"
import { styled } from "styled-components"

import Button from "@ui/Button"
import IconButton from "@ui/IconButton"

const StyledLink = styled(Link)`
  all: unset;
  width: 8.875rem;
  height: 3.4375rem;
  border-radius: 2.75rem;
  border: 2px solid #fff;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  text-align: center;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  cursor: pointer;
  text-decoration: none;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`

const NavigationContainer = styled.div`
  display: flex;
  width: 90%;
  flex-shrink: 0;
  z-index: 10;
  margin: 0 auto;
  position: ${({ $position }) => ($position === "bottom" ? "fixed" : "static")};
  ${({ $position }) =>
    $position === "bottom" &&
    `
      left: 50%;
      transform: translateX(-50%);
      bottom: 0.05rem;
      pointer-events: none;
      & > * { pointer-events: auto; }
    `};

  ${({ $mode }) => {
    switch ($mode) {
      case "single":
        return `
          padding: 1.9375rem 0 0;
          justify-content: center;
          align-items: center;
        `
      case "horizontal":
        return `
          padding: 2rem 0 0 0;
          justify-content: space-between;
          align-items: center;
        `
      case "select":
        return `
          padding: 2rem 0 0 0;
          justify-content: space-between;
          align-items: center;
        `
      default:
        return `
          padding: 1.9375rem 1.5625rem 0;
          justify-content: center;
          align-items: flex-start;
          gap: 14.5625rem;
        `
    }
  }}
  /* Ensure container never sits flush off-screen when not using fixed bottom mode */
  margin-bottom: env(safe-area-inset-bottom, 0);
`

const Navigation = forwardRef(function Navigation(
  {
    mode,
    singleButtonVariant,
    position,
    selectLabel,
    selectHref,
    iconColor,
    onSelect,
    onNext,
    onPrev,
    className,
    prevDisabled,
    nextDisabled,
    ...rest
  },
  ref,
) {
  const navigationMode = mode || "horizontal"
  const buttonVariant = singleButtonVariant || "arrowDown"
  const navPosition = position || "bottom"
  const label = selectLabel || "Select"

  if (navigationMode === "single") {
    return (
      <NavigationContainer
        ref={ref}
        $mode="single"
        $position={navPosition}
        className={className}
        {...rest}
      >
        {buttonVariant === "text" ? (
          <Button onClick={onSelect}>{label}</Button>
        ) : (
          <IconButton
            variant={buttonVariant}
            onClick={onSelect}
            color={iconColor}
          />
        )}
      </NavigationContainer>
    )
  }

  if (navigationMode === "select") {
    return (
      <NavigationContainer
        ref={ref}
        $mode="select"
        $position={navPosition}
        className={className}
        {...rest}
      >
        <IconButton
          variant="arrowLeft"
          onClick={prevDisabled ? undefined : onPrev}
          disabled={prevDisabled}
          color={iconColor}
        />
        {selectHref ? (
          <StyledLink to={selectHref} prefetch="render" onClick={onSelect}>
            {label}
          </StyledLink>
        ) : (
          <Button onClick={onSelect}>{label}</Button>
        )}
        <IconButton
          variant="arrowRight"
          onClick={nextDisabled ? undefined : onNext}
          disabled={nextDisabled}
          color={iconColor}
        />
      </NavigationContainer>
    )
  }

  if (navigationMode === null) {
    return (
      <NavigationContainer
        ref={ref}
        $position={navPosition}
        className={className}
        {...rest}
      />
    )
  }

  return (
    <NavigationContainer
      ref={ref}
      $mode="horizontal"
      $position={navPosition}
      className={className}
      {...rest}
    >
      <IconButton
        variant="arrowLeft"
        onClick={prevDisabled ? undefined : onPrev}
        disabled={prevDisabled}
        color={iconColor}
      />
      <IconButton
        variant="arrowRight"
        onClick={nextDisabled ? undefined : onNext}
        disabled={nextDisabled}
        color={iconColor}
      />
    </NavigationContainer>
  )
})

export default Navigation
