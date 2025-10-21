import { useEffect, useRef, useState } from "react"

export default function useHistoryNavigation(initialPage = "welcome") {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const basePathRef = useRef(import.meta.env.BASE_URL || "/")

  const getFullPath = (page) => {
    const base = basePathRef.current.endsWith("/")
      ? basePathRef.current.slice(0, -1)
      : basePathRef.current
    return `${base}/${page}`
  }

  const navigateToPage = (page) => {
    setCurrentPage(page)
    window.history.pushState({ page }, "", getFullPath(page))
  }

  useEffect(() => {
    window.history.replaceState(
      { page: initialPage },
      "",
      getFullPath(initialPage),
    )

    const handlePopState = (event) => {
      if (event.state?.page) {
        setCurrentPage(event.state.page)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [initialPage])

  return [currentPage, navigateToPage]
}
