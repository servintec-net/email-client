import React from "react"
import { motion } from "framer-motion"
import {
  Rocket,
  BrainCircuit,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"

const Footer = () => {
  return (
    <footer className="relative py-12 bg-gray-950/50 backdrop-blur-md min-h-[320px] flex items-center rounded-t-[4rem] border-t border-white/10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: "linear",
          }}
          className="whitespace-nowrap h-full flex items-center"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="text-[15vw] font-black text-white/[0.03] tracking-tight select-none leading-none h-full flex items-center"
            >
              SERVINTEC&nbsp;
            </span>
          ))}
        </motion.div>
      </div>

      <FloatingSVGGroup
        elements={[
          {
            icon: React.createElement(Rocket, { className: "text-blue-400/60" }),
            position: { bottom: "60%", left: "5%" },
            size: "md",
            opacity: 0.3,
            delay: 0.3,
          },
          {
            icon: React.createElement(BrainCircuit, { className: "text-purple-400/60" }),
            position: { top: "30%", right: "8%" },
            size: "md",
            opacity: 0.3,
            delay: 0.7,
          },
        ]}
        maxElements={2}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          <div className="text-center md:text-left">
            <motion.div
              className="flex items-center justify-center md:justify-start mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                className="relative inline-block"
                animate={{
                  filter: [
                    "drop-shadow(0 0 5px rgba(96, 165, 250, 0))",
                    "drop-shadow(0 0 15px rgba(96, 165, 250, 0.5))",
                    "drop-shadow(0 0 5px rgba(96, 165, 250, 0))",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src="/servintec-logo.png"
                  alt="Servintec Logo"
                  className="h-12 w-auto"
                />
                <motion.div
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
            <p className="mt-2 text-gray-400 max-w-xs">
              Delivering innovative software solutions and services to
              businesses worldwide.
            </p>

            <motion.div
              className="text-gray-400 text-sm mt-6"
              whileHover={{ color: "#60A5FA" }}
            >
              © 2026 Servintec. All rights reserved.
            </motion.div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold text-white mb-6">
              Quick Links
            </h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
              {[
                { text: "Home", href: "#home" },
                { text: "Services", href: "#services" },
                { text: "Products", href: "#products" },
                { text: "FAQ", href: "#faq" },
                { text: "Contact Us", href: "#contact" },
                { text: "Email Us", href: "mailto:admin@servintec.net" },
              ].map((link, index) => {
                if (link.href.startsWith("mailto:")) {
                  return (
                    <motion.a
                      key={index}
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5, color: "#60A5FA" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {link.text}
                    </motion.a>
                  )
                }
                return (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault()
                        const element = document.querySelector(link.href)
                        if (element) {
                          element.scrollIntoView({ behavior: "smooth", block: "start" })
                        }
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <motion.span
                      whileHover={{ x: 5, color: "#60A5FA" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {link.text}
                    </motion.span>
                  </a>
                )
              })}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-xl font-semibold text-white mb-6">
              Contact Information
            </h4>
            <motion.div
              className="space-y-4 text-gray-400"
              whileHover={{ opacity: 1 }}
              initial={{ opacity: 0.9 }}
            >
              <motion.div
                className="flex items-start justify-center md:justify-start gap-3"
                whileHover={{ x: 5, color: "#60A5FA" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 bg-blue-500/10 rounded-full flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-left">6081 Summerlake Dr<br />Davie, FL, United States</span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center md:justify-start gap-3"
                whileHover={{ x: 5, color: "#60A5FA" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 bg-blue-500/10 rounded-full flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-left">
                  <a
                    href="tel:+19195786771"
                    aria-label="Call (919) 578-6771"
                    className="hover:text-blue-400 transition-colors"
                  >
                    (919) 578-6771
                  </a>
                </span>
              </motion.div>
              <motion.div
                className="flex items-center justify-center md:justify-start gap-3"
                whileHover={{ x: 5, color: "#60A5FA" }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="p-2 bg-blue-500/10 rounded-full flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-left">
                  <a
                    href="mailto:admin@servintec.net"
                    aria-label="Email admin@servintec.net"
                    className="hover:text-blue-400 transition-colors break-all"
                  >
                    admin@servintec.net
                  </a>
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
