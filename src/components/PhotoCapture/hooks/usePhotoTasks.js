// Simplified usePhotoTasks hook with memory storage only
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export default function usePhotoTasks(options = {}) {
  const { tasks: providedTasks, onImageCaptured, initialImages = [] } = options
  const { t } = useTranslation()

  // Create tasks array with translations
  const tasks = useMemo(() => {
    if (providedTasks && providedTasks.length > 0) {
      return providedTasks
    }
    return [
      t("photoCapture.tasks.laNau"),
      t("photoCapture.tasks.surroundings"),
      t("photoCapture.tasks.special"),
    ]
  }, [providedTasks, t])

  // Simple memory-based state
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskImages, setTaskImages] = useState(() => {
    // Initialize from initial images if provided
    const initial = {}
    initialImages.forEach((image, index) => {
      if (image) initial[index] = image
    })
    return initial
  })

  const compressImageFile = useCallback(async (file) => {
    const MAX_DIMENSION = 1600
    const TARGET_MIME = "image/jpeg"
    const QUALITY = 0.75

    return new Promise((resolve, reject) => {
      try {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
          try {
            const { width, height } = img
            const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height))
            const targetW = Math.round(width * scale)
            const targetH = Math.round(height * scale)

            const canvas = document.createElement("canvas")
            canvas.width = targetW
            canvas.height = targetH

            const ctx = canvas.getContext("2d")
            ctx.drawImage(img, 0, 0, targetW, targetH)

            const dataUrl = canvas.toDataURL(TARGET_MIME, QUALITY)
            URL.revokeObjectURL(objectUrl)
            resolve(dataUrl)
          } catch (e) {
            URL.revokeObjectURL(objectUrl)
            reject(e)
          }
        }

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          // Fallback: just read the file as data URL without compression
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = reject
          reader.readAsDataURL(file)
        }

        img.src = objectUrl
      } catch (e) {
        reject(e)
      }
    })
  }, [])

  const addImageForCurrentTask = useCallback(
    (dataUrl) => {
      setTaskImages((prev) => ({
        ...prev,
        [currentTaskIndex]: dataUrl,
      }))

      // Notify parent component
      if (onImageCaptured) {
        onImageCaptured(dataUrl, currentTaskIndex)
      }
    },
    [currentTaskIndex, onImageCaptured],
  )

  const handleFileObject = useCallback(
    async (file) => {
      if (!file) return null

      try {
        const dataUrl = await compressImageFile(file)
        if (typeof dataUrl === "string") {
          addImageForCurrentTask(dataUrl)
        }
        return dataUrl
      } catch (err) {
        console.error("[usePhotoTasks] Failed to process image file", err)
        return null
      }
    },
    [addImageForCurrentTask, compressImageFile],
  )

  const retake = useCallback((taskIndex) => {
    setTaskImages((prev) => {
      const next = { ...prev }
      delete next[taskIndex]
      return next
    })
    setCurrentTaskIndex(taskIndex)
  }, [])

  // Get all images as an array for upload
  const getAllImages = useCallback(() => {
    return tasks.map((_, index) => taskImages[index] || null)
  }, [tasks, taskImages])

  // Check if all tasks are completed
  const isComplete = useMemo(() => {
    return tasks.every((_, index) => taskImages[index])
  }, [tasks, taskImages])

  return {
    tasks,
    taskImages,
    currentTaskIndex,
    setCurrentTaskIndex,
    addImageForCurrentTask,
    handleFileObject,
    retake,
    getAllImages,
    isComplete,
  }
}
