import {
  Alignment,
  EventType,
  Fit,
  Layout,
  useRive,
} from "@rive-app/react-canvas"
import { useEffect, useMemo } from "react"
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
  stopAfterFirstLoop = false,
  fit,
  alignment,
  layout: layoutOverride,
  ...otherProps
}) {
  useEffect(() => {
    configureRiveWasm()
  }, [])

  const resolvedLayout = useMemo(() => {
    if (layoutOverride) {
      return layoutOverride instanceof Layout
        ? layoutOverride
        : new Layout(layoutOverride)
    }

    return new Layout({
      fit: fit ?? Fit.FitHeight,
      alignment: alignment ?? Alignment.BottomRight,
    })
  }, [alignment, fit, layoutOverride])

  const { rive, RiveComponent } = useRive({
    src,
    stateMachines,
    autoplay,
    layout: resolvedLayout,
    onLoad: onLoad ? () => onLoad(rive) : undefined,
  })

  useEffect(() => {
    if (
      !rive ||
      !stopAfterFirstLoop ||
      typeof rive.on !== "function" ||
      typeof rive.off !== "function"
    ) {
      return undefined
    }

    const handleLoop = () => {
      rive.pause()
      rive.off(EventType.Loop, handleLoop)
    }

    rive.on(EventType.Loop, handleLoop)

    return () => {
      rive.off(EventType.Loop, handleLoop)
    }
  }, [rive, stopAfterFirstLoop])

  return (
    <RiveContainer {...otherProps}>
      <RiveComponent />
    </RiveContainer>
  )
}
