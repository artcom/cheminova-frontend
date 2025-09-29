import { uploadImage } from "@/api/uploadImage"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUploadImage = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, title }) => uploadImage(file, title),
    onSuccess: (data) => {
      console.log("✅ Image uploaded successfully:", data)
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
    onError: (error) => {
      console.error("❌ Image upload failed:", error)
    },
  })
}
