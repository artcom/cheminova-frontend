// Unified Gallery and Animation configuration
import PersonalImage1 from "./assets/1.jpg"
import PersonalImage2 from "./assets/2.jpg"
import PersonalImage3 from "./assets/3.jpg"

export const PERSONAL_IMAGES = [PersonalImage1, PersonalImage2, PersonalImage3]

// Layout / tile constants
export const DISPLACEMENT_RATIO = 0.05
export const BASE_IMAGE_SCALE = 1.15
export const PERSONAL_SCALE_MULTIPLIER = 1.25

// Timing constants
export const ANIMATION_DURATION = 5.2
export const MAX_RANDOM_DELAY = 5.5

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
