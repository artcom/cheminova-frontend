import { useRef } from "react"

export const useSwipe = (onSwipeLeft, onSwipeRight, swipeThreshold = 50) => {
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchStartX.current - touchEndX.current

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
