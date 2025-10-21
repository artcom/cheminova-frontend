import { API_BASE_URL } from "@/config/api"

export const uploadImage = async (imageFile, characterSlug, title = null) => {
  // Validate character slug is provided
  if (!characterSlug) {
    throw new Error("Character slug is required for upload")
  }

  const formData = new FormData()
  formData.append("image", imageFile)

  if (title) {
    formData.append("title", title)
  }

  // Use character-specific endpoint
  const uploadUrl = `${API_BASE_URL}/images/${characterSlug}/`
  console.log("🚀 Uploading to:", uploadUrl)

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData, // Don't set Content-Type header - let browser set it for FormData
  })

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Character '${characterSlug}' not found`)
    }
    throw new Error(`Upload failed: ${response.status}`)
  }

  return response.json()
}
