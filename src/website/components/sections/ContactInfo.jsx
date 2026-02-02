import React from "react"
import { MapPin, Phone, Mail, Globe } from "lucide-react"
import { motion } from "framer-motion"

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="space-y-8 text-gray-300"
    >
      <h3 className="text-2xl font-semibold text-white mb-6 border-b border-white/10 pb-4">
        Contact Information
      </h3>
      <motion.div
        className="flex items-start gap-4 group"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
          <MapPin className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">Address</p>
          <p className="group-hover:text-blue-400 transition-colors">6081 Summerlake Dr<br />Davie, FL<br />United States</p>
        </div>
      </motion.div>

      <motion.div
        className="flex items-start gap-4 group"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
          <Phone className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">Phone</p>
          <a
            href="tel:+19195786771"
            aria-label="Call (919) 578-6771"
            className="group-hover:text-purple-400 transition-colors"
          >
            (919) 578-6771
          </a>
        </div>
      </motion.div>

      <motion.div
        className="flex items-start gap-4 group"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="p-3 bg-green-500/10 rounded-full group-hover:bg-green-500/20 transition-colors">
          <Mail className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">Email</p>
          <a
            href="mailto:admin@servintec.net"
            aria-label="Email admin@servintec.net"
            className="group-hover:text-green-400 transition-colors"
          >
            admin@servintec.net
          </a>
        </div>
      </motion.div>

      <motion.div
        className="flex items-start gap-4 group"
        whileHover={{ x: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <div className="p-3 bg-yellow-500/10 rounded-full group-hover:bg-yellow-500/20 transition-colors">
          <Globe className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">Website</p>
          <a href="https://www.servintec.net" className="group-hover:text-yellow-400 transition-colors">www.servintec.net</a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContactInfo
