import { uploadImage } from "@/api/uploadImage"
import { useExperience } from "@/experience/experienceContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  const lastUploadedCharacterSlugRef = useRef(null)
  const { characterCode: characterSlug } = useExperience()

  return useMutation({
    mutationFn: async ({ file, text, userName, title }) => {
      lastUploadedCharacterSlugRef.current = characterSlug
      return uploadImage(file, characterSlug, { text, userName, title })
    },
    onSuccess: () => {
      const slug = lastUploadedCharacterSlugRef.current
      queryClient.invalidateQueries({ queryKey: ["images", slug] })
      if (slug === "future") {
        queryClient.invalidateQueries({
          queryKey: ["future-timeline", "images"],
        })
      }
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
  })
}
