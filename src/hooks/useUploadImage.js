import { useCharactersFromAll } from "@/api/hooks"
import { uploadImage } from "@/api/uploadImage"
import useGlobalState from "@/hooks/useGlobalState"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  const { currentCharacterIndex } = useGlobalState()
  const { data: charactersData } = useCharactersFromAll()

  // Get current character slug
  const currentCharacter = charactersData?.[currentCharacterIndex]
  const characterSlug = currentCharacter?.slug

  return useMutation({
    mutationFn: ({ file, title }) => {
      if (!characterSlug) {
        throw new Error("No character selected for upload")
      }
      return uploadImage(file, characterSlug, title)
    },
    onSuccess: (data) => {
      console.log("✅ Image uploaded successfully:", data)
      // Invalidate character-specific image queries if they exist
      queryClient.invalidateQueries({ queryKey: ["images", characterSlug] })
      queryClient.invalidateQueries({ queryKey: ["gallery-images"] })
      queryClient.invalidateQueries({ queryKey: ["recent-images"] })
    },
    onError: (error) => {
      console.error("❌ Upload failed:", error.message)
    },
  })
}
