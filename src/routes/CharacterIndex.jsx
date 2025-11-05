import { redirect } from "react-router"

export async function clientLoader() {
  throw redirect("introduction")
}

export default function CharacterIndex() {
  return null
}
