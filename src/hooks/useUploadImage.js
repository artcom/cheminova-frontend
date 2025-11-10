import { uploadImage } from "@/api/uploadImage"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { useParams } from "react-router-dom"

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  const lastUploadedCharacterSlugRef = useRef(null)
  const { characterId: characterSlug } = useParams()

  return useMutation({
    mutationFn: async ({ file, text, userName }) => {
      lastUploadedCharacterSlugRef.current = characterSlug
      return uploadImage(file, characterSlug, { text, userName })
    },
    onSuccess: () => {
      const slug = lastUploadedCharacterSlugRef.current
      queryClient.invalidateQueries({ queryKey: ["images", slug] })
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
  })
}
