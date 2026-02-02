import React from "react"
import FloatingSVG from "./FloatingSVG"

const FloatingSVGGroup = ({
  elements,
  maxElements = 3,
}) => {
  const limitedElements = elements.slice(0, maxElements)

  return (
    <>
      {limitedElements.map((element, index) => (
        <FloatingSVG
          key={index}
          top={element.position.top}
          left={element.position.left}
          right={element.position.right}
          bottom={element.position.bottom}
          delay={element.delay}
          size={element.size}
          opacity={element.opacity}
        >
          {element.icon}
        </FloatingSVG>
      ))}
    </>
  )
}

export default FloatingSVGGroup
