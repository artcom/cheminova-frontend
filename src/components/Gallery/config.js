export const DISPLACEMENT_RATIO = 0.05
export const BASE_IMAGE_SCALE = 1.25
export const PERSONAL_SCALE_MULTIPLIER = 1.25

export const ANIMATION_DURATION = 5.2
export const MAX_RANDOM_DELAY = 5.5

export const CAMERA_DEFAULT_Z = 5
export const DETAIL_CAMERA_Z = 2.1
export const CAMERA_LERP = 0.06
export const DETAIL_ACTIVE_LIFT = 0.4

export const STACK_LERP = 0.12
export const ENABLE_DECK_EFFECT = true
export const DECK_OFFSET_AMPLITUDE = 0.12
export const DECK_ROTATION_MAX = 0.04

export const STACK_SWITCH_DUR = 0.5
export const STACK_BUMP_AMPLITUDE = 0.12
export const WRAP_EXTRA_DEPTH = -0.45
export const WRAP_ROTATION = 0.12

export const SCALE_COMP_MIN = 0.9
export const SCALE_COMP_MAX = 1.15

export const RESTORE_LERP = 0.2

export const STACK_ASSEMBLY_DUR = 0.35
export const STACK_FADE_LERP = 0.18

export const DEBUG_GALLERY = import.meta.env.DEV
export const DEBUG_THROTTLE_MS = 150

export const ANIMATION_CONFIG = {
  normal: {
    startScale: 0.3,
    startOpacity: 0,
    endOpacity: 1,
    startZ: -2,
    duration: 5.2,
  },
  personal: {
    startScale: 3,
    startOpacity: 0,
    endOpacity: 1,
    startZ: 2,
    duration: 3.5,
    delayMax: 2,
  },
  grayscale: {
    duration: 2.0,
    start: 0.7,
    end: 0,
  },
}

export default ANIMATION_CONFIG
