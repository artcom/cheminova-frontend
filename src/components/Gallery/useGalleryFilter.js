import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export function useGalleryFilter(images = []) {
  const { t } = useTranslation()
  const [filter, setFilter] = useState("all")

  const getTaskType = (item) => item?.task_type || item?.task || "unknown"

  const filterLabels = useMemo(
    () => ({
      all: t("gallery.all", "All"),
      la_nau: t("gallery.laNau", "La Nau"),
      surroundings: t("gallery.surroundings", "Surroundings"),
      special: t("gallery.special", "Special"),
    }),
    [t],
  )

  const activeFilterLabel = filterLabels[filter] || filter

  const filteredImages = useMemo(() => {
    return images.filter((item) => {
      if (filter === "all") return true
      return getTaskType(item) === filter
    })
  }, [images, filter])

  const taskCounts = useMemo(() => {
    return images.reduce(
      (accumulator, item) => {
        const taskType = getTaskType(item)
        accumulator.all += 1
        if (accumulator[taskType] !== undefined) {
          accumulator[taskType] += 1
        }
        return accumulator
      },
      { all: 0, la_nau: 0, surroundings: 0, special: 0, unknown: 0 },
    )
  }, [images])

  return {
    filter,
    setFilter,
    filteredImages,
    taskCounts,
    filterLabels,
    activeFilterLabel,
    getTaskType,
  }
}
