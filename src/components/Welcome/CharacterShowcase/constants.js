import Amara from "./assets/amara.png"
import AmaraSelected from "./assets/amaraSelected.png"
import Mateo from "./assets/mateo.png"
import MateoSelected from "./assets/mateoSelected.png"
import Nova from "./assets/nova.png"
import NovaSelected from "./assets/novaSelected.png"

export const CHARACTER_DATA = [
  {
    id: 1,
    image: Amara,
    selectedImage: AmaraSelected,
    name: "Amara",
    title: "The Artist",
    description:
      "Join Amara and transform your visit into a living work of art.",
  },
  {
    id: 2,
    image: Mateo,
    selectedImage: MateoSelected,
    name: "Mateo",
    title: "The Janitor",
    description:
      "Follow Mateo through the legendary halls where football history was made.",
  },
  {
    id: 3,
    image: Nova,
    selectedImage: NovaSelected,
    name: "Nova",
    title: "The Visitor from the Future.",
    description:
      "Discover with Nova the hidden stories and secrets of Camp Nou.",
  },
]

export const DRAG_THRESHOLD = 100
