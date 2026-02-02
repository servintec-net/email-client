import React from "react"
import { motion } from "framer-motion"
import { Briefcase, Laptop2 } from "lucide-react"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"
import ContactInfo from "./ContactInfo"
import ContactForm from "./ContactForm"
import { fadeInVariants } from "../../constants/animations"

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <FloatingSVGGroup
          elements={[
            {
              icon: React.createElement(Briefcase, { className: "text-blue-400/80" }),
              position: { top: "15%", right: "10%" },
              size: "lg",
              opacity: 0.7,
              delay: 0.5,
            },
            {
              icon: React.createElement(Laptop2, { className: "text-purple-500/80" }),
              position: { bottom: "10%", left: "5%" },
              size: "md",
              opacity: 0.7,
              delay: 0.7,
            },
          ]}
        />

        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-10">
            Let's<span className="text-blue-400"> Work Together</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10">
            Ready to start your next project? Reach out to us to discuss your
            needs and how we can help bring your vision to life.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <ContactInfo />
          </div>
          <div className="w-full max-w-md mx-auto md:mx-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
