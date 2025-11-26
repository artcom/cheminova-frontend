import { getCurrentLocale } from "@/i18n"
import { useMemo } from "react"

import { useJanitorLogbookImages } from "./useJanitorLogbookImages"

export function useJanitorLogbookData() {
  const locale = getCurrentLocale()
  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useJanitorLogbookImages()

  const formattedData = useMemo(() => {
    return images.map((item) => {
      const dateObj = new Date(item.created_at)

      return {
        id: item.id,
        image: item.file, // Assuming 'file' is the URL or path
        title: item.title || "Untitled Entry",
        uploaded_text: item.uploaded_text,
        uploaded_user_name: item.uploaded_user_name,
        date: dateObj.toLocaleDateString(locale, {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        time: dateObj.toLocaleTimeString(locale, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        description: item.description || item.text || "", // Fallback to text if description missing
      }
    })
  }, [images, locale])

  return {
    data: formattedData,
    isLoading,
    isError,
    error,
  }
}
