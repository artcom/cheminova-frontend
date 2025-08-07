import AnimatingTile from "./AnimatingTile"
import PersonalImage1 from "../assets/1.jpg"
import PersonalImage2 from "../assets/2.jpg"
import PersonalImage3 from "../assets/3.jpg"
import { useThree } from "@react-three/fiber"

const personalImages = [PersonalImage1, PersonalImage2, PersonalImage3]
const ANIMATION_DURATION = 5.2

export default function GalleryContent({ imagePool, targetTilesPerRow = 5 }) {
  const { viewport } = useThree()

  if (!viewport || viewport.width === 0 || viewport.height === 0) {
    return null
  }

  const tilesPerRow = targetTilesPerRow
  const idealTileWidth = viewport.width / tilesPerRow
  const tilesPerColumn = Math.floor(viewport.height / idealTileWidth)
  const totalTiles = Math.min(tilesPerRow * tilesPerColumn, imagePool.length)
  const images = imagePool.slice(0, totalTiles)
  const imageScale = idealTileWidth * 1.15

  const gridWidth = tilesPerRow * idealTileWidth
  const gridHeight = tilesPerColumn * idealTileWidth

  const zeroX = -gridWidth / 2 + idealTileWidth / 2
  const zeroY = gridHeight / 2 - idealTileWidth / 2

  // Algorithm to place personal images in the central area
  const getCentralIndices = (
    totalTiles,
    tilesPerRow,
    tilesPerColumn,
    personalImageCount,
  ) => {
    // Define the central area boundaries (avoid outer rows and columns)
    const minRow = Math.max(1, Math.floor(tilesPerColumn * 0.25))
    const maxRow = Math.min(
      tilesPerColumn - 2,
      Math.floor(tilesPerColumn * 0.75),
    )
    const minCol = Math.max(1, Math.floor(tilesPerRow * 0.25))
    const maxCol = Math.min(tilesPerRow - 2, Math.floor(tilesPerRow * 0.75))

    // Collect all valid central positions
    const centralPositions = []
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const index = row * tilesPerRow + col
        if (index < totalTiles) {
          centralPositions.push(index)
        }
      }
    }

    // Ensure we have enough central positions
    if (centralPositions.length < personalImageCount) {
      console.warn(
        `Not enough central positions (${centralPositions.length}) for personal images (${personalImageCount})`,
      )
      // Fall back to slightly expanded area if needed
      const fallbackMinRow = Math.max(0, Math.floor(tilesPerColumn * 0.2))
      const fallbackMaxRow = Math.min(
        tilesPerColumn - 1,
        Math.floor(tilesPerColumn * 0.8),
      )
      const fallbackMinCol = Math.max(0, Math.floor(tilesPerRow * 0.2))
      const fallbackMaxCol = Math.min(
        tilesPerRow - 1,
        Math.floor(tilesPerRow * 0.8),
      )

      centralPositions.length = 0 // Clear array
      for (let row = fallbackMinRow; row <= fallbackMaxRow; row++) {
        for (let col = fallbackMinCol; col <= fallbackMaxCol; col++) {
          const index = row * tilesPerRow + col
          if (index < totalTiles) {
            centralPositions.push(index)
          }
        }
      }
    }

    // Shuffle central positions and select the needed amount
    const shuffled = [...centralPositions].sort(() => Math.random() - 0.5)

    // Ensure personal images are well-distributed by selecting positions with some spacing
    const selectedIndices = []
    const minDistance = Math.max(
      1,
      Math.floor(Math.min(tilesPerRow, tilesPerColumn) / 4),
    )

    for (const candidate of shuffled) {
      if (selectedIndices.length >= personalImageCount) break

      const candidateRow = Math.floor(candidate / tilesPerRow)
      const candidateCol = candidate % tilesPerRow

      // Check if this position is far enough from already selected positions
      const isFarEnough = selectedIndices.every((selectedIndex) => {
        const selectedRow = Math.floor(selectedIndex / tilesPerRow)
        const selectedCol = selectedIndex % tilesPerRow
        const distance = Math.sqrt(
          Math.pow(candidateRow - selectedRow, 2) +
            Math.pow(candidateCol - selectedCol, 2),
        )
        return distance >= minDistance
      })

      if (isFarEnough || selectedIndices.length === 0) {
        selectedIndices.push(candidate)
      }
    }

    // If we still don't have enough (due to distance constraints), fill remaining slots
    if (selectedIndices.length < personalImageCount) {
      for (const candidate of shuffled) {
        if (selectedIndices.length >= personalImageCount) break
        if (!selectedIndices.includes(candidate)) {
          selectedIndices.push(candidate)
        }
      }
    }

    return selectedIndices
  }

  const randomIndices = getCentralIndices(
    images.length,
    tilesPerRow,
    tilesPerColumn,
    personalImages.length,
  )

  const delays = images.map(() => Math.random() * 5.5)
  const maxDelay = Math.max(...delays)
  const personalAnimationStartTime = maxDelay + ANIMATION_DURATION

  const tileData = images.map((image, index) => {
    const row = Math.floor(index / tilesPerRow)
    const column = index % tilesPerRow
    const x = zeroX + column * idealTileWidth
    const y = zeroY - row * idealTileWidth

    // Add random displacement of 5%
    const displacementRange = idealTileWidth * 0.05
    const randomX = (Math.random() - 0.5) * 2 * displacementRange
    const randomY = (Math.random() - 0.5) * 2 * displacementRange

    const personalIdx = randomIndices.indexOf(index)
    const isPersonalImage = personalIdx !== -1

    // Calculate Z value based on delay and image type
    const normalizedDelay = delays[index] / maxDelay // 0 to 1
    const zOffset = isPersonalImage
      ? normalizedDelay * 0.2 // Personal images: positive Z (on top)
      : normalizedDelay * -0.2 // Normal images: negative Z (behind)

    const position = [x + randomX, y + randomY, zOffset]

    return {
      key:
        personalIdx !== -1
          ? `personal-${personalIdx}-${index}`
          : `${image}-${index}`,
      position,
      image: personalIdx !== -1 ? personalImages[personalIdx] : image,
      isPersonal: personalIdx !== -1,
      delay: delays[index],
      // Different scales for personal vs normal images
      scale: isPersonalImage ? idealTileWidth * 1.25 : imageScale,
    }
  })

  return (
    <group>
      {tileData.map((tile) => (
        <AnimatingTile
          key={tile.key}
          position={tile.position}
          url={tile.image}
          delay={tile.delay}
          isPersonal={tile.isPersonal}
          personalAnimationStartTime={personalAnimationStartTime}
          targetScale={tile.scale}
        />
      ))}
    </group>
  )
}
