import React from "react"
import { Helmet } from "react-v19-helmet-async"
import Navbar from "../components/layout/Navbar"
import AboutSection from "../components/sections/AboutSection"
import Footer from "../components/sections/Footer"

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>About Us - Servintec</title>
        <meta
          name="description"
          content="Learn about Servintec - where creativity meets code. We're a team of passionate designers, developers, and strategists driven by turning ideas into impactful digital experiences."
        />
        <link rel="canonical" href="https://servintec.net/about" />
      </Helmet>
      <Navbar />
      <AboutSection />
      <Footer />
    </div>
  )
}
