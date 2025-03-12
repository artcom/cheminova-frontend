import { useEffect, useRef } from "react"

export default function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
} = {}) {
  const elementRef = useRef(null)
  const touchStartRef = useRef(null)
  const touchEndRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      touchEndRef.current = null
      touchStartRef.current = e.targetTouches[0].clientX
    }

    const handleTouchMove = (e) => {
      touchEndRef.current = e.targetTouches[0].clientX
    }

    const handleTouchEnd = () => {
      if (!touchStartRef.current || !touchEndRef.current) return

      const distance = touchStartRef.current - touchEndRef.current
      const isLeftSwipe = distance > minSwipeDistance
      const isRightSwipe = distance < -minSwipeDistance

      if (isLeftSwipe && onSwipeLeft) {
        onSwipeLeft()
      }

      if (isRightSwipe && onSwipeRight) {
        onSwipeRight()
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
  }, [onSwipeLeft, onSwipeRight, minSwipeDistance])

  return elementRef
}
