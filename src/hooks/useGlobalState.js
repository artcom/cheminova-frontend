import { StateContext } from "../GlobalState"
import { useContext } from "react"

export default function useGlobalState() {
  const context = useContext(StateContext)
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a StateProvider")
  }
  return context
}
