import { useRef } from "react"

export const useSwipe = (
  onSwipeLeft,
  onSwipeRight,
  swipeThreshold = 50,
  timeThreshold = 100,
) => {
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchStartTime = useRef(0)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
    touchStartTime.current = Date.now()
  }

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current
    const touchDuration = Date.now() - touchStartTime.current

    // Check if the touch duration is too long to be a swipe
    if (touchDuration < timeThreshold) {
      return
    }

    if (swipeDistance > swipeThreshold) {
      onSwipeLeft && onSwipeLeft()
    } else if (swipeDistance < -swipeThreshold) {
      onSwipeRight && onSwipeRight()
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
