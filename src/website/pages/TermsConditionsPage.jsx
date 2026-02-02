import React from "react"
import { Helmet } from "react-v19-helmet-async"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/sections/Footer"
import { Lock } from "lucide-react"

export default function TermsConditionsPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>FreeWall VPN - Terms & Conditions</title>
        <meta
          name="description"
          content="FreeWall VPN Terms & Conditions. Learn about our acceptable use policy, service availability, and terms of service."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://servintec.net/freewall/terms-conditions" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
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
              Terms & Conditions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xl text-gray-300"
            >
              FreeWall VPN
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <Link
              to="/freewall/privacy-policy"
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              View Privacy Policy
            </Link>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16"
          >
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-6 leading-relaxed">
                These Terms and Conditions ("Terms") govern your use of the VPN services ("Service") provided by FreeWall VPN and all associated websites (the "Site"). By accessing or using the Service, you agree to these Terms, which form a legally binding agreement between you and FreeWall VPN.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">1. Acceptable Use Policy</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    You agree to use the Service in accordance with all applicable laws and regulations. You must not use the Service in any way that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                    <li>Involves sending unsolicited or unauthorized messages.</li>
                    <li>Involves accessing, sharing, or distributing unlawful content.</li>
                    <li>Infringes on intellectual property rights.</li>
                    <li>Attempts to gain unauthorized access to networks, devices, or systems.</li>
                    <li>Harms, disrupts, or interferes with the Service or other users</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    Violation of this Acceptable Use Policy may result in temporary or permanent restrictions, including blocking access to the Service. FreeWall VPN grants you a limited, non-exclusive license to use the application solely for its intended purpose. Any unauthorized copying, modification, or reverse engineering of the software is prohibited.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">2. Privacy and Data Collection</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    FreeWall VPN is committed to protecting your privacy. We do not collect or store personal browsing activity, traffic logs, or any information that identifies what users do online.
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    To maintain and improve the Service, we may collect the following non-personal information:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                    <li>Device type and operating system</li>
                    <li>App version and performance metrics</li>
                    <li>Connection timestamps</li>
                    <li>Aggregated data transfer amounts</li>
                    <li>Diagnostic or crash information (non-identifiable)</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    This information is used exclusively to improve performance, ensure stability, and troubleshoot technical issues. Any analytics or diagnostic data shared with third-party service providers is anonymous and non-identifiable.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">3. Disclaimers</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    The Service is provided on an "as is" and "as available" basis. FreeWall VPN does not make any warranties, expressed or implied, including fitness for a particular purpose, reliability, or uninterrupted availability.
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    You acknowledge that:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                    <li>Network conditions, third-party services, and external factors may affect performance.</li>
                    <li>FreeWall VPN is not responsible for any losses or damages arising from service interruptions, connectivity issues, or third-party website content.</li>
                    <li>Links to external websites are provided for convenience only and FreeWall VPN is not responsible for their content or practices.</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    You use the Service and Site at your own discretion and risk.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">4. Service Availability</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    FreeWall VPN aims to maintain high service availability. However, temporary interruptions may occur due to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                    <li>Maintenance or updates</li>
                    <li>Network limitations</li>
                    <li>User device configuration</li>
                    <li>Server load or capacity</li>
                    <li>Events outside our control</li>
                  </ul>
                  <p className="text-gray-300 leading-relaxed">
                    We will make reasonable efforts to restore the Service promptly when disruptions occur.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">5. Changes to the Terms</h3>
                  <p className="text-gray-300 leading-relaxed">
                    FreeWall VPN may update these Terms from time to time to reflect changes in regulations, service improvements, or operational adjustments. Continued use of the Service after changes are published constitutes acceptance of the updated Terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">6. Contact Information</h3>
                  <p className="text-gray-300 leading-relaxed">
                    If you have any questions regarding these Terms, please contact us at:{" "}
                    <a href="mailto:admin@servintec.net" className="text-blue-400 hover:text-blue-300 transition-colors">
                      admin@servintec.net
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
