import React from "react"
import { Helmet } from "react-v19-helmet-async"
import Navbar from "../components/layout/Navbar"
import ServicesSection from "../components/sections/ServicesSection"
import Footer from "../components/sections/Footer"

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>Our Services - Servintec</title>
        <meta
          name="description"
          content="Servintec offers Web App Development, Mobile App Development, and Digital Marketing services. Custom solutions for your business needs."
        />
        <link rel="canonical" href="https://servintec.net/services" />
      </Helmet>
      <Navbar />
      <ServicesSection />
      <Footer />
    </div>
  )
}
