import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GymSupplementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-[#2E9692] via-[#2E9692]/90 to-[#D5DA2A]/20 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2E9692]/50 to-[#2E9692]" />

        <motion.div
          className="flex flex-col md:flex-row relative z-10"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Left Side - Text Content */}
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <h2 className="inline-block text-sm font-bold bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full tracking-widest uppercase">
                Premium Collection
              </h2>
              <h1 className="text-5xl md:text-7xl font-black mt-6 tracking-tight leading-tight">
                MAX <span className="text-[#D5DA2A]">POWER</span>
              </h1>
              <div className="h-2 w-20 bg-[#D5DA2A] mt-6 mb-8 rounded-full"></div>
            </motion.div>

            <motion.p
              className="text-white/90 text-lg leading-relaxed max-w-xl mb-8 backdrop-blur-sm bg-white/5 p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              Advanced protein formula with 25g protein per serving. Engineered
              for maximum performance and rapid recovery. Fuel your ambition
              with our scientifically formulated supplement.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {[
                {
                  text: "25g Protein",
                  icon: "🏋️‍♂️",
                },
                {
                  text: "5g BCAAs",
                  icon: "💪",
                },
                {
                  text: "Zero Sugar",
                  icon: "🚫",
                },
                {
                  text: "Fast Absorption",
                  icon: "⚡",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full text-sm font-medium hover:bg-white/10 transition-colors duration-300"
                >
                  <span>{feature.icon}</span>
                  {feature.text}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="bg-[#D5DA2A] text-gray-900 hover:bg-[#D5DA2A]/90 font-bold py-4 px-8 rounded-full shadow-lg flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                SHOP NOW
                <svg
                  className="w-5 h-5 transform transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.button>

              <motion.button
                className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                LEARN MORE
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Image with Effects */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="h-full min-h-[400px] md:min-h-[600px] relative overflow-hidden">
              {/* Animated Shapes */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-40 h-40 border-2 border-[#D5DA2A]/20 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute top-1/3 right-1/4 w-32 h-32 border-2 border-white/20 rounded-full blur-sm"
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [180, 0, 180],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute bottom-1/4 right-1/3 w-24 h-24 border-2 border-[#D5DA2A]/30 rotate-45 blur-sm"
                animate={{
                  rotate: [45, 225, 45],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 7,
                  ease: "easeInOut",
                }}
              />

              {/* Product Image with Glow Effect */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="relative">
                  {/* Glow effect behind the image */}
                  <div className="absolute inset-0 bg-[#D5DA2A] blur-3xl opacity-20 scale-90" />

                  <Image
                    src="/c3.jpg"
                    alt="Protein Supplement"
                    width={500}
                    height={500}
                    className="relative z-10 max-h-full max-w-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
