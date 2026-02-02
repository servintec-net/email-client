import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Menu, ChevronDown } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"

const MobileSubmenuItem = ({ item, onClose, isHomePage, navigate }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-gray-200 hover:text-white hover:bg-white/10 py-3 px-4 rounded-xl transition-all text-lg font-medium border border-transparent hover:border-white/10"
      >
        <span>{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-1 mt-1"
          >
            {item.children &&
              item.children.map((child, index) => (
                <a
                  key={index}
                  href={child.href}
                  onClick={(e) => {
                    if (child.href.startsWith("#")) {
                      e.preventDefault()
                      if (isHomePage) {
                        const element = document.querySelector(child.href)
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      } else {
                        navigate("/" + child.href)
                      }
                    }
                    onClose()
                  }}
                  className="flex items-center text-gray-300 hover:text-white hover:bg-white/10 py-2 px-6 rounded-xl transition-all text-base w-full border border-transparent hover:border-white/5 cursor-pointer"
                >
                  {child.label}
                </a>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const MobileMenu = ({
  isOpen,
  onClose,
  navItems,
  isHomePage,
  navigate,
}) => {

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99999] flex items-center justify-center overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-[95%] max-w-lg bg-gray-900/80 backdrop-blur-lg border border-white/10 rounded-2xl p-6 my-4 shadow-2xl overflow-y-auto max-h-[90vh]"
          >
            <div className="absolute right-4 top-4">
              <Button
                variant="ghost"
                onClick={onClose}
                className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex justify-center mb-8 mt-2">
              <img
                src="/logo.svg"
                alt="Servintec Logo"
                className="h-12 w-auto"
              />
            </div>

            <nav className="space-y-3">
              {navItems.map((item, index) =>
                item.children ? (
                  <MobileSubmenuItem
                    key={index}
                    item={item}
                    onClose={onClose}
                    isHomePage={isHomePage}
                    navigate={navigate}
                  />
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    onClick={(e) => {
                      if (item.href.startsWith("#")) {
                        e.preventDefault()
                        if (isHomePage) {
                          const element = document.querySelector(item.href)
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        } else {
                          navigate(item.href)
                        }
                      } else if (item.href === "/") {
                        e.preventDefault()
                        navigate("/")
                      }
                      onClose()
                    }}
                    className={cn(
                      "flex items-center w-full justify-center text-gray-200 hover:text-white hover:bg-white/10 py-4 px-4 rounded-xl transition-all text-lg font-medium border border-transparent hover:border-white/10 cursor-pointer"
                    )}
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHomePage = location.pathname === "/"

  const navItems = [
    { label: "Home", href: isHomePage ? "#home" : "/" },
    { label: "About", href: isHomePage ? "#about" : "/#about" },
    { label: "Services", href: isHomePage ? "#services" : "/#services" },
    { label: "Products", href: isHomePage ? "#products" : "/#products" },
    { label: "FAQ", href: isHomePage ? "#faq" : "/#faq" },
    { label: "Contact", href: isHomePage ? "#contact" : "/#contact" },
  ]

  const handleNavClick = (e, href) => {
    if (href.startsWith("#")) {
      e.preventDefault()
      if (isHomePage) {
        const element = document.querySelector(href)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      } else {
        navigate("/" + href)
      }
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    } else if (href === "/" || href.startsWith("/#")) {
      e.preventDefault()
      navigate(href)
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {isMobile ? (
        <motion.nav
          ref={navRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-40 bg-gray-900/90 backdrop-blur-md shadow-lg transition-all duration-300"
        >
          <div className="flex items-center justify-between px-4 py-3">
            <a
              href="#home"
              className="flex items-center nav-item"
              onClick={(e) => {
                handleNavClick(e, "#home")
              }}
            >
              <div className="flex items-center">
                <img
                  src="/logo.svg"
                  alt="Servintec Logo"
                  className="h-8 w-auto"
                />
              </div>
            </a>

            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0 flex items-center justify-center"
              aria-label="Toggle mobile menu"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </motion.nav>
      ) : (
        <motion.nav
          ref={navRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-4 left-0 right-0 mx-auto z-40 transition-all duration-300 w-fit max-w-[95%]"
        >
          <div className="flex items-center bg-gray-900/40 backdrop-blur-md border border-white/10 rounded-full py-2 px-4">
            <Link
              to="/"
              className="flex items-center mr-3"
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-md"></div>
                  <img
                    src="/logo.svg"
                    alt="Servintec Logo"
                    className="h-8 w-auto hidden sm:inline-block relative z-10"
                  />
                </div>
              </div>
            </Link>

            <div className="flex items-center">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "relative px-3 py-1.5 transition-all duration-200 text-sm md:text-base font-medium rounded-full cursor-pointer",
                    "text-gray-200 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </motion.nav>
      )}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        isHomePage={isHomePage}
        navigate={navigate}
      />
    </>
  )
}

export default Navbar
