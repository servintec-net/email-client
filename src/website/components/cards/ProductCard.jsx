import React, { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/button"
import { Modal } from "../ui/modal"

const ProductCard = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        whileHover={{
          y: -8,
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
          transition: { type: "spring", stiffness: 400, damping: 17 },
        }}
        className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-xl relative h-full flex flex-col"
      >
        <div className="mb-4 relative">
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0.1 }}
            whileHover={{ opacity: 0.2, rotate: 5 }}
            className="absolute right-0 top-0"
          >
            {React.cloneElement(product.icon, {
              className: "w-20 h-20 text-current",
            })}
          </motion.div>

          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.1, x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="inline-block mb-3"
            >
              {React.cloneElement(product.icon, { className: "w-12 h-12" })}
            </motion.div>

            <div className="flex items-center gap-3 mb-3">
              <div className="text-sm text-blue-400 font-medium">
                {product.category}
              </div>
              <motion.div
                className="h-0.5 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                whileHover={{ width: "100%", transition: { duration: 0.3 } }}
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">
              {product.name}
            </h3>
          </div>
        </div>

        <p className="text-gray-300 mb-5 flex-grow">{product.description}</p>

        <Button
          className="mt-auto bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 px-5 py-2 rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          onClick={() => setIsModalOpen(true)}
        >
          View Details <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={product.name}
        icon={React.cloneElement(product.icon, { className: "w-8 h-8" })}
      >
        <div className="mb-3 px-2 py-1 inline-block bg-blue-500/20 text-blue-400 rounded-full text-sm">
          {product.category}
        </div>
        <div
          className="text-gray-300 space-y-4"
          dangerouslySetInnerHTML={{ __html: product.detailedDescription }}
        />
        {product.name === "FreeWall VPN" && (
          <motion.div
            className="mt-6 pt-6 border-t border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col gap-3">
              <Link to="/freewall/terms-conditions">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-green-500/40 to-blue-500/40 text-gray-900 hover:from-green-500/60 hover:to-blue-500/60 hover:text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-green-400/60 hover:border-green-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Terms & Conditions
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
              <Link to="/freewall/privacy-policy">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-gray-900 hover:from-blue-500/60 hover:to-purple-500/60 hover:text-gray-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all border-2 border-blue-400/60 hover:border-blue-400"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      View Privacy Policy
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </Modal>
    </>
  )
}

export default ProductCard
