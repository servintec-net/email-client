import React from "react"
import { motion } from "framer-motion"

const FloatingSVG = ({
  children,
  size = "md",
  opacity = 0.7,
  className = "",
  animationDuration = 10,
  ...props
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-44 h-44",
    "2xl": "w-56 h-56",
    "3xl": "w-80 h-80",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity,
        y: [0, -10, 0, 10, 0],
        x: [0, 10, 0, -10, 0],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: props.delay || 0,
      }}
      className={`absolute ${className}`}
      style={{
        top: props.top,
        left: props.left,
        right: props.right,
        bottom: props.bottom,
        zIndex: -1,
      }}
    >
      <div className={sizeClasses[size]}>{children}</div>
    </motion.div>
  )
}

export default FloatingSVG
