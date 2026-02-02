import React, { useState } from "react"
import { motion } from "framer-motion"
import { Boxes, Search } from "lucide-react"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"
import FaqItem from "./FaqItem"
import { faqs } from "../../constants/data"
import { fadeInVariants } from "../../constants/animations"

const FaqSection = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <section
      id="faq"
      className="bg-gray-950/50 backdrop-blur-md py-24 rounded-b-[4rem] border-b border-white/10 relative overflow-hidden"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <FloatingSVGGroup
          elements={[
            {
              icon: React.createElement(Boxes, { className: "text-blue-400/90" }),
              position: { top: "20%", right: "10%" },
              size: "xl",
              opacity: 0.8,
              delay: 0.7,
            },
            {
              icon: React.createElement(Search, { className: "text-purple-400/90" }),
              position: { bottom: "25%", left: "10%" },
              size: "lg",
              opacity: 0.7,
              delay: 0.4,
            },
          ]}
        />

        <motion.div
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Frequently <span className="text-blue-400">Asked Questions</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Find answers to common questions about our services and process.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-8 rounded-full" />
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqIndex === index}
              onClick={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FaqSection
