import { useFrame } from "@react-three/fiber"
import { useEffect, useRef } from "react"

import {
  DEBUG_GALLERY,
  STACK_BUMP_AMPLITUDE,
  STACK_SWITCH_DUR,
} from "../config"

export default function StackBump({ switchInfo, children, onEnd }) {
  const groupRef = useRef()
  const endCalledForStartRef = useRef(0)
  const infoRef = useRef({ dir: 0, startMs: 0 })

  useEffect(() => {
    infoRef.current = switchInfo || { dir: 0, startMs: 0 }
  }, [switchInfo])

  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    const { dir, startMs } = infoRef.current
    if (!dir || !startMs) {
      g.position.y = g.position.y + (0 - g.position.y) * 0.3
      return
    }
    const now = performance.now()
    const elapsed = (now - startMs) / 1000
    const progress = Math.min(1, Math.max(0, elapsed / STACK_SWITCH_DUR))
    const bump = Math.sin(Math.PI * progress) * STACK_BUMP_AMPLITUDE
    g.position.y = g.position.y + (bump - g.position.y) * 0.3
    if (
      DEBUG_GALLERY &&
      (progress === 0 || progress === 1 || Math.abs(progress - 0.5) < 0.02)
    ) {
      console.debug(
        "[StackBump] progress",
        progress.toFixed(2),
        "bump",
        bump.toFixed(3),
      )
    }
    if (progress >= 1 && onEnd) {
      if (endCalledForStartRef.current !== startMs) {
        endCalledForStartRef.current = startMs
        onEnd()
      }
    }
  })
  return <group ref={groupRef}>{children}</group>
}
