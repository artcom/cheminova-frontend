import useFullscreen from "@hooks/useFullscreen"
import { styled } from "styled-components"

import IconButton from "./IconButton"

const FullscreenButton = styled(({ className, ...props }) => {
  const { isIOSDevice, toggleFullscreen } = useFullscreen()

  if (isIOSDevice) {
    return null
  }

  return (
    <IconButton
      className={className}
      variant="fullscreen"
      onClick={toggleFullscreen}
      {...props}
    />
  )
})`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
`

export default FullscreenButton
