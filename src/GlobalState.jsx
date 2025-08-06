import { createContext, useState } from "react"

export const StateContext = createContext()

export default function StateProvider({ children }) {
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(1)

  const value = {
    selectedCharacter,
    setSelectedCharacter,
    currentCharacterIndex,
    setCurrentCharacterIndex,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
