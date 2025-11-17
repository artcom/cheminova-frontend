import {
  Alignment,
  EventType,
  Fit,
  Layout,
  RuntimeLoader,
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

const wasmUrl = new URL("@rive-app/canvas/rive.wasm", import.meta.url).href

// Configure Rive WASM once globally
let wasmConfigured = false
const configureRiveWasm = () => {
  if (wasmConfigured) return

  if (!RuntimeLoader?.setWasmUrl) {
    console.warn("Rive RuntimeLoader.setWasmUrl is not available")
    return
  }

  RuntimeLoader.setWasmUrl(wasmUrl)
  wasmConfigured = true
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
