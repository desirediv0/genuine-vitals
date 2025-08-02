"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Zap,
  Gift,
  Star,
  Sparkles,
  ShoppingBag,
  Percent,
  Clock,
} from "lucide-react";
import { useRef } from "react";

const CTASection = () => {
  const [currentOffer, setCurrentOffer] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const offers = [
    {
      badge: "Limited Time",
      headline: "Get 25% OFF on Your First Order",
      description:
        "Start your fitness journey with premium supplements at unbeatable prices. Free shipping included!",
      cta: "Claim Your Discount",
      icon: <Percent className="h-6 w-6" />,
      gradient: "from-green-500 via-red-500 to-green-500",
    },
    {
      badge: "Flash Sale",
      headline: "Buy 2 Get 1 FREE on All Proteins",
      description:
        "Stock up on your favorite protein powders and save big. Perfect for serious genuine nutrition!",
      cta: "Shop Proteins Now",
      icon: <Gift className="h-6 w-6" />,
      gradient: "from-purple-500 via-green-500 to-cyan-500",
    },
    {
      badge: "New Launch",
      headline: "Discover Our Latest Pre-Workout",
      description:
        "Experience explosive energy and focus with our scientifically formulated pre-workout blend.",
      cta: "Try It Now",
      icon: <Zap className="h-6 w-6" />,
      gradient: "from-green-500 via-teal-500 to-blue-500",
    },
  ];

  // Rotate offers every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [offers.length]);

  const currentOfferData = offers[currentOffer];

  return (
    <section ref={ref} className="relative py-20 overflow-hidden bg-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated Background Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${currentOfferData.gradient} opacity-10 transition-all duration-1000`}
        />

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Geometric Patterns */}
        <div className="absolute top-10 right-20 w-4 h-4 bg-primary/20 rotate-45 animate-bounce" />
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-primary/30 rounded-full animate-bounce delay-300" />
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary/25 rounded-full animate-ping" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            {/* Main CTA Card */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Background Pattern */}

              <div className="relative p-8 md:p-12 lg:p-16">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content Side */}
                  <div className="space-y-8">
                    {/* Animated Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.8 }
                      }
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    >
                      {currentOfferData.icon}
                      <span>{currentOfferData.badge}</span>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </motion.div>

                    {/* Headline */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
                      }
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                        {currentOfferData.headline}
                      </h2>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl"
                    >
                      {currentOfferData.description}
                    </motion.p>

                    {/* Features */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.8, delay: 0.5 }}
                      className="flex flex-wrap gap-4"
                    >
                      {[
                        "Free Shipping",
                        "Lab Tested",
                        "Money Back Guarantee",
                      ].map((feature, index) => (
                        <div
                          key={feature}
                          className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-700"
                        >
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                      }
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="flex flex-col sm:flex-row gap-4"
                    >
                      <Link href="/products">
                        <Button
                          size="lg"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group"
                        >
                          {currentOfferData.cta}
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>

                      <Link href="/categories">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg font-bold rounded-xl transition-all duration-300 bg-transparent"
                        >
                          Browse Categories
                        </Button>
                      </Link>
                    </motion.div>

                    {/* Timer/Urgency Element */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={
                        isInView
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0.9 }
                      }
                      transition={{ duration: 0.8, delay: 0.7 }}
                      className="flex items-center space-x-2 text-sm text-gray-600"
                    >
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="font-medium">
                        Limited time offer - Don&apos;t miss out!
                      </span>
                    </motion.div>
                  </div>

                  {/* Visual Side */}
                  <motion.div
                    initial={{ opacity: 0, x: 50, rotate: 5 }}
                    animate={
                      isInView
                        ? { opacity: 1, x: 0, rotate: 0 }
                        : { opacity: 0, x: 50, rotate: 5 }
                    }
                    transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                    className="relative"
                  >
                    <div className="relative">
                      {/* Main Visual Container */}
                      <div className="relative w-full h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Placeholder for product image or illustration */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center space-y-4">
                            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                              <ShoppingBag className="h-12 w-12 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-gray-700">
                                Premium
                              </div>
                              <div className="text-lg text-gray-600">
                                Supplements
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Floating Elements */}
                        <div className="absolute top-4 right-4 w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <div className="text-center">
                            <div className="text-lg font-bold text-primary">
                              25%
                            </div>
                            <div className="text-xs text-gray-600">OFF</div>
                          </div>
                        </div>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="text-sm font-medium text-gray-700">
                              4.9/5 Rating
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                      <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary/30 rounded-full animate-pulse delay-500" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Progress Indicator for Rotating Offers */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-primary transition-all duration-8000 ease-linear"
                  style={{
                    width: `${((currentOffer + 1) / offers.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* Secondary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                icon: <Zap className="h-6 w-6" />,
                title: "Fast Results",
                description: "See improvements in just 2 weeks",
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: <Gift className="h-6 w-6" />,
                title: "Free Gifts",
                description: "Complimentary shaker with orders",
                color: "text-green-600",
                bg: "bg-green-50",
              },
              {
                icon: <Star className="h-6 w-6" />,
                title: "Premium Quality",
                description: "Lab-tested and certified products",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:scale-105">
                  <div
                    className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className={item.color}>{item.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
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
