/**
 * Layer positioning and animation configuration
 * All transforms handled by Framer Motion to avoid CSS conflicts
 *
 * Enhanced parallax with ENTRY + EXIT animations:
 * - Back layer: enters from left and down, exits left and up (slowest)
 * - Middle layer: enters from right and down, exits right and up (medium speed)
 * - Front layer: enters from center and down, exits straight up (fastest)
 *
 * Layers animate IN on mount, then OUT on step transition
 */
const LAYER_CONFIG = {
  third: {
    // Back layer - enters from LEFT, exits LEFT (reduced horizontal movement)
    entryX: "-120%", // Reduced from -130% (half the distance from static)
    entryY: 100, // Start below viewport
    entryScale: 0.9, // Smaller on entry
    staticX: "-110%", // Rest position
    staticY: "-10%",
    exitX: "-120%", // Reduced from -130% (half the distance from static)
    exitY: -100, // Exit up
    exitScale: 1.1,
    duration: 1.2,
  },
  second: {
    // Middle layer - enters from RIGHT, exits RIGHT (reduced horizontal movement)
    entryX: "-40%", // Reduced from -30% (half the distance from static -50%)
    entryY: 150, // Start below viewport
    entryScale: 0.9,
    staticX: "-50%", // Rest position centered
    staticY: "5%",
    exitX: "-40%", // Reduced from -30% (half the distance from static)
    exitY: -150, // Exit up
    exitScale: 1.2,
    duration: 1.0,
  },
  front: {
    // Front layer - enters from CENTER, exits straight UP (no change)
    entryX: "-50%", // Start centered
    entryY: 200, // Start below viewport (furthest)
    entryScale: 0.8, // Smallest on entry
    staticX: "-50%", // Rest position centered
    staticY: "20%",
    exitX: "-50%", // Stay centered for dramatic forward motion
    exitY: -200, // Exit up fastest
    exitScale: 1.3, // Largest on exit
    duration: 0.8,
  },
}

/**
 * Get animation props for a layer during exit transition
 * @param {string} layerId - Layer identifier (third, second, front)
 * @param {boolean} isExiting - Whether exit animation should play
 * @returns {Object} Framer Motion animation props
 */
export function getLayerAnimation(layerId, isExiting) {
  const config = LAYER_CONFIG[layerId]

  if (!config) {
    return {
      initial: { x: "-50%", y: "0%", scale: 1, opacity: 0 },
      animate: { x: "-50%", y: "0%", scale: 1, opacity: 1 },
    }
  }

  if (!isExiting) {
    // Entry animation: layers come in from their entry positions
    return {
      initial: {
        x: config.entryX,
        y: config.entryY,
        scale: config.entryScale,
        opacity: 0, // Start invisible
      },
      animate: {
        x: config.staticX,
        y: config.staticY,
        scale: 1,
        opacity: 1, // Fade in to full visibility
      },
      transition: {
        duration: config.duration,
        ease: "easeOut",
      },
    }
  }

  // Exit animation: layers move out in different directions
  return {
    initial: {
      x: config.staticX,
      y: config.staticY,
      scale: 1,
      opacity: 1,
    },
    animate: {
      x: config.exitX,
      y: config.exitY,
      scale: config.exitScale,
      opacity: 0, // Fade out to 0
    },
    transition: {
      duration: config.duration,
      ease: "easeInOut",
    },
  }
}
