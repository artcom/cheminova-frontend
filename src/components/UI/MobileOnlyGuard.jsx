import useDevicePlatform from "@/hooks/useDevicePlatform"
import { useEffect, useState } from "react"
import { styled } from "styled-components"

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: #1f1f1f;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  font-family: inherit;
  z-index: 1000;
`

const Headline = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 1rem;
`

const Text = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.4;
  max-width: 32rem;
  opacity: 0.85;
`

// Shows a blocking overlay on non-mobile platforms (Windows, MacOS, Linux)
export default function MobileOnlyGuard({ children }) {
  const { isAndroid, isIOS } = useDevicePlatform()
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  if (!isClient) return null
  const isMobile = isAndroid || isIOS

  if (!isMobile) {
    return (
      <Overlay>
        <Headline>Please use a mobile device</Headline>
        <Text>
          This experience is designed for mobile sensors and camera access. Open
          this URL on your phone or tablet to continue.
        </Text>
      </Overlay>
    )
  }

  return children
}
