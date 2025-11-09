import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas"
import { useEffect } from "react"
import styled from "styled-components"

const RiveContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

// Configure Rive WASM once globally
let wasmConfigured = false
const configureRiveWasm = async () => {
  if (wasmConfigured) return
  try {
    const RiveCanvas = await import("@rive-app/react-canvas")
    const wasmUrl = new URL("@rive-app/canvas/rive.wasm", import.meta.url).href
    if (RiveCanvas.RuntimeLoader?.setWasmUrl) {
      RiveCanvas.RuntimeLoader.setWasmUrl(wasmUrl)
      wasmConfigured = true
    }
  } catch (error) {
    console.warn("Failed to configure Rive WASM:", error)
  }
}

export default function RiveAnimation({
  src,
  stateMachines,
  autoplay = true,
  onLoad,
  ...otherProps
}) {
  useEffect(() => {
    configureRiveWasm()
  }, [])

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay,
    layout: new Layout({
      fit: Fit.FitHeight,
      alignment: Alignment.BottomRight,
    }),
    onLoad: onLoad ? () => onLoad(rive) : undefined,
  })

  return (
    <RiveContainer {...otherProps}>
      <RiveComponent />
    </RiveContainer>
  )
}
