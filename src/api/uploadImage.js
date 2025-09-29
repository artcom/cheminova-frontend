const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/cms/api"

export const uploadImage = async (imageFile, title = null) => {
  const formData = new FormData()
  formData.append("image", imageFile)

  if (title) {
    formData.append("title", title)
  }

  const response = await fetch(`${API_BASE_URL}/api/upload/`, {
    method: "POST",
    body: formData, // Don't set Content-Type header - let browser set it for FormData
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.status}`)
  }

  return response.json()
}
