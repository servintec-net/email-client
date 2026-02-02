import { useNavigate, useLocation } from "react-router-dom"

export const useNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navigateToSection = (href) => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    let hash = ""
    let pathname = location.pathname

    if (href.startsWith("#")) {
      hash = href
      pathname = location.pathname
    } else if (href.includes("#")) {
      const parts = href.split("#")
      pathname = parts[0] || "/"
      hash = "#" + parts[1]
    } else {
      pathname = href
    }

    if (pathname !== location.pathname && pathname !== "/") {
      const fullPath = hash ? `${pathname}${hash}` : pathname
      navigate(fullPath)
      if (hash) {
        setTimeout(() => {
          const targetId = hash.substring(1)
          const targetElement = document.getElementById(targetId)
          if (targetElement) {
            const yOffset = -80
            const y =
              targetElement.getBoundingClientRect().top +
              window.pageYOffset +
              yOffset
            window.scrollTo({ top: y, behavior: "smooth" })
          }
        }, 100)
      }
    } else {
      if (hash) {
        const targetId = hash.substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          const yOffset = -80
          const y =
            targetElement.getBoundingClientRect().top +
            window.pageYOffset +
            yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }
    }
  }

  return { navigateToSection }
}
