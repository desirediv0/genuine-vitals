"use client";

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
  CheckCircle,
  Award,
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
      benefits: ["Vitamin D", "Omega-3", "CoQ10", "Magnesium"],
      color: "text-red-600",
      bg: "bg-red-50",
      products: ["CardioVital D3", "Omega Supreme", "HeartGuard Plus"],
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Brain Function",
      description:
        "Minerals that support cognitive performance and mental clarity",
      benefits: ["Zinc", "Magnesium", "B-Vitamins", "DHA"],
      color: "text-blue-600",
      bg: "bg-blue-50",
      products: ["BrainBoost B-Complex", "MindMax Zinc", "Focus Formula"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Immune Support",
      description:
        "Vitamins that strengthen your body's natural defense system",
      benefits: ["Vitamin C", "Vitamin E", "Selenium", "Zinc"],
      color: "text-green-600",
      bg: "bg-green-50",
      products: ["ImmuneShield C", "DefenseMax E", "Guardian Selenium"],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Energy Boost",
      description: "Minerals for sustained vitality and natural energy levels",
      benefits: ["Iron", "B12", "Folate", "CoQ10"],
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      products: ["EnergyVital Iron", "B12 Boost", "Vitality Complex"],
    },
  ];

  const productHighlights = [
    {
      title: "Premium Multivitamins",
      description: "Complete daily nutrition in one convenient capsule",
      benefits: [
        "All essential vitamins",
        "Minerals included",
        "Easy absorption",
      ],
      image: "💊",
    },
    {
      title: "Specialized Formulas",
      description: "Targeted solutions for specific health needs",
      benefits: ["Age-specific", "Gender-specific", "Health condition focused"],
      image: "🎯",
    },
    {
      title: "Mineral Supplements",
      description: "Essential minerals for optimal body function",
      benefits: ["High bioavailability", "Chelated forms", "No fillers"],
      image: "💎",
    },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-green-400/10 rounded-full blur-2xl animate-pulse delay-700" />

        {/* Geometric Shapes */}
        <div className="absolute top-10 right-20 w-4 h-4 bg-primary/30 rotate-45 animate-bounce" />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/40 rounded-full animate-bounce delay-300" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/25 rounded-full animate-ping" />
        <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-green-400/30 rounded-full animate-bounce delay-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
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
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-bold shadow-lg mb-6"
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
              className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8"
            >
              Discover Genuine Vitals' comprehensive range of scientifically
              formulated vitamins and minerals designed to support your overall
              health, energy, and vitality. Our premium supplements are crafted
              with the finest ingredients and backed by rigorous quality
              standards.
            </motion.p>
          </motion.div>

          {/* Product Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {productHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200/50 group-hover:scale-105">
                  <div className="text-4xl mb-4">{highlight.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{highlight.description}</p>
                  <ul className="space-y-2">
                    {highlight.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Nutrient Categories */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 1, delay: 0.8 }}
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
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
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
                        <div className="flex flex-wrap gap-2 mb-3">
                          {nutrient.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="inline-block bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                        <div className="text-sm text-gray-500">
                          <strong>Popular Products:</strong>{" "}
                          {nutrient.products.join(", ")}
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
              transition={{ duration: 1, delay: 0.9 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Visual Container */}
                <div className="relative w-full h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
                  {/* Central Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="relative">
                        <div className="w-32 h-32 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse">
                          <Target className="h-16 w-16 text-primary-foreground" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Activity className="h-4 w-4 text-white" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Star className="h-3 w-3 text-white fill-white" />
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
                      <Award className="h-5 w-5 text-yellow-500 fill-yellow-500" />
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

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center"
          >
            <Link href="/products">
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white px-8 py-4 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Explore Our Products
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <p className="text-gray-600 mt-4 text-sm">
              Join thousands of customers who trust Genuine Vitals for their
              health
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
