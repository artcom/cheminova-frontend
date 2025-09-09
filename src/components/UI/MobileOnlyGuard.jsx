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

const BypassButton = styled.button`
  margin-top: 2rem;
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.5px;
  transition:
    background 0.2s,
    color 0.2s;
  &:hover {
    background: #ffffff;
    color: #1f1f1f;
  }
`

// Shows a blocking overlay on non-mobile platforms (Windows, MacOS, Linux)
export default function MobileOnlyGuard({ children }) {
  const { isAndroid, isIOS } = useDevicePlatform()
  const [isClient, setIsClient] = useState(false)
  const [bypassed, setBypassed] = useState(false)
  useEffect(() => setIsClient(true), [])

  if (!isClient) return null
  const isMobile = isAndroid || isIOS

  if (!isMobile && !bypassed) {
    return (
      <Overlay>
        <Headline>Please use a mobile device</Headline>
        <Text>
          This experience is designed for mobile sensors and camera access. Open
          this URL on your phone or tablet to continue.
        </Text>
        <BypassButton onClick={() => setBypassed(true)}>
          Continue anyway
        </BypassButton>
      </Overlay>
    )
  }

  return children
}
