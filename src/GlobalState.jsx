import { createContext, useState } from "react"

export const StateContext = createContext()

export default function StateProvider({ children }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  const value = {
    selectedCharacter,
    setSelectedCharacter,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
