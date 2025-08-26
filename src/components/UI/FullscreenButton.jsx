import useFullscreen from "@hooks/useFullscreen"
import { styled } from "styled-components"

import IconButton from "@ui/IconButton"

const StyledFullscreenButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`

export default function FullscreenButton(props) {
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  if (isIOSDevice) {
    return null
  }

  return (
    <StyledFullscreenButton
      variant="fullscreen"
      onClick={toggleFullscreen}
      {...props}
    />
  )
}
