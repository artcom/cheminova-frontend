/**
 * Configuration for the Welcome page background layers
 *
 * Positioning and animation are handled by Framer Motion in useParallaxLayers.js
 *
 * Enhanced parallax with ENTRY + EXIT animations:
 *
 * ENTRY (on mount):
 * - Back layer (third): enters from LEFT and below, fades in (slowest, 1.2s)
 * - Middle layer (second): enters from RIGHT and below, fades in (medium, 1.0s)
 * - Front layer (front): enters from CENTER and below, fades in (fastest, 0.8s)
 *
 * EXIT (on step transition):
 * - Back layer (third): exits LEFT and up, fades out (slowest, 1.2s)
 * - Middle layer (second): exits RIGHT and up, fades out (medium, 1.0s)
 * - Front layer (front): exits straight UP, fades out (fastest, 0.8s)
 *
 * Creates dramatic multi-directional depth parallax on both entry and exit
 */
export const LAYERS_CONFIG = [
  {
    id: "third", // Back layer - slowest, moves left on entry/exit
    src: "/layer/layer_third.png",
  },
  {
    id: "second", // Middle layer - medium speed, moves right on entry/exit
    src: "/layer/layer_second.png",
  },
  {
    id: "front", // Front layer - fastest, moves straight up
    src: "/layer/layer_front.png",
  },
]
