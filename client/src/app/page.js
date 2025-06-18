"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Star,
  Eye,
  Zap,
  Shield,
  Truck,
  Gift,
  Phone,
  MapPin,
  Users,
  Award,
  Clock,
  Trophy,
  Dumbbell,
  FireExtinguisher,
  Weight,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import ProductQuickView from "@/components/ProductQuickView";

// Hero Section with Carousel
const ModernHero = () => {
  const heroSlides = [
    {
      title: "Transform Your Body",
      subtitle: "Premium Supplements",
      description:
        "Discover high-quality fitness supplements designed to help you achieve your goals faster.",
      image: "/c3.jpg",
      bgColor: "from-[#2E9692] to-[#1a6b68]",
      textColor: "text-white",
    },
    {
      title: "Build Lean Muscle",
      subtitle: "Protein Power",
      description:
        "Get 25g of premium protein per serving with our scientifically formulated blends.",
      image: "/c3.jpg",
      bgColor: "from-[#D5DA2A] to-[#b8bd22]",
      textColor: "text-gray-900",
    },
    {
      title: "Boost Your Energy",
      subtitle: "Pre-Workout Excellence",
      description:
        "Unleash your potential with our explosive pre-workout formulas for maximum performance.",
      image: "/c3.jpg",
      bgColor: "from-purple-600 to-purple-800",
      textColor: "text-white",
    },
  ];

  return (
    <section className="relative min-h-[calc(120vh-2rem)]  lg:min-h-[calc(100vh-4rem)] overflow-hidden">
      <Carousel className="w-full h-[calc(100vh-4rem)] ">
        <CarouselContent >
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="min-h-[calc(100vh-4rem)]">
              <div
                className={`relative min-h-[calc(100vh-4rem)] bg-gradient-to-br ${slide.bgColor} flex items-center justify-center overflow-hidden py-8 px-4`}
              >
                {/* Dynamic Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-float"></div>

                  {/* Floating Elements */}
                  <div className="absolute top-20 left-20 w-4 h-4 bg-white/30 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-32 right-32 w-3 h-3 bg-white/40 rounded-full animate-bounce delay-500"></div>
                  <div className="absolute top-1/2 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-white/25 rounded-full animate-ping"></div>

                  {/* Geometric Shapes */}
                  <div className="absolute top-1/4 right-1/4 w-16 h-16 border-2 border-white/20 rotate-45 animate-spin-slow"></div>
                  <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-white/30 rounded-full animate-pulse delay-700"></div>
                </div>

                <div className="container mx-auto relative z-10">
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Content Side */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className={`${slide.textColor} space-y-6 md:space-y-8 text-center px-6 lg:text-left`}
                    >
                      <div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-3 md:mb-4">
                          {slide.title}
                        </h1>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 opacity-90">
                          {slide.subtitle}
                        </h2>
                        <p className="text-lg sm:text-xl md:text-2xl opacity-80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/products">
                          <Button
                            size="lg"
                            className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                          >
                            Shop Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                        <Link href="/about">
                          <Button
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto border-2  border-white/50 text-black hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full backdrop-blur-sm transition-all duration-300"
                          >
                            Learn More
                          </Button>
                        </Link>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8">
                        <div className="text-center">
                          <div className="text-3xl font-black mb-2">25g</div>
                          <div className="text-sm opacity-80">
                            Premium Protein
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black mb-2">100%</div>
                          <div className="text-sm opacity-80">Natural</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black mb-2">24/7</div>
                          <div className="text-sm opacity-80">Support</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                      className="relative mt-8 lg:mt-0 px-6"
                    >
                      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                        <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 shadow-2xl">
                          <Image
                            src={slide.image}
                            alt="Fitness Supplement"
                            fill
                            className="object-cover rounded-3xl"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -top-4 -right-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 shadow-xl">
                          <div className="text-center">
                            <Trophy className="h-8 w-8 text-white mx-auto mb-2" />
                            <div className="text-white font-bold text-sm">
                              Premium Quality
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex left-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
        <CarouselNext className="hidden sm:flex right-4 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30" />
      </Carousel>
    </section>
  );
};

// Announcement Bar
const AnnouncementBar = () => {
  const announcements = [
    {
      icon: <Truck className="h-4 w-4" />,
      text: "FREE SHIPPING ON ORDERS ₹999+",
    },
    { icon: <Gift className="h-4 w-4" />, text: "FREE SHAKER WITH PROTEIN" },
    { icon: <Zap className="h-4 w-4" />, text: "USE CODE FIT10 FOR 10% OFF" },
  ];

  return (
    <div className="bg-gray-900 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="flex items-center space-x-4 md:space-x-6 text-white text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
            {announcements.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 flex-shrink-0">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Categories Section
const CategoriesSection = () => {
  const categories = [
    {
      name: "Protein Powder",
      icon: <Dumbbell className="h-6 w-6" />,
      description: "Build lean muscle",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Pre-Workout",
      icon: <Zap className="h-6 w-6" />,
      description: "Energy & Focus",
      color: "from-red-500 to-red-600",
    },
    {
      name: "Weight Loss",
      icon: <Weight className="h-6 w-6" />,
      description: "Burn fat fast",
      color: "from-orange-500 to-orange-600",
    },
    {
      name: "Vitamins",
      icon: <Star className="h-6 w-6" />,
      description: "Complete nutrition",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Mass Gainers",
      icon: <Dumbbell className="h-6 w-6" />,
      description: "Gain weight healthy",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Recovery",
      icon: <Zap className="h-6 w-6" />,
      description: "Post-workout care",
      color: "from-teal-500 to-teal-600",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Shop by Category
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Find the perfect supplements for your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              href={`/products?category=${category.name}`}
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group-hover:scale-105 group-hover:border-[#2E9692]/20 text-center">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 items-center justify-center flex group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 group-hover:text-[#2E9692] transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// Featured Products
const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load products</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id || product.slug || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#2E9692]/20">
              <Link href={`/products/${product.slug || ""}`}>
                <div className="relative aspect-square bg-gray-50 rounded-lg mb-3 sm:mb-4 overflow-hidden">
                  <Image
                    src={product.image || "/product-placeholder.jpg"}
                    alt={product.name || "Product"}
                    fill
                    className="object-contain p-3 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {product.hasSale && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="space-y-1 sm:space-y-2">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3 w-3"
                        fill={
                          i < Math.round(product.avgRating || 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                <Link
                  href={`/products/${product.slug || ""}`}
                  className="block"
                >
                  <h3 className="font-medium text-gray-900 hover:text-[#2E9692] transition-colors line-clamp-2 text-xs sm:text-sm">
                    {product.name || "Product"}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg font-bold text-[#2E9692]">
                      ₹{product.basePrice || 0}
                    </span>
                    {product.hasSale && (
                      <span className="text-xs sm:text-sm text-gray-500 line-through">
                        ₹{product.regularPrice || 0}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-[#2E9692] hover:bg-[#2E9692]/90 text-white rounded-lg text-[10px] sm:text-xs h-8 sm:h-9"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#2E9692] text-[#2E9692] hover:bg-[#2E9692] hover:text-white rounded-lg h-8 sm:h-9 px-2"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                      setQuickViewOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8 sm:mt-12">
        <Link href="/products">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] hover:from-[#2E9692]/90 hover:to-[#D5DA2A]/90 text-white px-8 sm:px-12 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View All Products
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </Link>
      </div>

      <ProductQuickView
        product={quickViewProduct}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = () => {
  const features = [
    {
      title: "Lab Tested Quality",
      description: "Every product is third-party tested for purity and potency",
      icon: <Shield className="h-8 w-8" />,
    },
    {
      title: "Fast Delivery",
      description: "Free shipping on orders above ₹999 across India",
      icon: <Truck className="h-8 w-8" />,
    },
    {
      title: "Expert Support",
      description: "Get guidance from certified nutritionists",
      icon: <Phone className="h-8 w-8" />,
    },
    {
      title: "Money Back Guarantee",
      description: "100% satisfaction guaranteed or your money back",
      icon: <Award className="h-8 w-8" />,
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose Genuine Vitals
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We're committed to providing you with the best supplements and service
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-gradient-to-br from-[#2E9692]/10 to-[#D5DA2A]/10 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-[#2E9692] transform scale-75 sm:scale-100">{feature.icon}</div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stats Section
const StatsSection = () => {
  const stats = [
    {
      number: "50K+",
      label: "Happy Customers",
      icon: <Users className="h-6 w-6" />,
    },
    {
      number: "100+",
      label: "Premium Products",
      icon: <Award className="h-6 w-6" />,
    },
    {
      number: "500+",
      label: "Cities Delivered",
      icon: <MapPin className="h-6 w-6" />,
    },
    {
      number: "24/7",
      label: "Customer Support",
      icon: <Clock className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-r from-[#2E9692] to-[#D5DA2A]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-white"
            >
              <div className="flex justify-center mb-2 sm:mb-3 text-white/80 transform scale-75 sm:scale-100">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-medium opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      quote:
        "Amazing quality supplements! Saw results within 2 weeks of using their protein powder.",
      rating: 5,
      location: "Mumbai",
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      quote:
        "Clean ingredients and great taste. I recommend these to all my students.",
      rating: 5,
      location: "Delhi",
    },
    {
      name: "Arjun Singh",
      role: "Professional Athlete",
      quote:
        "The pre-workout gives me incredible energy. Perfect for intense training sessions.",
      rating: 5,
      location: "Bangalore",
    },
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Real stories from real people who achieved their fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100 group-hover:border-[#2E9692]/20">
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 sm:h-4 sm:w-4 ${
                        i < testimonial.rating
                          ? "text-[#D5DA2A] fill-[#D5DA2A]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-xs sm:text-sm text-[#2E9692] font-medium">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



// Product Skeleton
const ProductSkeleton = () => (
  <div className="bg-white rounded-xl p-4 shadow-md animate-pulse border border-gray-100">
    <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
    <div className="space-y-3">
      <div className="flex space-x-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 w-3 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="flex space-x-2 mt-3">
        <div className="h-8 bg-gray-200 rounded-lg flex-1"></div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// Main Home Component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await fetchApi(
          "/public/products?featured=true&limit=8"
        );
        setFeaturedProducts(productsRes?.data?.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err?.message || "Failed to fetch data");
      } finally {
        setProductsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ModernHero />

      {/* Announcement Bar */}
      <AnnouncementBar />

      {/* Categories Section */}
      <CategoriesSection />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular supplements trusted by fitness
              enthusiasts
            </p>
          </div>
          <FeaturedProducts
            products={featuredProducts}
            isLoading={productsLoading}
            error={error}
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

  
    </div>
  );
}