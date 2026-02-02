import React from "react"
import { Boxes, Database, Wand2 } from "lucide-react"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"
import ProductCard from "../cards/ProductCard"
import { products } from "../../constants/data"

const ProductsSection = () => {
  return (
    <section
      id="products"
      className="container mx-auto px-6 lg:px-8 py-24 relative overflow-hidden"
    >
      <div className="relative">
        <FloatingSVGGroup
          elements={[
            {
              icon: React.createElement(Boxes, { className: "text-orange-400/80" }),
              position: { top: "15%", left: "5%" },
              size: "lg",
              opacity: 0.7,
              delay: 0.8,
            },
            {
              icon: React.createElement(Database, { className: "text-purple-400/80" }),
              position: { bottom: "25%", right: "8%" },
              size: "lg",
              opacity: 0.7,
              delay: 1.2,
            },
            {
              icon: React.createElement(Wand2, { className: "text-pink-400/80" }),
              position: { top: "40%", right: "20%" },
              size: "md",
              opacity: 0.7,
              delay: 0.6,
            },
          ]}
        />
      </div>

      <h2 className="text-4xl font-bold text-center text-white mb-16 relative font-heading">
        Our Products
        <div className="absolute bottom-[-16px] left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 relative">
        {products.map((product, index) => (
          <div key={index} className="relative flex">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductsSection
