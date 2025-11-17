import {
  Timeline,
  TimelineDot,
  TimelineGroup,
  TimelineTick,
  TimelineTickSlot,
} from "./styles"
import { getInitialIndicatorGeometry } from "./timelineMath"

export function TimelineMiniMap({
  timelineGroups,
  timelineHeight,
  currentIndex,
  currentGroupIndex,
  locale,
  formatDateTime,
  getGroupBottom,
  getGroupOpacity,
  getMarkerWidth,
  getMarkerColor,
  indicatorBottom,
  indicatorRight,
  indicatorWidth,
}) {
  if (!timelineGroups.length) {
    return null
  }

  const initialIndicator = getInitialIndicatorGeometry()

  return (
    <Timeline style={{ "--timeline-height": `${timelineHeight}px` }}>
      <TimelineDot
        initial={{
          bottom: initialIndicator.bottom,
          right: initialIndicator.right,
          width: initialIndicator.width,
        }}
        animate={{
          bottom: indicatorBottom,
          right: indicatorRight,
          width: indicatorWidth,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />

      {timelineGroups.map((group, groupIndex) => {
        const groupOpacity = getGroupOpacity(groupIndex, currentGroupIndex)

        return (
          <TimelineGroup
            key={`timeline-group-${group.dateKey}-${groupIndex}`}
            initial={false}
            animate={{
              bottom: getGroupBottom(groupIndex, currentGroupIndex),
              opacity: groupOpacity,
            }}
            style={{ opacity: groupOpacity }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30,
            }}
          >
            {group.items.map(({ image, globalIndex }, itemIndex) => {
              const markerWidth = getMarkerWidth(itemIndex)
              const markerColor = getMarkerColor(
                image,
                `${groupIndex}-${itemIndex}`,
              )
              const markerOpacity = (() => {
                if (globalIndex === currentIndex) {
                  return 1
                }

                if (globalIndex < currentIndex) {
                  return 0.82
                }

                return 0.48
              })()
              const markerDateTime = formatDateTime(image?.created_at, locale)
              const markerTitle =
                [markerDateTime.dateLabel, markerDateTime.timeLabel]
                  .filter(Boolean)
                  .join(" · ") || "Future memory"

              return (
                <TimelineTickSlot
                  key={`timeline-tick-${
                    image.id ?? `${groupIndex}-${itemIndex}`
                  }`}
                  title={markerTitle}
                >
                  <TimelineTick
                    $isCurrent={globalIndex === currentIndex}
                    $width={markerWidth}
                    $color={markerColor}
                    $opacity={markerOpacity}
                  />
                </TimelineTickSlot>
              )
            })}
          </TimelineGroup>
        )
      })}
    </Timeline>
  )
}
