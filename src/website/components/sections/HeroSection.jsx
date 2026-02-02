import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Rocket, Code2, Cpu, Sparkles, Zap, Database, Globe, Layers } from "lucide-react"
import { Button } from "../ui/button"
import ImageCarousel from "../ui/ImageCarousel"

const HeroSection = () => {
  const floatingElements = [
    { icon: React.createElement(Code2, { className: "w-6 h-6" }), delay: 0, position: { top: "10%", left: "5%" } },
    { icon: React.createElement(Rocket, { className: "w-5 h-5" }), delay: 0.5, position: { top: "20%", right: "10%" } },
    { icon: React.createElement(Cpu, { className: "w-4 h-4" }), delay: 1, position: { bottom: "30%", left: "8%" } },
    { icon: React.createElement(Sparkles, { className: "w-5 h-5" }), delay: 1.5, position: { bottom: "15%", right: "15%" } },
    { icon: React.createElement(Zap, { className: "w-4 h-4" }), delay: 0.3, position: { top: "50%", left: "3%" } },
    { icon: React.createElement(Database, { className: "w-5 h-5" }), delay: 0.8, position: { top: "60%", right: "5%" } },
    { icon: React.createElement(Globe, { className: "w-4 h-4" }), delay: 1.2, position: { bottom: "50%", left: "12%" } },
    { icon: React.createElement(Layers, { className: "w-5 h-5" }), delay: 0.6, position: { top: "35%", right: "3%" } },
  ]

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 2,
  }))

  return (
    <header
      id="home"
      className="container mx-auto px-6 lg:px-8 pt-32 pb-32 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden min-h-[90vh]"
    >
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full pointer-events-none"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {floatingElements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-blue-400/20 pointer-events-none"
          style={element.position}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.2, 1],
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 4 + index,
            repeat: Infinity,
            delay: element.delay,
            ease: "easeInOut",
          }}
        >
          {element.icon}
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0 0", "50px 50px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="flex-1 max-w-2xl relative z-10 text-left mx-4 md:mx-8 mt-8">
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-8 drop-shadow-lg font-heading relative"
        >
          <motion.span
            animate={{
              backgroundPosition: ["0%", "100%", "0%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
          >
            Build Better,<br /><span className="whitespace-nowrap">Faster, Smarter</span>
          </motion.span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-gray-300 mb-12 leading-relaxed relative"
        >
          <motion.span
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            With Our Software Development Services
          </motion.span>
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="flex flex-wrap gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 border-none text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-xl px-10 py-6 rounded-full font-semibold"
              >
                <span className="flex items-center gap-2">
                  Contact Us
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex-1 w-full md:w-1/2 relative mx-4 md:mx-8 z-10">
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]"
        >
          <div className="rounded-2xl relative z-10 w-full h-full">
            <ImageCarousel
              images={["/images/hero1.png"]}
              autoPlay={true}
              interval={4000}
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </header>
  )
}

export default HeroSection
