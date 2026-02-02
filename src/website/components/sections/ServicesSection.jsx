import React from "react"
import { Cpu, Code2, Layers3 } from "lucide-react"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"
import ServiceCard from "../cards/ServiceCard"
import { services } from "../../constants/data"

const ServicesSection = () => {
  return (
    <section
      id="services"
      className="container mx-auto px-6 lg:px-8 py-24 relative overflow-hidden"
    >
      <FloatingSVGGroup
        elements={[
          {
            icon: React.createElement(Cpu, { className: "text-blue-400/80" }),
            position: { top: "10%", left: "5%" },
            size: "xl",
            opacity: 0.7,
            delay: 0.5,
          },
          {
            icon: React.createElement(Code2, { className: "text-purple-400/80" }),
            position: { bottom: "20%", right: "5%" },
            size: "lg",
            opacity: 0.7,
            delay: 0.9,
          },
          {
            icon: React.createElement(Layers3, { className: "text-green-400/80" }),
            position: { bottom: "40%", left: "30%" },
            size: "md",
            opacity: 0.6,
            delay: 1.3,
          },
        ]}
      />

      <h2 className="text-4xl font-bold text-center text-white mb-16 relative z-[1] font-heading">
        Our Services
        <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative z-[1]">
        {services.map((service, index) => (
          <ServiceCard key={index} service={service} />
        ))}
      </div>
    </section>
  )
}

export default ServicesSection
