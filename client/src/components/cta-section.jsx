"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Heart,
  Brain,
  Shield,
  Zap,
  Star,
  Sparkles,
  ShoppingBag,
  Leaf,
  Target,
  Activity,
  Clock,
  Pill,
  Droplets,
} from "lucide-react";
import { useRef } from "react";

const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const vitalNutrients = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Heart Health",
      description:
        "Essential vitamins for cardiovascular wellness and heart strength",
      benefits: ["Vitamin D", "Omega-3", "CoQ10"],
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Brain Function",
      description:
        "Minerals that support cognitive performance and mental clarity",
      benefits: ["Zinc", "Magnesium", "B-Vitamins"],
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Immune Support",
      description:
        "Vitamins that strengthen your body's natural defense system",
      benefits: ["Vitamin C", "Vitamin E", "Selenium"],
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Energy Boost",
      description: "Minerals for sustained vitality and natural energy levels",
      benefits: ["Iron", "B12", "Folate"],
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  const features = [
    {
      icon: <Pill className="h-6 w-6" />,
      title: "Premium Quality",
      description: "Lab-tested and certified for purity",
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Natural Ingredients",
      description: "Sourced from the finest natural sources",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Expert Formulation",
      description: "Scientifically formulated for optimal absorption",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Geometric Shapes */}
        <div className="absolute top-10 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/40 rounded-full animate-bounce delay-300" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/25 rounded-full animate-ping" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
              }
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6"
            >
              <Leaf className="h-5 w-5" />
              <span>Genuine Vitals</span>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6"
            >
              Premium Vitamins &<span className="text-primary"> Minerals</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
            >
              Discover Genuine Vitals' comprehensive range of scientifically
              formulated vitamins and minerals designed to support your overall
              health, energy, and vitality.
            </motion.p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Nutrient Categories */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-8">
                Essential Nutrients for Every Need
              </h3>

              {vitalNutrients.map((nutrient, index) => (
                <motion.div
                  key={nutrient.title}
                  initial={{ opacity: 0, x: -30 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                  }
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="group"
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 group-hover:scale-105">
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-16 h-16 ${nutrient.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={nutrient.color}>{nutrient.icon}</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          {nutrient.title}
                        </h4>
                        <p className="text-gray-600 mb-3">
                          {nutrient.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {nutrient.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right Side - Visual Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Visual Container */}
                <div className="relative w-full h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
                  {/* Central Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                          <Target className="h-16 w-16 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-3xl font-black text-gray-800">
                          Genuine Vitals
                        </div>
                        <div className="text-lg text-gray-600">
                          Premium Nutrition
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Nutrient Pills */}
                  <div className="absolute top-8 left-8 w-12 h-6 bg-gradient-to-r from-red-400 to-pink-400 rounded-full shadow-lg animate-bounce">
                    <div className="text-center text-white text-xs font-bold pt-1">
                      Vit D
                    </div>
                  </div>
                  <div className="absolute top-16 right-12 w-10 h-5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full shadow-lg animate-bounce delay-300">
                    <div className="text-center text-white text-xs font-bold pt-1">
                      B12
                    </div>
                  </div>
                  <div className="absolute bottom-16 left-12 w-11 h-5 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-lg animate-bounce delay-500">
                    <div className="text-center text-white text-xs font-bold pt-1">
                      Vit C
                    </div>
                  </div>
                  <div className="absolute bottom-8 right-8 w-9 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg animate-bounce delay-700">
                    <div className="text-center text-white text-xs font-bold pt-1">
                      Iron
                    </div>
                  </div>

                  {/* Quality Badge */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <div className="text-center">
                        <div className="text-sm font-bold text-gray-800">
                          Premium Quality
                        </div>
                        <div className="text-xs text-gray-600">
                          Lab Certified
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/30 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/40 rounded-full animate-pulse delay-500" />
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:scale-105">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
