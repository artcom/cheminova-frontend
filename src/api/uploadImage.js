import { API_BASE_URL } from "@/config/api"

export const uploadImage = async (
  imageFile,
  characterSlug,
  { text, userName } = {},
) => {
  if (!imageFile) {
    throw new Error("Image file is required for upload")
  }

  if (!characterSlug) {
    throw new Error("Character slug is required for upload")
  }

  const formData = new FormData()
  formData.append("image", imageFile)

  if (typeof text === "string" && text.trim()) {
    formData.append("text", text.trim())
  }

  if (typeof userName === "string" && userName.trim()) {
    formData.append("userName", userName.trim())
  }

  // Use character-specific endpoint
  const uploadUrl = `${API_BASE_URL}/images/${characterSlug}/`
  console.log("🚀 Uploading to:", uploadUrl)

  const response = await fetch(uploadUrl, {
    method: "POST",
    body: formData, // Don't set Content-Type header - let browser set it for FormData
  })

  if (!response.ok) {
    let errorDetail = `Upload failed: ${response.status}`

    try {
      const errorBody = await response.json()
      if (errorBody?.error) {
        errorDetail = Array.isArray(errorBody.error)
          ? errorBody.error.join(", ")
          : errorBody.error
      }
    } catch {
      // Ignore JSON parsing errors and fallback to status-based message
    }

    if (response.status === 404) {
      throw new Error(`Character '${characterSlug}' not found`)
    }
    throw new Error(errorDetail)
  }

  return response.json()
}
