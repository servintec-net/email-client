import React from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Zap, BrainCircuit, Gem, Users, Rocket } from "lucide-react"
import { Button } from "../ui/button"
import FloatingSVGGroup from "../ui/FloatingSVGGroup"

const AboutSection = () => {
  return (
    <section
      id="about"
      className="container mx-auto px-6 lg:px-8 py-36 relative overflow-hidden"
    >
      <FloatingSVGGroup
        elements={[
          {
            icon: React.createElement(Gem, { className: "text-purple-400/90" }),
            position: { top: "20%", right: "15%" },
            size: "xl",
            opacity: 0.8,
            delay: 0.3,
          },
          {
            icon: React.createElement(Rocket, { className: "text-blue-400/90" }),
            position: { bottom: "15%", left: "15%" },
            size: "lg",
            opacity: 0.8,
            delay: 0.7,
          },
          {
            icon: React.createElement(BrainCircuit, { className: "text-pink-400/90" }),
            position: { top: "40%", left: "25%" },
            size: "md",
            opacity: 0.7,
            delay: 0.5,
          },
        ]}
      />

      <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 font-heading">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              About Us
            </span>
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-8"></div>

          <div className="space-y-6 text-lg text-gray-300">
            <p className="text-xl font-semibold text-white">
              Where creativity meets code  -  and your brand wins!
            </p>
            <p>
              We're a team of passionate designers, developers, and strategists driven by the challenge of turning ideas into impactful digital experiences.
              From sleek websites to powerful apps and full-scale platforms, we bring the creativity, expertise, and momentum to bring your vision to life.
            </p>
            <p>
              But we don't just make things look good  -  we make them work.
            </p>
            <p>
              Our process is rooted in collaboration, where every idea is explored, every detail refined, and every solution built to deliver real results.
              With creativity as our mindset and technology as our toolkit, we help brands grow, adapt, and lead in the digital space.
            </p>
            <p className="text-xl font-semibold text-white">
              If you can dream it  -  we can build it.
            </p>
          </div>

          <div className="mt-10">
            <Link to="/services">
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 rounded-full font-semibold"
              >
                Explore Our Services
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-white/5 border border-white/10 group-hover:border-white/20 transition-all duration-500"></div>

            <div className="relative bg-gray-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Why Choose Us?
                </h3>
              </div>

              <div className="space-y-8">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      Creative + Technical, Always Balanced
                    </h4>
                    <p className="text-gray-300 mt-2">
                      We blend design thinking with solid engineering so your product looks premium and performs flawlessly.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <BrainCircuit className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      Built to Work, Not Just Impress
                    </h4>
                    <p className="text-gray-300 mt-2">
                      We focus on real outcomes - speed, stability, conversions, and usability - so what we ship delivers results, not just visuals.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  <div className="p-3 bg-pink-500/20 rounded-xl">
                    <Gem className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      Collaborative Process, Zero Guesswork
                    </h4>
                    <p className="text-gray-300 mt-2">
                      You're involved at every step. We explore ideas together, refine details fast, and keep momentum from kickoff to launch.
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300"
                >
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">
                      Support That Stays After Launch
                    </h4>
                    <p className="text-gray-300 mt-2">
                      We don't disappear once it's shipped. We stay close to help you iterate, improve, and grow as your needs evolve.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
