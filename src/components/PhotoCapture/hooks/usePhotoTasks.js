// Moved from src/hooks/usePhotoTasks.js
import { useCallback, useEffect, useMemo, useState } from "react"

const DEFAULT_PHOTO_TASKS = ["La Nau", "Your surroundings", "Something special"]

export default function usePhotoTasks(options = {}) {
  const { tasks: providedTasks, storageKey = "personalImages" } = options

  const tasks = useMemo(
    () => providedTasks || DEFAULT_PHOTO_TASKS,
    [providedTasks],
  )

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [taskImages, setTaskImages] = useState({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return
      const stored = JSON.parse(raw)
      if (Array.isArray(stored) && stored.length) {
        const mapped = stored.reduce((acc, url, idx) => {
          if (url) acc[idx] = url
          return acc
        }, {})
        setTaskImages(mapped)
        const firstMissing = tasks.findIndex((_, i) => !mapped[i])
        setCurrentTaskIndex(
          firstMissing === -1 ? tasks.length - 1 : firstMissing,
        )
      }
    } catch {
      // Swallow parse errors; treat as no data
    }
  }, [tasks, storageKey])

  const persistTaskImages = useCallback(
    (nextObj) => {
      const arr = tasks.map((_, i) => nextObj[i] || null)
      try {
        localStorage.setItem(storageKey, JSON.stringify(arr))
      } catch (err) {
        // If we hit a quota error, surface a warning so we can diagnose instead of silently losing images
        console.warn(
          "[usePhotoTasks] Failed to persist images to localStorage (likely quota exceeded). Images will be session-only.",
          err,
        )
      }
    },
    [tasks, storageKey],
  )

  // Compress large images before converting to Data URL (helps avoid localStorage quota issues with camera captures)
  const compressImageFile = useCallback(async (file) => {
    // Heuristic maximum dimension; can be adjusted or made configurable
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
          // Fallback: if image tag fails (rare), attempt FileReader direct base64
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result)
          reader.onerror = (err) => reject(err)
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
      setTaskImages((prev) => {
        const next = { ...prev, [currentTaskIndex]: dataUrl }
        persistTaskImages(next)
        return next
      })
      setCurrentTaskIndex((idx) => (idx < tasks.length - 1 ? idx + 1 : idx))
    },
    [currentTaskIndex, tasks.length, persistTaskImages],
  )

  const handleFileObject = useCallback(
    async (file) => {
      if (!file) return null
      try {
        const dataUrl = await compressImageFile(file)
        if (typeof dataUrl === "string") addImageForCurrentTask(dataUrl)
        return dataUrl
      } catch (err) {
        console.error("[usePhotoTasks] Failed to process image file", err)
        return null
      }
    },
    [addImageForCurrentTask, compressImageFile],
  )

  const retake = useCallback(
    (taskIndex) => {
      setTaskImages((prev) => {
        const next = { ...prev }
        delete next[taskIndex]
        persistTaskImages(next)
        return next
      })
      setCurrentTaskIndex(taskIndex)
    },
    [persistTaskImages],
  )

  return {
    tasks,
    taskImages,
    currentTaskIndex,
    setCurrentTaskIndex,
    addImageForCurrentTask,
    handleFileObject,
    retake,
  }
}
