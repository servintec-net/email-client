import React from "react"
import { Helmet } from "react-v19-helmet-async"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/sections/Footer"
import { Lock, FileText, Shield } from "lucide-react"
import { Button } from "../components/ui/button"

export default function FreeWallPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>FreeWall VPN - Legal Documents</title>
        <meta
          name="description"
          content="FreeWall VPN Terms & Conditions and Privacy Policy. Access our legal documents and policies."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://servintec.net/freewall" />
        <link rel="icon" href="/favicon.ico" />
      </Helmet>

      <Navbar />

      <div className="container mx-auto px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-16">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="p-4 bg-blue-500/10 rounded-full">
                <Lock className="w-12 h-12 text-blue-400" />
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4"
            >
              FreeWall VPN
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-300"
            >
              Legal Documents
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to="/freewall/terms-conditions">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-500/10 rounded-full">
                      <FileText className="w-8 h-8 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Terms & Conditions</h2>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Read our terms of service, acceptable use policy, and service agreements.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-green-500/40 to-blue-500/40 text-white hover:from-green-500/60 hover:to-blue-500/60 border-2 border-green-400/60">
                    View Terms & Conditions
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link to="/freewall/privacy-policy">
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white/5 backdrop-blur-sm p-8 rounded-xl border border-white/10 shadow-xl h-full"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-full">
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Privacy Policy</h2>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Learn about our data collection practices, privacy commitments, and how we protect your information.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white hover:from-blue-500/60 hover:to-purple-500/60 border-2 border-blue-400/60">
                    View Privacy Policy
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
