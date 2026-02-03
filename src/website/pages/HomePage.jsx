import React, { useEffect } from "react"
import { Helmet } from "react-v19-helmet-async"
import { motion } from "framer-motion"
import { useLocation } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import HeroSection from "../components/sections/HeroSection"
import AboutSection from "../components/sections/AboutSection"
import ServicesSection from "../components/sections/ServicesSection"
import ProductsSection from "../components/sections/ProductsSection"
import FaqSection from "../components/sections/FaqSection"
import ContactSection from "../components/sections/ContactSection"
import Footer from "../components/sections/Footer"

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const handleHashRouting = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" })
          }, 300)
        }
      }
    }

    const timer = setTimeout(handleHashRouting, 100)
    return () => clearTimeout(timer)
  }, [location.pathname, location.hash])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen relative overflow-hidden"
    >
      <Helmet>
        <title>Servintec</title>
        <meta
          name="description"
          content="Servintec is a leading software development company in the USA specializing in custom software development, AI solutions, web applications, mobile apps, and digital transformation services."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="keywords"
          content="Servintec, software development, web development, mobile app development, database, performance optimization, AI solutions, custom software, digital transformation, IT services, consulting, USA tech company, software company USA"
        />
        <meta property="og:title" content="Servintec LLC - Software Development Company in the USA" />
        <meta property="og:description" content="Leading software development company in the USA offering innovative solutions in web development, mobile apps, and AI services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://servintec.net" />
        <meta property="og:image" content="https://servintec.net/servintec-logo.png" />
        <meta property="og:site_name" content="Servintec" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Servintec - Crafting Digital Excellence" />
        <meta name="twitter:description" content="Leading software development company in the USA offering innovative solutions in web development, mobile apps, and AI services." />
        <meta name="twitter:image" content="https://servintec.net/servintec-logo.png" />
        <meta name="geo.region" content="NP-P1" />
        <meta name="geo.placename" content="USA" />
        <meta name="geo.position" content="26.6418;87.9927" />
        <meta name="ICBM" content="26.6418, 87.9927" />
        <link rel="canonical" href="https://servintec.net" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Navbar />
      </motion.div>

      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <FaqSection />
      <ContactSection />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  )
}
