import WelcomeLayout from "@/components/Welcome/WelcomeLayout"
import { lazy } from "react"

/**
 * Maps the CMS page type (`type` in the API payload) to the screen that renders it.
 *
 * The component names predate the CMS names and deliberately differ, so this table is the
 * single place the two vocabularies meet. A new page type needs one entry here and nothing
 * else. `passthrough` marks a node the CMS carries but the design never renders on its own.
 */
export const PAGE_REGISTRY = {
  "welcome-language": {
    component: lazy(() => import("@/components/Welcome/Steps/WelcomeLanguage")),
    layout: WelcomeLayout,
  },
  "welcome-intro": {
    component: lazy(() => import("@/components/Welcome/Steps/WelcomeIntro")),
    layout: WelcomeLayout,
  },
  welcome: { passthrough: true },
  "welcome-character": {
    component: lazy(
      () => import("@/components/Welcome/Steps/CharacterOnboarding"),
    ),
    layout: WelcomeLayout,
  },
  "choose-character": {
    component: lazy(
      () => import("@/components/Welcome/Steps/CharacterSelection"),
    ),
    layout: WelcomeLayout,
  },
  introduction: {
    component: lazy(() => import("@/components/Introduction/Introduction")),
  },
  photo: {
    component: lazy(() => import("@/components/PhotoCapture/PhotoCapture")),
  },
  insight: {
    component: lazy(() => import("@/components/Exploration/Exploration")),
  },
  "choose-option": {
    component: lazy(() => import("@/components/ChooseOption/ChooseOption")),
  },
  "experience-intro": {
    component: lazy(() => import("@/components/Perspective/Perspective")),
  },
  "experience-gallery": {
    component: lazy(() => import("@/components/Upload/Upload")),
  },
  "experience-create": {
    component: lazy(() => import("@/components/Logbook/LogbookCreate")),
  },
  collage: {
    component: lazy(() => import("@/components/Gallery/Gallery")),
  },
  "logbook-record": {
    component: lazy(() => import("@/components/JanitorLogbook/JanitorLogbook")),
  },
  timeline: {
    component: lazy(() => import("@/components/FutureTimeline/FutureTimeline")),
  },
  reflection: {
    component: lazy(() => import("@/components/Ending/Ending")),
  },
}

export function componentForType(type) {
  const entry = PAGE_REGISTRY[type]
  if (!entry) {
    console.warn(`No screen registered for CMS page type "${type}"`)
    return null
  }
  return entry.component ?? null
}

export function layoutForType(type) {
  return PAGE_REGISTRY[type]?.layout ?? null
}
