import CharacterShowcase from "@components/CharacterShowcase"
import Exploration from "@components/Exploration"
import Gallery from "@components/Gallery"
import Introduction from "@components/Introduction"
import Perspective from "@components/Perspective"
import PhotoCapture from "@components/PhotoCapture"
import Upload from "@components/Upload"

import LaNau from "@ui/assets/LaNau.webp"

export const createScreens = (_selectedCharacter, goNext) => {
  return [
    {
      id: "welcome",
      layout: {
        type: "overlay",
        backgroundImage: LaNau,
        headline: "La Nau",
        subheadline: "Experiencing",
        showFullscreenButton: true,
      },
      navigation: {
        mode: "single",
        variant: "arrowDown",
        onNext: goNext,
      },
    },

    {
      id: "character-selection",
      component: CharacterShowcase,
      layout: {
        type: "overlay",
        backgroundImage: LaNau,
        headline: "La Nau",
        description: {
          title: "Choose your guide",
          text: "Select your guide for this immersive journey through La Nau.",
        },
      },
      navigation: {
        mode: "single",
      },
    },
    {
      id: "introduction",
      component: Introduction,
      layout: {
        type: "full",
      },
      navigation: {
        mode: "single",
      },
    },

    {
      id: "photo-capture",
      component: PhotoCapture,
      layout: {
        type: "overlay",
      },
      navigation: {
        mode: "single",
        position: "bottom",
      },
    },
    {
      id: "exploration",
      component: Exploration,
      layout: {
        type: "full",
      },
      navigation: {
        mode: "single",
      },
    },

    {
      id: "perspective",
      component: Perspective,
      layout: {
        type: "overlay",
        headline: "Your perspective",
        description: {
          title: "Your perspective",
          text: "You’ve seen the monument through new eyes. Now, add your vision to a living collage, together with others who care, just like you.",
        },
      },
      navigation: {
        mode: "single",
      },
    },

    {
      id: "upload",
      component: Upload,
      layout: {
        type: "full",
      },
      navigation: {
        mode: "single",
      },
    },

    {
      id: "gallery",
      component: Gallery,
      layout: {
        type: "full",
      },
      navigation: {
        mode: "single",
      },
    },
  ]
}

export default createScreens
