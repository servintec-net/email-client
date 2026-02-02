import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ImageCarousel = ({
  images,
  autoPlay = true,
  interval = 3000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || images.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval, images.length])

  const scaleVariants = {
    enter: {
      opacity: 0,
      scale: 0.8,
    },
    center: {
      opacity: 1,
      scale: 1,
    },
    exit: {
      opacity: 0,
      scale: 0.8,
    },
  }

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            variants={scaleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, ease: "easeInOut" },
            }}
            className="absolute inset-0"
          >
            <motion.div
              className="relative w-full h-full"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <img
                src={images[currentIndex]}
                alt={`Hero section ${currentIndex + 1}`}
                className="w-full h-full object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ImageCarousel
