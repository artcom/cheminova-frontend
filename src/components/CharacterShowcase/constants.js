import Alice from "./assets/1.png"
import Bob from "./assets/2.png"
import Charlie from "./assets/3.png"

export const CHARACTER_DATA = [
  {
    id: 1,
    image: Alice,
    name: "Amara",
    description:
      "Join Amara and transform your visit into a living work of art.",
  },
  {
    id: 2,
    image: Bob,
    name: "Diego",
    description:
      "Follow Diego through the legendary halls where football history was made.",
  },
  {
    id: 3,
    image: Charlie,
    name: "Luna",
    description:
      "Discover with Luna the hidden stories and secrets of Camp Nou.",
  },
]

export const CHARACTER_THEMES = [
  ["#4158D0", "#C850C0"], // Alice - Purple theme
  ["#0093E9", "#80D0C7"], // Bob - Blue theme
  ["#FF9A8B", "#FF6A88"], // Charlie - Pink theme
]

export const INTRO_GRADIENT = ["#3a6186", "#89253e"]
export const DRAG_THRESHOLD = 100
