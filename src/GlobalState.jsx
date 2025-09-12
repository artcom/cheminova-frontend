import { CHARACTER_DATA } from "@components/Welcome/CharacterShowcase/constants"
import { createContext, useState } from "react"

export const StateContext = createContext()

export default function StateProvider({ children }) {
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0)
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0)
  const [navigationHistory, setNavigationHistory] = useState([0])
  const [showModal, setShowModal] = useState(null)
  const [screens, setScreens] = useState([])

  function setLayout(partialLayout, index = currentScreenIndex) {
    setScreens((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, layout: { ...s.layout, ...partialLayout } } : s,
      ),
    )
  }

  function setNavigation(partialNavigation, index = currentScreenIndex) {
    setScreens((prev) =>
      prev.map((s, i) =>
        i === index
          ? { ...s, navigation: { ...s.navigation, ...partialNavigation } }
          : s,
      ),
    )
  }

  function navigateToScreen(screenIndex) {
    setCurrentScreenIndex(screenIndex)
    setNavigationHistory((prev) => [...prev, screenIndex])
  }

  function navigateToScreenById(screenId) {
    const screenIndex = screens.findIndex((screen) => screen.id === screenId)
    if (screenIndex !== -1) {
      navigateToScreen(screenIndex)
    }
  }

  function goNext() {
    const nextIndex = (currentScreenIndex + 1) % screens.length
    navigateToScreen(nextIndex)
  }

  function goPrev() {
    const prevIndex = (currentScreenIndex - 1 + screens.length) % screens.length
    navigateToScreen(prevIndex)
  }

  function goBack() {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory]
      newHistory.pop()
      const previousIndex = newHistory[newHistory.length - 1]
      setCurrentScreenIndex(previousIndex)
      setNavigationHistory(newHistory)
    }
  }

  function goStart() {
    navigateToScreen(0)
  }

  function handleCharacterPrev() {
    const total = CHARACTER_DATA.length
    const newIndex = (currentCharacterIndex - 1 + total) % total
    setCurrentCharacterIndex(newIndex)
  }

  function handleCharacterNext() {
    const total = CHARACTER_DATA.length
    const newIndex = (currentCharacterIndex + 1) % total
    setCurrentCharacterIndex(newIndex)
  }

  function handleCharacterSelect() {
    goNext()
  }

  const currentScreen = screens[currentScreenIndex] || null
  const canGoNext = currentScreenIndex < screens.length - 1
  const canGoPrev = currentScreenIndex > 0

  const value = {
    currentCharacterIndex,
    setCurrentCharacterIndex,
    handleCharacterPrev,
    handleCharacterNext,
    handleCharacterSelect,
    currentScreenIndex,
    currentScreen,
    navigationHistory,
    showModal,
    setShowModal,
    screens,
    setScreens,
    // Imperative screen layout APIs
    setLayout,
    setNavigation,
    navigateToScreen,
    navigateToScreenById,
    goNext,
    goPrev,
    goBack,
    goStart,
    canGoNext,
    canGoPrev,
  }

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>
}
