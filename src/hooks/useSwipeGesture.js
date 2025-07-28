import { useEffect, useRef } from "react"

export default function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  direction = "horizontal",
} = {}) {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const controller = new AbortController()

    let touchStartX = null
    let touchEndX = null
    let touchStartY = null
    let touchEndY = null

    const handleTouchStart = (e) => {
      touchEndX = null
      touchEndY = null
      touchStartX = e.targetTouches[0].clientX
      touchStartY = e.targetTouches[0].clientY
    }

    const handleTouchMove = (e) => {
      touchEndX = e.targetTouches[0].clientX
      touchEndY = e.targetTouches[0].clientY
    }

    const isHorizontalSwipe = () =>
      direction === "horizontal" && touchStartX !== null && touchEndX !== null

    const isVerticalSwipe = () =>
      direction === "vertical" && touchStartY !== null && touchEndY !== null

    const handleTouchEnd = () => {
      if (isHorizontalSwipe()) {
        const distanceX = touchStartX - touchEndX
        const isLeftSwipe = distanceX > minSwipeDistance
        const isRightSwipe = distanceX < -minSwipeDistance

        if (isLeftSwipe && onSwipeLeft) {
          onSwipeLeft()
        }

        if (isRightSwipe && onSwipeRight) {
          onSwipeRight()
        }
      }

      if (isVerticalSwipe()) {
        const distanceY = touchStartY - touchEndY
        const isUpSwipe = distanceY > minSwipeDistance
        const isDownSwipe = distanceY < -minSwipeDistance

        if (isUpSwipe && onSwipeUp) {
          onSwipeUp()
        }

        if (isDownSwipe && onSwipeDown) {
          onSwipeDown()
        }
      }
    }

    element.addEventListener("touchstart", handleTouchStart, {
      signal: controller.signal,
      passive: true,
    })
    element.addEventListener("touchmove", handleTouchMove, {
      signal: controller.signal,
      passive: true,
    })
    element.addEventListener("touchend", handleTouchEnd, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance,
    direction,
  ])

  return elementRef
}
