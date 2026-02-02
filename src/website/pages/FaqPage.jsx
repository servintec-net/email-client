import React from "react"
import { Helmet } from "react-v19-helmet-async"
import Navbar from "../components/layout/Navbar"
import FaqSection from "../components/sections/FaqSection"
import Footer from "../components/sections/Footer"

export default function FaqPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>FAQ - Servintec</title>
        <meta
          name="description"
          content="Frequently Asked Questions about Servintec's services, technologies, and approach to software development."
        />
        <link rel="canonical" href="https://servintec.net/faq" />
      </Helmet>
      <Navbar />
      <FaqSection />
      <Footer />
    </div>
  )
}
