import { useEffect } from "react"

export const useScrollToSection = () => {
  useEffect(() => {
    if (typeof window === "undefined") return

    const anchorLinks = document.querySelectorAll('a[href^="#"]')

    const handleClick = (e) => {
      const anchor = e.currentTarget
      const href = anchor.getAttribute("href")
      if (!href) return
      e.preventDefault()

      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const yOffset = -80
        const y =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset
        window.scrollTo({ top: y, behavior: "auto" })
      }
    }

    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleClick)
    })

    return () => {
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener("click", handleClick)
      })
    }
  }, [])
}
