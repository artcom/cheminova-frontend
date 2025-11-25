import {
  CARD_LAYERS,
  DEFAULT_DATE_TIME_LABELS,
  MAX_TIMELINE_IMAGES_PER_DAY,
  TIMELINE_GROUP_BASE_BOTTOM,
  TIMELINE_GROUP_END_RIGHT,
  TIMELINE_INDICATOR_EXTRA,
  TIMELINE_MARKER_BASE_WIDTH,
  TIMELINE_MARKER_GAP,
  TIMELINE_MARKER_HEIGHT,
  TIMELINE_MARKER_MAX_WIDTH,
  TIMELINE_MARKER_SLOT_WIDTH,
  TIMELINE_MARKER_WIDTH_STEP,
  TIMELINE_MIN_HEIGHT,
  TIMELINE_ROW_STEP,
  TIMELINE_TICK_COLOR_PALETTE,
  TIMELINE_VERTICAL_PADDING,
} from "./constants"

export const formatDateTime = (value, locale) => {
  if (!value) {
    return DEFAULT_DATE_TIME_LABELS
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return DEFAULT_DATE_TIME_LABELS
  }

  try {
    const dateLabel = new Intl.DateTimeFormat(locale || undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)

    const timeLabel = new Intl.DateTimeFormat(locale || undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)

    return {
      dateLabel,
      timeLabel,
    }
  } catch (error) {
    console.error("Failed to format date for future timeline", error)
    return DEFAULT_DATE_TIME_LABELS
  }
}

export const getImageTitle = (image) => {
  if (!image) {
    return ""
  }

  const titleSources = [
    image.title,
    image.uploaded_text,
    image.uploaded_user_name,
  ]

  for (const value of titleSources) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim()
    }
  }

  return "Untitled memory"
}

const hashString = (value) => {
  let hash = 0

  const input = String(value ?? "")
  for (let index = 0; index < input.length; index += 1) {
    const char = input.charCodeAt(index)
    hash = (hash << 5) - hash + char
    hash |= 0
  }

  return Math.abs(hash)
}

const getDayKey = (value) => {
  if (!value) {
    return "unknown"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "unknown"
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const sortTimelineImages = (images = []) =>
  images.slice().sort((a, b) => {
    const timeA = Date.parse(a?.created_at ?? "")
    const timeB = Date.parse(b?.created_at ?? "")

    if (!Number.isNaN(timeA) && !Number.isNaN(timeB)) {
      return timeB - timeA
    }

    if (!Number.isNaN(timeA)) return -1
    if (!Number.isNaN(timeB)) return 1

    const idA = typeof a?.id === "number" ? a.id : Number.MAX_SAFE_INTEGER
    const idB = typeof b?.id === "number" ? b.id : Number.MAX_SAFE_INTEGER

    if (idA !== idB) {
      return idB - idA
    }

    const titleA = a?.title ?? ""
    const titleB = b?.title ?? ""
    return String(titleA).localeCompare(String(titleB))
  })

export const limitImagesPerDay = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return Array.isArray(images) ? images : []
  }

  const indicesByDay = new Map()

  images.forEach((image, index) => {
    if (!image) {
      return
    }

    const dayKey = getDayKey(image.created_at)
    if (!indicesByDay.has(dayKey)) {
      indicesByDay.set(dayKey, [])
    }

    indicesByDay.get(dayKey).push(index)
  })

  const hasOverflowingDay = Array.from(indicesByDay.values()).some(
    (indices) => indices.length > MAX_TIMELINE_IMAGES_PER_DAY,
  )

  if (!hasOverflowingDay) {
    return images
  }

  const allowedIndices = new Set()

  indicesByDay.forEach((indices, dayKey) => {
    if (indices.length <= MAX_TIMELINE_IMAGES_PER_DAY) {
      indices.forEach((index) => allowedIndices.add(index))
      return
    }

    const randomizedSelection = indices
      .slice()
      .sort((indexA, indexB) => {
        const imageA = images[indexA]
        const imageB = images[indexB]

        const weightA = hashString(
          `${dayKey}-${imageA?.id ?? imageA?.file ?? indexA}`,
        )
        const weightB = hashString(
          `${dayKey}-${imageB?.id ?? imageB?.file ?? indexB}`,
        )

        return weightA - weightB
      })
      .slice(0, MAX_TIMELINE_IMAGES_PER_DAY)

    randomizedSelection.forEach((index) => allowedIndices.add(index))
  })

  return images.filter((_, index) => allowedIndices.has(index))
}

export const computeTimelineImages = (images = []) =>
  limitImagesPerDay(sortTimelineImages(images))

export const groupImagesByDay = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return { groups: [], indexMap: [] }
  }

  const groups = []
  const indexMap = []

  images.forEach((image, index) => {
    if (!image) {
      return
    }

    const dayKey = getDayKey(image.created_at)
    let group = groups[groups.length - 1]

    if (!group || group.dateKey !== dayKey) {
      group = {
        dateKey: dayKey,
        items: [],
      }
      groups.push(group)
    }

    const itemIndex = group.items.length
    group.items.push({ image, globalIndex: index })
    indexMap[index] = { groupIndex: groups.length - 1, itemIndex }
  })

  return { groups, indexMap }
}

export const buildVisibleCards = (timelineImages, currentIndex) =>
  CARD_LAYERS.map(({ indexOffset, style }, position) => {
    const imageIndex = currentIndex + indexOffset
    const image = timelineImages[imageIndex]

    if (!image) {
      return null
    }

    return {
      key: `image-card-${image.id ?? imageIndex}`,
      layoutId: `timeline-image-${image.id ?? imageIndex}`,
      src: image.file,
      alt: position === 0 ? getImageTitle(image) : "",
      style,
      isPrimary: position === 0,
    }
  }).filter(Boolean)

export const buildTimelineMeta = (timelineImages, requestedIndex) => {
  const totalImages = timelineImages.length
  const currentIndex =
    totalImages === 0
      ? 0
      : Math.min(Math.max(requestedIndex, 0), totalImages - 1)
  const currentImage =
    totalImages === 0 ? undefined : timelineImages[currentIndex]
  const visibleCards = buildVisibleCards(timelineImages, currentIndex)
  const { groups: timelineGroups, indexMap: timelineIndexMap } =
    groupImagesByDay(timelineImages)
  const totalGroups = timelineGroups.length

  return {
    totalImages,
    currentIndex,
    currentImage,
    visibleCards,
    timelineGroups,
    timelineIndexMap,
    totalGroups,
  }
}

export const getGroupBottom = (groupIndex, currentGroupIndex) =>
  TIMELINE_GROUP_BASE_BOTTOM +
  (groupIndex - currentGroupIndex) * TIMELINE_ROW_STEP

export const getGroupOpacity = (groupIndex, currentGroupIndex) => {
  const relativeIndex = currentGroupIndex - groupIndex

  if (relativeIndex <= 0) {
    return 1
  }

  if (relativeIndex === 1) {
    return 0.5
  }

  return 0
}

export const getTimelineHeight = (totalGroups) =>
  totalGroups > 0
    ? Math.max(
        TIMELINE_MIN_HEIGHT,
        TIMELINE_VERTICAL_PADDING * 2 +
          (totalGroups - 1) * TIMELINE_ROW_STEP +
          TIMELINE_MARKER_HEIGHT,
      )
    : TIMELINE_MIN_HEIGHT

export const getMarkerWidth = (itemIndex = 0) => {
  const safeIndex = Math.max(itemIndex, 0)
  const rawWidth =
    TIMELINE_MARKER_BASE_WIDTH + TIMELINE_MARKER_WIDTH_STEP * safeIndex

  return Math.min(rawWidth, TIMELINE_MARKER_MAX_WIDTH)
}

export const getMarkerCenterRight = (itemIndex = 0) => {
  const safeIndex = Math.max(itemIndex, 0)
  const slotRightEdge =
    TIMELINE_GROUP_END_RIGHT +
    safeIndex * (TIMELINE_MARKER_SLOT_WIDTH + TIMELINE_MARKER_GAP)

  return slotRightEdge + getMarkerWidth(safeIndex) / 2
}

export const getMarkerColor = (image, fallbackSeed) => {
  if (TIMELINE_TICK_COLOR_PALETTE.length === 0) {
    return "rgb(220, 220, 220)"
  }

  const seedSource =
    image?.id ?? image?.file ?? image?.uploaded_text ?? fallbackSeed
  const paletteIndex =
    hashString(String(seedSource ?? fallbackSeed ?? 0)) %
    TIMELINE_TICK_COLOR_PALETTE.length

  return TIMELINE_TICK_COLOR_PALETTE[paletteIndex]
}

export const getIndicatorWidth = (visualIndex = 0) =>
  getMarkerWidth(visualIndex) + TIMELINE_INDICATOR_EXTRA

export const getIndicatorRight = (visualIndex = 0) => {
  const indicatorWidth = getIndicatorWidth(visualIndex)
  return getMarkerCenterRight(visualIndex) - indicatorWidth / 2
}

export const getInitialIndicatorGeometry = () => {
  const width = getIndicatorWidth(0)
  return {
    width,
    bottom:
      TIMELINE_VERTICAL_PADDING -
      (TIMELINE_MARKER_HEIGHT + TIMELINE_INDICATOR_EXTRA) / 2,
    right: getMarkerCenterRight(0) - width / 2,
  }
}
