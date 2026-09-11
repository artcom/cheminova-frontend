import { ExperienceContext } from "./experienceContext"

export default function ExperienceProvider({ value, children }) {
  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}
