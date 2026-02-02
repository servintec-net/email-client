import React from "react"
import { Helmet } from "react-v19-helmet-async"
import Navbar from "../components/layout/Navbar"
import ContactSection from "../components/sections/ContactSection"
import Footer from "../components/sections/Footer"

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>Contact Us - Servintec</title>
        <meta
          name="description"
          content="Get in touch with Servintec. Contact us for custom software development, web apps, mobile apps, and digital marketing services."
        />
        <link rel="canonical" href="https://servintec.net/contact" />
      </Helmet>
      <Navbar />
      <ContactSection />
      <Footer />
    </div>
  )
}
