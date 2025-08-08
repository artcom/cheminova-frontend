import { useEffect, useState } from "react"

export default function useResponsiveTilesPerRow() {
  const compute = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024
    if (w <= 480) return 3
    if (w <= 768) return 4
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
