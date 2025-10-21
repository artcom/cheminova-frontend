import { useEffect, useRef, useState } from "react"

export default function useHistoryNavigation(initialPage = "welcome") {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const isNavigatingRef = useRef(false)

  const navigateToPage = (page) => {
    isNavigatingRef.current = true
    setCurrentPage(page)
    window.history.pushState({ page }, "", `/${page}`)
  }

  useEffect(() => {
    window.history.replaceState({ page: initialPage }, "", `/${initialPage}`)

    const handlePopState = (event) => {
      if (event.state?.page) {
        isNavigatingRef.current = true
        setCurrentPage(event.state.page)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [initialPage])

  useEffect(() => {
    if (isNavigatingRef.current) {
      isNavigatingRef.current = false
    }
  }, [currentPage])

  return [currentPage, navigateToPage]
}
