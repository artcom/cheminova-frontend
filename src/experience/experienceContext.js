import { createContext, useContext } from "react"

/**
 * The resolved flow state for the page being rendered: its CMS node, the character it belongs
 * to, the short character code, and where it can go next. Screens receive the same values as
 * props; nested components read them from here instead of the route loader.
 */
export const ExperienceContext = createContext(null)

export function useExperience() {
  const value = useContext(ExperienceContext)

  if (!value) {
    throw new Error("useExperience must be used inside an experience page")
  }

  return value
}
