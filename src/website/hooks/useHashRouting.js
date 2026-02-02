import { useEffect } from "react"
import { useLocation } from "react-router-dom"

export const useHashRouting = () => {
  const location = useLocation()

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleHashRouting = () => {
      const hash = window.location.hash
      if (hash) {
        const targetId = hash.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          setTimeout(() => {
            const yOffset = -80
            const y =
              targetElement.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset
            window.scrollTo({ top: y, behavior: "smooth" })
          }, 100)
        }
      }
    }

    handleHashRouting()

    const handleHashChange = () => {
      handleHashRouting()
    }

    window.addEventListener("hashchange", handleHashChange)

    return () => {
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [location.pathname])

  return null
}
