import { StateContext } from "@/GlobalState"
import { useContext } from "react"

export default function useGlobalState() {
  return useContext(StateContext)
}
