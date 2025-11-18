import { redirect } from "react-router"

export const clientLoader = async () => {
  throw redirect("introduction")
}

export default function CharacterIndex() {
  return null
}
