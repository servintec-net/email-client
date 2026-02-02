import { useState, useEffect } from "react"

export const useActiveSection = (sections) => {
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleScroll = () => {
      let currentSection = "home"

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (
            rect.top <= window.innerHeight / 2 &&
            rect.bottom >= window.innerHeight / 2
          ) {
            currentSection = sectionId
          }
        }
      })

      setActiveSection(currentSection)
    }

    let ticking = false
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", scrollHandler, { passive: true })
    return () => window.removeEventListener("scroll", scrollHandler)
  }, [sections])

  return activeSection
}
