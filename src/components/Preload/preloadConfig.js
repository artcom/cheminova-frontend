import { CHARACTER_DATA } from "@components/CharacterShowcase/constants"

export const preloadConfig = {
  1: {
    images: CHARACTER_DATA.map((character) => character.image),
    lazyComponents: [
      {
        name: "CharacterShowcase",
        importFunction: () => import("@components/CharacterShowcase"),
      },
      {
        name: "TransitionWrapper",
        importFunction: () =>
          import("@components/CharacterShowcase/components/TransitionWrapper"),
      },
      {
        name: "IntroScreen",
        importFunction: () =>
          import("@components/CharacterShowcase/components/IntroScreen"),
      },
      {
        name: "CharacterCarousel",
        importFunction: () =>
          import("@components/CharacterShowcase/components/CharacterCarousel"),
      },
    ],
    preloadFunction: () => {
      console.log("🚀 Preloading character showcase content...")
    },
  },
  4: {
    images: [],
    lazyComponents: [
      {
        name: "PhotoCapture",
        importFunction: () => import("@components/PhotoCapture"),
      },
    ],
    preloadFunction: () => {
      console.log("🚀 Preloading photo capture content...")
    },
  },
}
