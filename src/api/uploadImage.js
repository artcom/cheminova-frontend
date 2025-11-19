import { API_BASE_URL } from "@/api/config"

export const uploadImage = async (
  imageFile,
  characterSlug,
  { text, userName, title } = {},
) => {
  const formData = new FormData()
  formData.append("image", imageFile)

  if (title?.trim()) {
    formData.append("title", title.trim())
  }

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
