import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const DEFAULT_TASK_KEYS = ["laNau", "surroundings", "special"]

export function usePhotoCaptureData(photography) {
  const { t } = useTranslation()

  const heading = photography?.heading || t("photoCapture.title")

  const fallbackTitles = useMemo(
    () => DEFAULT_TASK_KEYS.map((key) => t(`photoCapture.tasks.${key}`)),
    [t],
  )

  const taskMetadata = useMemo(() => {
    const cmsTasks = photography?.imageDescriptions
    if (cmsTasks && cmsTasks.length > 0) {
      return cmsTasks.map((item, index) => {
        const titleFallback = fallbackTitles[index] || fallbackTitles[0] || ""
        return {
          title: item?.shortDescription?.trim() || titleFallback,
          description: (item?.description || "").trim(),
        }
      })
    }

    return fallbackTitles.map((title) => ({
      title,
      description: "",
    }))
  }, [photography?.imageDescriptions, fallbackTitles])

  const tasksForHook = useMemo(
    () =>
      taskMetadata.map(({ description, title }) => description || title || ""),
    [taskMetadata],
  )

  return {
    heading,
    taskMetadata,
    tasksForHook,
  }
}
