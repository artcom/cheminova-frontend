import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useRef } from "react"

import {
  CAMERA_DEFAULT_Z,
  CAMERA_LERP,
  DEBUG_GALLERY,
  DETAIL_CAMERA_Z,
} from "../config"

export default function CameraController({ detailMode }) {
  const { camera } = useThree()
  const lastCamLogRef = useRef(0)

  useEffect(() => {
    if (!detailMode) {
      camera.position.set(
        camera.position.x,
        camera.position.y,
        CAMERA_DEFAULT_Z,
      )
    }
  }, [detailMode, camera])

  useFrame(() => {
    if (!detailMode) return
    const dz = DETAIL_CAMERA_Z - camera.position.z
    if (Math.abs(dz) < 0.001) return
    camera.position.set(
      camera.position.x,
      camera.position.y,
      camera.position.z + dz * CAMERA_LERP,
    )
    if (DEBUG_GALLERY) {
      const now = performance.now()
      if (now - lastCamLogRef.current > 500) {
        console.debug("[Camera] pos", {
          x: camera.position.x.toFixed(2),
          y: camera.position.y.toFixed(2),
          z: camera.position.z.toFixed(2),
        })
        lastCamLogRef.current = now
      }
    }
  })
  return null
}
