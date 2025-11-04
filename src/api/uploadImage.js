import { API_BASE_URL } from "@/config/api"

export const uploadImage = async (
  imageFile,
  characterSlug,
  { text, userName } = {},
) => {
  const formData = new FormData()
  formData.append("image", imageFile)

  if (text?.trim()) {
    formData.append("text", text.trim())
  }

  if (userName?.trim()) {
    formData.append("userName", userName.trim())
  }

  const response = await fetch(`${API_BASE_URL}/images/${characterSlug}/`, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`)
  }

  return response.json()
}
