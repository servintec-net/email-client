import React from "react"
import { Helmet } from "react-v19-helmet-async"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/sections/Footer"
import { Lock } from "lucide-react"

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-black min-h-screen">
      <Helmet>
        <title>FreeWall VPN - Privacy Policy</title>
        <meta
          name="description"
          content="FreeWall VPN Privacy Policy. Learn about our data collection practices, privacy commitments, and how we protect your information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://servintec.net/freewall/privacy-policy" />
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
              Privacy Policy
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
              to="/freewall/terms-conditions"
              className="text-blue-400 hover:text-blue-300 transition-colors underline"
            >
              View Terms & Conditions
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
                At FreeWall VPN, your privacy and security are our top priorities. This Privacy Policy explains how we collect, use, and protect information when you use our VPN services ("Service") and associated website domains ("Site").
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    FreeWall VPN is committed to minimizing the data we process. We do NOT collect or store identifiable personal information, browsing history, DNS queries, IP addresses, or traffic content.
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    To keep the Service running, we may collect non-personal, technical telemetry such as operating system version, device model, manufacturer, app version, language, system country setting, connection timestamps, aggregated data transfer amounts, and anonymous diagnostic or crash information.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    This information is non-identifiable, used solely for service quality, and cannot be linked back to a specific user or their online behavior.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">2. How We Use This Information</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300 mb-4">
                    <li>Maintain performance and stability, monitor server capacity, optimize routes, and troubleshoot connection issues.</li>
                    <li>Diagnose crashes or technical problems and inform product improvements.</li>
                    <li>Selected diagnostic signals may be processed by trusted analytics providers strictly for technical analysis. All such data remains anonymous and cannot reveal your identity or online activity.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">3. Data Security</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    We employ administrative, technical, and physical safeguards to protect the limited telemetry we collect, helping prevent unauthorized access, alteration, or disclosure.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    No internet transmission is completely secure; despite our best efforts, we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">4. Third-Party Services</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    FreeWall VPN may rely on vetted third parties for analytics, crash reporting, or performance monitoring.
                  </p>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    These partners receive only anonymized, non-identifiable technical data and must uphold strict data protection standards.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    We do not sell, share, or disclose personal data, nor provide any information that could expose your browsing history, content, IP address, or behavior.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">5. Your Rights</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    Depending on your jurisdiction, you may be able to request access to non-personal telemetry associated with your account (if applicable), request deletion of diagnostic data, or opt out of diagnostic collection through system or in-app settings when available.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Submit privacy inquiries or requests via the contact information below.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">6. Changes to This Privacy Policy</h3>
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    We may update this policy to reflect new legal requirements, product capabilities, or operational practices. The most recent version will always be available on our website or within the app.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    Continued use of the Service after updates signifies acceptance of the revised policy.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">7. Contact Us</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Questions or requests? Email us at{" "}
                    <a href="mailto:admin@servintec.net" className="text-blue-400 hover:text-blue-300 transition-colors">
                      admin@servintec.net
                    </a>
                    . We aim to respond as quickly as possible.
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
