import { useMutation, useQueryClient } from "@tanstack/react-query"
import { uploadPost } from "@api/uploadData"

export default function useUploadPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: uploadPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
    onError: (error) => {
      console.error("Upload mutation error:", error)
    },
  })
}
