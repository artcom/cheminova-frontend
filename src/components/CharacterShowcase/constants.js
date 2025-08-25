import Alice from "./assets/amara.png"
import AmaraSelected from "./assets/amaraSelected.png"
import Bob from "./assets/mateo.png"
import MateoSelected from "./assets/MateoSelected.png"
import Charlie from "./assets/nova.png"
import NovaSelected from "./assets/novaSelected.png"

export const CHARACTER_DATA = [
  {
    id: 1,
    image: Alice,
    selectedImage: AmaraSelected,
    name: "Amara",
    title: "The Artist",
    description:
      "Join Amara and transform your visit into a living work of art.",
  },
  {
    id: 2,
    image: Bob,
    selectedImage: MateoSelected,
    name: "Diego",
    title: "The Legend",
    description:
      "Follow Diego through the legendary halls where football history was made.",
  },
  {
    id: 3,
    image: Charlie,
    selectedImage: NovaSelected,
    name: "Luna",
    title: "The Explorer",
    description:
      "Discover with Luna the hidden stories and secrets of Camp Nou.",
  },
]

export const DRAG_THRESHOLD = 100
