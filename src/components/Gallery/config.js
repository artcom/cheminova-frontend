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
export const DETAIL_CAMERA_Z = 2.1 // zoom-in target for detail view
export const CAMERA_LERP = 0.06 // smoothing factor per frame
// Active tile lift amount in detail mode (base, before camera ratio compensation)
export const DETAIL_ACTIVE_LIFT = 0.4

// Detail stacking behavior
export const STACK_LERP = 0.12 // how quickly tiles move to center
export const ENABLE_DECK_EFFECT = true // optional fan effect when stacked
export const DECK_OFFSET_AMPLITUDE = 0.12 // world units of max offset from center
export const DECK_ROTATION_MAX = 0.04 // radians, small tilt

// Stack switching animation (prev/next)
export const STACK_SWITCH_DUR = 0.5 // seconds
export const STACK_BUMP_AMPLITUDE = 0.12 // world units the stack moves up briefly
export const WRAP_EXTRA_DEPTH = -0.45 // temporary extra depth for wrapping card
export const WRAP_ROTATION = 0.12 // temporary extra rotation for wrapping card

// Scale compensation clamp to avoid popping when adjusting Z in detail mode
export const SCALE_COMP_MIN = 0.9
export const SCALE_COMP_MAX = 1.15

// Lerp constants used outside of animation utils
export const RESTORE_LERP = 0.2

// Debugging
export const DEBUG_GALLERY = true
export const DEBUG_THROTTLE_MS = 150

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
