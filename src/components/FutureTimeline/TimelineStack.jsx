import LoadingSpinner from "@/components/UI/LoadingSpinner"
import { LayoutGroup } from "motion/react"

import { ImageCard, ImageStack, OverlayMessage, StackOverlay } from "./styles"

export function TimelineStack({
  visibleCards,
  showLoadingOverlay,
  showErrorOverlay,
  showEmptyOverlay,
  error,
}) {
  return (
    <ImageStack>
      <LayoutGroup id="future-timeline-stack">
        {visibleCards.map(({ key, layoutId, src, alt, style, isPrimary }) => (
          <ImageCard
            key={key}
            layoutId={layoutId}
            layout
            initial={
              isPrimary
                ? {
                    opacity: 0,
                    scale: 0.8,
                  }
                : undefined
            }
            animate={
              isPrimary
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : undefined
            }
            transition={{
              duration: isPrimary ? 0.4 : undefined,
              ease: isPrimary ? "easeOut" : undefined,
              layout: { type: "spring", stiffness: 260, damping: 30 },
            }}
            style={style}
          >
            <img src={src} alt={alt} loading="lazy" />
          </ImageCard>
        ))}
      </LayoutGroup>

      {showLoadingOverlay && (
        <StackOverlay>
          <LoadingSpinner text="Fetching future memories..." />
        </StackOverlay>
      )}

      {showErrorOverlay && (
        <StackOverlay>
          <OverlayMessage>
            {error instanceof Error
              ? error.message
              : "Something went wrong while reaching the future."}
          </OverlayMessage>
        </StackOverlay>
      )}

      {showEmptyOverlay && (
        <StackOverlay>
          <OverlayMessage>
            No approved future timeline images are available yet.
          </OverlayMessage>
        </StackOverlay>
      )}
    </ImageStack>
  )
}
