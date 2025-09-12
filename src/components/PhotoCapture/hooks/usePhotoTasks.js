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
      } catch {
        // ignore storage errors
      }
    },
    [tasks, storageKey],
  )

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
    (file) => {
      if (!file) return Promise.resolve(null)
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result
          typeof dataUrl === "string" && addImageForCurrentTask(dataUrl)
          resolve(dataUrl)
        }
        reader.onerror = (err) => reject(err)
        reader.readAsDataURL(file)
      })
    },
    [addImageForCurrentTask],
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
