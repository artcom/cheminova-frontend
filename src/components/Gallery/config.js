// Unified Gallery and Animation configuration

// Layout / tile constants
export const DISPLACEMENT_RATIO = 0.05
export const BASE_IMAGE_SCALE = 1.15
export const PERSONAL_SCALE_MULTIPLIER = 1.25

// Timing constants
export const ANIMATION_DURATION = 5.2
export const MAX_RANDOM_DELAY = 5.5

// Camera / detail-view constants
export const CAMERA_DEFAULT_Z = 5
export const DETAIL_CAMERA_Z = 4.1 // zoom-in target for detail view
export const CAMERA_LERP = 0.08 // smoothing factor per frame

// Detail stacking behavior
export const STACK_LERP = 0.12 // how quickly tiles move to center
export const ENABLE_DECK_EFFECT = true // optional fan effect when stacked
export const DECK_OFFSET_AMPLITUDE = 0.25 // world units of max offset from center
export const DECK_ROTATION_MAX = 0.08 // radians, small tilt

// Per-tile animation config
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
