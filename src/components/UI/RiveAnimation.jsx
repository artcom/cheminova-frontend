import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas"
import styled from "styled-components"

const RiveContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function RiveAnimation({
  src,
  stateMachines,
  autoplay = true,
  onLoad,
  ...otherProps
}) {
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
