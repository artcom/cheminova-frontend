import { useEffect, useState } from "react"

export default function useResponsiveTilesPerRow() {
  // On all screens up to 1200px (including mobile), use 5 columns; otherwise 6.
  const compute = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024
    if (w <= 1200) return 5
    return 6
  }

  const [tiles, setTiles] = useState(compute())

  useEffect(() => {
    const onResize = () => setTiles(compute())
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return tiles
}
