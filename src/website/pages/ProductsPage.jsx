import React from "react"
import { Helmet } from "react-v19-helmet-async"
import Navbar from "../components/layout/Navbar"
import ProductsSection from "../components/sections/ProductsSection"
import Footer from "../components/sections/Footer"

export default function ProductsPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>Our Products - Servintec</title>
        <meta
          name="description"
          content="Explore Servintec's innovative products: Snapsheet, AI Email Categorizer, Dumbstruck, and FreeWall VPN. Cutting-edge solutions for various industries."
        />
        <link rel="canonical" href="https://servintec.net/products" />
      </Helmet>
      <Navbar />
      <ProductsSection />
      <Footer />
    </div>
  )
}
