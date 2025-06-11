import React from "react";
import { motion } from "framer-motion";

const Headtext = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center max-w-3xl mx-auto px-4 mb-12"
    >
      {/* Decorative Elements */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-[#2E9692]/10" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-[#D5DA2A]/10" />
          <div className="w-16 h-1 bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] rounded-full" />
        </div>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        {title}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg text-gray-600 leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}

      {/* Gradient Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="w-24 h-1 mx-auto mt-6 bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] rounded-full"
      />
    </motion.div>
  );
};

export default Headtext;
