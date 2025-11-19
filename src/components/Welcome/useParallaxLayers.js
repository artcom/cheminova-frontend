const LAYER_CONFIG = {
  third: {
    entryX: "-120%",
    entryY: 100,
    entryScale: 0.9,
    staticX: "-110%",
    staticY: "-10%",
    exitX: "-120%",
    exitY: -100,
    exitScale: 1.1,
    duration: 1.2,
  },
  second: {
    entryX: "-40%",
    entryY: 150,
    entryScale: 0.9,
    staticX: "-50%",
    staticY: "5%",
    exitX: "-40%",
    exitY: -150,
    exitScale: 1.2,
    duration: 1.0,
  },
  front: {
    entryX: "-50%",
    entryY: 200,
    entryScale: 0.8,
    staticX: "-50%",
    staticY: "20%",
    exitX: "-50%",
    exitY: -200,
    exitScale: 1.3,
    duration: 0.8,
  },
}

export function getLayerAnimation(layerId, isExiting) {
  const config = LAYER_CONFIG[layerId]

  if (!config) {
    return {
      initial: { x: "-50%", y: "0%", scale: 1, opacity: 0 },
      animate: { x: "-50%", y: "0%", scale: 1, opacity: 1 },
    }
  }

  if (!isExiting) {
    return {
      initial: {
        x: config.entryX,
        y: config.entryY,
        scale: config.entryScale,
        opacity: 0,
      },
      animate: {
        x: config.staticX,
        y: config.staticY,
        scale: 1,
        opacity: 1,
      },
      transition: {
        duration: config.duration,
        ease: "easeOut",
      },
    }
  }

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
      opacity: 0,
    },
    transition: {
      duration: config.duration,
      ease: "easeInOut",
    },
  }
}
