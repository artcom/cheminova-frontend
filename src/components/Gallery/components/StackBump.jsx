import { useFrame } from "@react-three/fiber"
import { useRef } from "react"

import {
  DEBUG_GALLERY,
  STACK_BUMP_AMPLITUDE,
  STACK_SWITCH_DUR,
} from "../config"

export default function StackBump({
  switchDir,
  switchStartRef,
  children,
  onEnd,
}) {
  const groupRef = useRef()
  const endCalledForStartRef = useRef(0)
  // Drive timer and bump easing per frame
  useFrame(() => {
    const g = groupRef.current
    if (!g) return
    if (!switchDir || !switchStartRef.current) {
      // settle back
      g.position.y = g.position.y + (0 - g.position.y) * 0.3
      return
    }
    // Simple up-then-down bump: y = amp * sin(pi * progress)
    const now = performance.now()
    const elapsed = (now - switchStartRef.current) / 1000
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
      if (endCalledForStartRef.current !== switchStartRef.current) {
        endCalledForStartRef.current = switchStartRef.current
        onEnd()
      }
    }
  })
  return <group ref={groupRef}>{children}</group>
}
