import { theme } from "@providers/Theme/theme"
import { motion } from "motion/react"
import { styled } from "styled-components"

import {
  TIMELINE_GROUP_END_RIGHT,
  TIMELINE_INDICATOR_EXTRA,
  TIMELINE_LINE_RIGHT,
  TIMELINE_MARKER_GAP,
  TIMELINE_MARKER_HEIGHT,
  TIMELINE_MARKER_SLOT_WIDTH,
  TIMELINE_VERTICAL_PADDING,
  TIMELINE_WIDTH,
} from "./constants"

export const Page = styled.div`
  background-color: ${theme.colors.background.dark};
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
`

export const TimelineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

export const ImageStack = styled.div`
  position: relative;
  width: 270px;
  height: 270px;
  margin: 130px 0 60px 60px;
`

export const ImageCard = styled(motion.div)`
  position: absolute;
  width: 270px;
  height: 270px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0px 0px 22px 0px rgba(0, 0, 0, 0.58);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export const StackOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.55);
  z-index: 6;
  text-align: center;
`

export const OverlayMessage = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 16px;
  line-height: 1.4;
`

export const InfoSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  color: white;
  margin: auto 0 5rem 20px;
  padding-right: 20px;
`

export const InfoContent = styled.div`
  width: 250px;
`

export const InfoDivider = styled.div`
  align-self: stretch;
  border-top: 1px dotted rgba(255, 255, 255, 0.35);
  width: calc(100vw - 60px);
`

export const Title = styled.h1`
  font-family: "Bricolage Grotesque", sans-serif;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  line-height: normal;
`

export const DateTime = styled.div`
  font-family: "IBM Plex Sans", sans-serif;
  font-size: 16px;
  line-height: 22px;
  font-weight: 400;

  p {
    margin: 0;
  }
`

export const Timeline = styled.div`
  position: fixed;
  right: 5px;
  bottom: 5rem;
  width: ${TIMELINE_WIDTH}px;
  pointer-events: none;
  --timeline-height: 320px;
  height: var(--timeline-height);

  &::before {
    content: "";
    position: absolute;
    top: ${TIMELINE_VERTICAL_PADDING}px;
    bottom: ${TIMELINE_VERTICAL_PADDING}px;
    right: ${TIMELINE_LINE_RIGHT}px;
    width: 2px;
    background: linear-gradient(
      to top,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
  }
`

export const TimelineDot = styled(motion.div)`
  position: absolute;
  height: ${TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA}px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.65);
  border-radius: 0;
  z-index: 2;
`

export const TimelineTick = styled.div`
  width: ${({ $width }) => `${$width}px`};
  height: ${TIMELINE_MARKER_HEIGHT}px;
  background: ${({ $color }) => $color};
  opacity: ${({ $opacity }) => $opacity};
  flex: 0 0 auto;
  box-shadow: ${({ $isCurrent }) =>
    $isCurrent ? "0 0 6px rgba(255, 255, 255, 0.55)" : "none"};
  border-radius: 0;
  transition:
    width 0.3s ease,
    opacity 0.3s ease,
    box-shadow 0.3s ease,
    background 0.3s ease;
`

export const TimelineGroup = styled(motion.div)`
  position: absolute;
  display: flex;
  gap: ${TIMELINE_MARKER_GAP}px;
  align-items: center;
  flex-direction: row-reverse;
  justify-content: flex-start;
  right: ${TIMELINE_GROUP_END_RIGHT}px;
  z-index: 1;
  min-height: ${TIMELINE_MARKER_HEIGHT}px;
`

export const TimelineTickSlot = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 ${TIMELINE_MARKER_SLOT_WIDTH}px;
  width: ${TIMELINE_MARKER_SLOT_WIDTH}px;
  height: ${TIMELINE_MARKER_HEIGHT}px;
`

export const ChevronWrapper = styled.div`
  position: fixed;
  bottom: 12rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ChevronButton = styled(motion.button)`
  width: 44px;
  height: 44px;
  border: 2px solid white;
  border-radius: 30px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 100;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 22px;
    height: 12px;
    stroke: white;
    stroke-width: 2;
    fill: none;
  }
`

export const ExitButton = styled.button`
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 15px;
  border-radius: 5px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  z-index: 100;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`
