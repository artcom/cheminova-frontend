export const computeGridMetrics = ({
  viewportWidth,
  viewportHeight,
  tilesPerRow,
}) => {
  const idealTileWidth = viewportWidth / tilesPerRow
  const tilesPerColumn = Math.floor(viewportHeight / idealTileWidth)
  const gridWidth = tilesPerRow * idealTileWidth
  const gridHeight = tilesPerColumn * idealTileWidth
  const zeroX = -gridWidth / 2 + idealTileWidth / 2
  const zeroY = gridHeight / 2 - idealTileWidth / 2

  return {
    idealTileWidth,
    tilesPerColumn,
    gridWidth,
    gridHeight,
    zeroX,
    zeroY,
  }
}

const chebyshev = (r1, c1, r2, c2) =>
  Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2))

const mulberry32 = (seed) => {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

const seededShuffle = (arr, seed) => {
  const rand = mulberry32(seed)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export const selectCentralIndices = ({
  totalTiles,
  tilesPerRow,
  tilesPerColumn,
  count,
  seed = 12345,
}) => {
  const primaryMinRow = Math.max(1, Math.floor(tilesPerColumn * 0.25))
  const primaryMaxRow = Math.min(
    tilesPerColumn - 2,
    Math.floor(tilesPerColumn * 0.75),
  )
  const primaryMinCol = Math.max(1, Math.floor(tilesPerRow * 0.25))
  const primaryMaxCol = Math.min(
    tilesPerRow - 2,
    Math.floor(tilesPerRow * 0.75),
  )

  const collect = (minRow, maxRow, minCol, maxCol) => {
    const acc = []
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const index = row * tilesPerRow + col
        if (index < totalTiles) acc.push(index)
      }
    }
    return acc
  }

  const primary = collect(
    primaryMinRow,
    primaryMaxRow,
    primaryMinCol,
    primaryMaxCol,
  )

  let pool = [...primary]
  if (pool.length < count) {
    const fbMinRow = Math.max(0, Math.floor(tilesPerColumn * 0.2))
    const fbMaxRow = Math.min(
      tilesPerColumn - 1,
      Math.floor(tilesPerColumn * 0.8),
    )
    const fbMinCol = Math.max(0, Math.floor(tilesPerRow * 0.2))
    const fbMaxCol = Math.min(tilesPerRow - 1, Math.floor(tilesPerRow * 0.8))
    const fallback = collect(fbMinRow, fbMaxRow, fbMinCol, fbMaxCol)
    pool = [...new Set([...primary, ...fallback])]
  }

  const shuffled = seededShuffle(pool, seed)
  const selected = []
  const noTouchDistance = 2

  const respectsNoTouch = (candidate) => {
    const r = Math.floor(candidate / tilesPerRow)
    const c = candidate % tilesPerRow
    return selected.every((sel) => {
      const sr = Math.floor(sel / tilesPerRow)
      const sc = sel % tilesPerRow
      return chebyshev(r, c, sr, sc) >= noTouchDistance
    })
  }

  for (const candidate of shuffled) {
    if (selected.length >= count) break
    if (selected.length === 0 || respectsNoTouch(candidate)) {
      selected.push(candidate)
    }
  }

  if (selected.length >= count) return selected

  const remaining = count - selected.length
  const remainingPool = shuffled.filter((i) => !selected.includes(i))

  for (let i = 0; i < remaining && remainingPool.length; i++) {
    let bestIdx = 0
    let bestScore = -Infinity
    for (let j = 0; j < remainingPool.length; j++) {
      const cand = remainingPool[j]
      const r = Math.floor(cand / tilesPerRow)
      const c = cand % tilesPerRow
      const score = selected.reduce((acc, sel) => {
        const sr = Math.floor(sel / tilesPerRow)
        const sc = sel % tilesPerRow
        return acc + chebyshev(r, c, sr, sc)
      }, 0)
      if (score > bestScore) {
        bestScore = score
        bestIdx = j
      }
    }
    selected.push(remainingPool[bestIdx])
    remainingPool.splice(bestIdx, 1)
  }

  return selected
}

export const buildDelays = (count, maxDelay, seed = 98765) => {
  const rand = mulberry32(seed)
  return Array.from({ length: count }, () => rand() * maxDelay)
}

export const buildTileData = ({
  images,
  tilesPerRow,
  idealTileWidth,
  zeroX,
  zeroY,
  displacementRatio,
  delays,
  maxDelay,
  personalImages,
  baseImageScale,
  personalScaleMultiplier,
  seed = 424242,
}) => {
  const rand = mulberry32(seed)
  return images.map((image, index) => {
    const row = Math.floor(index / tilesPerRow)
    const column = index % tilesPerRow
    const x = zeroX + column * idealTileWidth
    const y = zeroY - row * idealTileWidth

    const displacementRange = idealTileWidth * displacementRatio
    const jx = (rand() - 0.5) * 2
    const jy = (rand() - 0.5) * 2
    const randomX = jx * displacementRange
    const randomY = jy * displacementRange

    const personalIdx = personalImages.indices.indexOf(index)
    const isPersonal = personalIdx !== -1

    const normalizedDelay = delays[index] / maxDelay
    const zOffset = isPersonal ? normalizedDelay * 0.2 : normalizedDelay * -0.2

    const position = [x + randomX, y + randomY, zOffset]

    return {
      key: isPersonal
        ? `personal-${personalIdx}-${index}`
        : `${image}-${index}`,
      position,
      image: isPersonal ? personalImages.urls[personalIdx] : image,
      isPersonal,
      delay: delays[index],
      scale: isPersonal
        ? idealTileWidth * personalScaleMultiplier
        : idealTileWidth * baseImageScale,
    }
  })
}
