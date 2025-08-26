import { uploadPost } from "@api/uploadData"
import { useMutation, useQueryClient } from "@tanstack/react-query"

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
