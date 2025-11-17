export const TIMELINE_WIDTH = 160
export const TIMELINE_LINE_RIGHT = 0
export const TIMELINE_GROUP_END_RIGHT = 5
export const TIMELINE_MARKER_HEIGHT = 18
export const TIMELINE_MARKER_GAP = 1
export const TIMELINE_MARKER_BASE_WIDTH = 1
export const TIMELINE_MARKER_WIDTH_STEP = 0.5
export const TIMELINE_MARKER_MAX_WIDTH = 5.5
export const TIMELINE_MARKER_SLOT_WIDTH = TIMELINE_MARKER_MAX_WIDTH
export const TIMELINE_TICK_COLOR_PALETTE = [
  "rgb(249, 249, 249)",
  "rgb(214, 214, 214)",
  "rgb(178, 178, 178)",
  "rgb(142, 142, 142)",
  "rgb(106, 106, 106)",
]
export const TIMELINE_VERTICAL_PADDING = 12
export const TIMELINE_INDICATOR_EXTRA = 4
export const TIMELINE_ROW_GAP = 6
export const TIMELINE_ROW_STEP = TIMELINE_MARKER_HEIGHT + TIMELINE_ROW_GAP
export const TIMELINE_MIN_HEIGHT = 160
export const TIMELINE_GROUP_BASE_BOTTOM =
  TIMELINE_VERTICAL_PADDING - TIMELINE_MARKER_HEIGHT / 2
export const TIMELINE_INDICATOR_BASE_BOTTOM =
  TIMELINE_VERTICAL_PADDING -
  (TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA) / 2

export const DEFAULT_DATE_TIME_LABELS = {
  dateLabel: "Date unknown",
  timeLabel: "",
}

export const STACK_LAYERS = [
  {
    indexOffset: 4,
    style: {
      left: "-144px",
      top: "-144px",
      opacity: 0.45,
      zIndex: 1,
    },
  },
  {
    indexOffset: 3,
    style: {
      left: "-108px",
      top: "-108px",
      opacity: 0.58,
      zIndex: 2,
    },
  },
  {
    indexOffset: 2,
    style: {
      left: "-72px",
      top: "-72px",
      opacity: 0.72,
      zIndex: 3,
    },
  },
  {
    indexOffset: 1,
    style: {
      left: "-36px",
      top: "-36px",
      opacity: 0.88,
      zIndex: 4,
    },
  },
]

export const CARD_LAYERS = [
  {
    indexOffset: 0,
    style: {
      left: "0px",
      top: "0px",
      opacity: 1,
      zIndex: 5,
    },
  },
  ...STACK_LAYERS,
]

export const MAX_TIMELINE_IMAGES_PER_DAY = 12
