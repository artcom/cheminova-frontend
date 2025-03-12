import { useEffect, useRef } from "react"

export default function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  minSwipeDistance = 50,
  direction = "horizontal", // 'horizontal', 'vertical', or 'both'
} = {}) {
  const elementRef = useRef(null)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)
  const touchStartYRef = useRef(null)
  const touchEndYRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      touchEndXRef.current = null
      touchEndYRef.current = null
      touchStartXRef.current = e.targetTouches[0].clientX
      touchStartYRef.current = e.targetTouches[0].clientY
    }

    const handleTouchMove = (e) => {
      touchEndXRef.current = e.targetTouches[0].clientX
      touchEndYRef.current = e.targetTouches[0].clientY
    }

    const handleTouchEnd = () => {
      // Handle horizontal swipes
      if (
        (direction === "horizontal" || direction === "both") &&
        touchStartXRef.current !== null &&
        touchEndXRef.current !== null
      ) {
        const distanceX = touchStartXRef.current - touchEndXRef.current
        const isLeftSwipe = distanceX > minSwipeDistance
        const isRightSwipe = distanceX < -minSwipeDistance

        if (isLeftSwipe && onSwipeLeft) {
          onSwipeLeft()
        }

        if (isRightSwipe && onSwipeRight) {
          onSwipeRight()
        }
      }

      // Handle vertical swipes
      if (
        (direction === "vertical" || direction === "both") &&
        touchStartYRef.current !== null &&
        touchEndYRef.current !== null
      ) {
        const distanceY = touchStartYRef.current - touchEndYRef.current
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

    element.addEventListener("touchstart", handleTouchStart)
    element.addEventListener("touchmove", handleTouchMove)
    element.addEventListener("touchend", handleTouchEnd)

    return () => {
      element.removeEventListener("touchstart", handleTouchStart)
      element.removeEventListener("touchmove", handleTouchMove)
      element.removeEventListener("touchend", handleTouchEnd)
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
