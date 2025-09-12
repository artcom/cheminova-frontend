// Moved from src/hooks/useResponsiveTilesPerRow.js
import { useEffect, useState } from "react"

export default function useResponsiveTilesPerRow() {
  const compute = () => {
    const w = window.innerWidth
    return w <= 1200 ? 5 : 6
  }

  const [tiles, setTiles] = useState(compute())

  useEffect(() => {
    const onResize = () => setTiles(compute())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return tiles
}
