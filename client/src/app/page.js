"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight, Heart, Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import GymSupplementShowcase from "@/components/showcase";
import BenefitsSec from "@/components/benifit-sec";
import FeaturedCategoriesSection from "@/components/catgry";
import Headtext from "@/components/ui/headtext";
import ProductQuickView from "@/components/ProductQuickView";

// Hero Carousel Component
const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);

  const slides = [
    {
      title: ["UNLEASH", "YOUR", "POTENTIAL"],
      subtitle: "Pre-workout supplements that deliver real power",
      description:
        "Elevate your workouts with our premium pre-workout formulas",
      cta: "DISCOVER MORE",
      ctaLink: "/category/pre-workout",
      bgColor: "from-rose-500 to-orange-500",
      image: "/images/hero-1.jpg",
      video: "/video.mp4",
    },
    {
      title: ["PREMIUM", "PROTEIN", "FORMULA"],
      subtitle: "Advanced supplements for maximum results",
      description:
        "Science-backed protein supplements for optimal muscle growth",
      cta: "SHOP PROTEIN",
      ctaLink: "/category/protein",
      bgColor: "from-blue-600 to-cyan-500",
      image: "/images/hero-2.jpg",
    },
    {
      title: ["TRANSFORM", "YOUR", "JOURNEY"],
      subtitle: "Quality supplements for peak performance",
      description: "Complete your fitness journey with our trusted products",
      cta: "EXPLORE NOW",
      ctaLink: "/products",
      bgColor: "from-[#2E9692] to-[#D5DA2A]",
      image: "/images/hero-3.jpg",
    },
  ];

  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrentSlide(api.selectedScrollSnap()));
    return () => api.off("select", () => {});
  }, [api]);

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="relative w-full h-auto bg-black">
      <Carousel
        setApi={setApi}
        className="h-full"
        opts={{
          loop: true,
          dragFree: true,
        }}
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem
              key={index}
              className=" relative md:h-[600px] h-[500px]"
            >
              <div className="relative h-full w-full overflow-hidden group">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-75" />
                <div
                  className={`absolute inset-0 bg-gradient-to-tr ${slide.bgColor} opacity-40 transition-opacity duration-500 group-hover:opacity-50`}
                />

                {/* Background Media */}
                <div className="absolute inset-0">
                  {index === 0 && slide.video ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="object-cover w-full h-full"
                    >
                      <source src={slide.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      src={slide.image || "/banner-background.jpg"}
                      alt="Background"
                      fill
                      className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-4000"
                      priority
                    />
                  )}
                </div>

                {/* Content */}
                <div className="relative h-full z-20">
                  <div className="container mx-auto px-4 h-full flex flex-col justify-center">
                    <div className="max-w-4xl space-y-8">
                      {/* Title Animation */}
                      <div className="space-y-3">
                        {slide.title.map((word, i) => (
                          <motion.div
                            key={i}
                            className="overflow-hidden"
                            initial="hidden"
                            animate={
                              currentSlide === index ? "visible" : "hidden"
                            }
                            variants={textVariants}
                            custom={i}
                          >
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight">
                              {word}
                            </h2>
                          </motion.div>
                        ))}
                      </div>

                      {/* Subtitle & Description */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          currentSlide === index
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="space-y-4"
                      >
                        <h3 className="text-xl md:text-2xl text-white font-medium">
                          {slide.subtitle}
                        </h3>
                        <p className="text-gray-200 text-base md:text-lg max-w-2xl">
                          {slide.description}
                        </p>
                      </motion.div>

                      {/* CTA Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          currentSlide === index
                            ? { opacity: 1, y: 0 }
                            : { opacity: 0, y: 20 }
                        }
                        transition={{ delay: 0.8, duration: 0.8 }}
                      >
                        <Link href={slide.ctaLink}>
                          <Button
                            className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium transition-transform hover:scale-105"
                            size="lg"
                          >
                            {slide.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="container mx-auto px-4">
          <CarouselPrevious className="absolute left-4 md:left-8 z-30 bg-white/10 hover:bg-white/20 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="absolute right-4 md:right-8 z-30 bg-white/10 hover:bg-white/20 border-none text-white backdrop-blur-sm" />
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === i ? "w-8 bg-white" : "w-2 bg-white/50"
                  }`}
                  onClick={() => api?.scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Carousel>
    </div>
  );
};

// Announcement Banner
const AnnouncementBanner = () => {
  return (
    <div className="bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10" />
      <div className="container mx-auto relative">
        <div className="flex items-center justify-between py-3 px-4">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-8"
          >
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-white">⚡</span>
              <span className="text-white font-medium">
                FREE SHIPPING ON ORDERS ABOVE ₹999
              </span>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <span className="text-white">🎁</span>
              <span className="text-white font-medium">
                FREE SHAKER WITH PROTEIN PURCHASES
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-white">🔥</span>
              <span className="text-white font-medium">
                USE CODE{" "}
                <span className="font-bold bg-white/20 px-2 py-0.5 rounded">
                  FIT10
                </span>{" "}
                FOR 10% OFF
              </span>
            </div>
          </motion.div>
          <Link
            href="/products"
            className="hidden md:flex items-center text-white hover:text-white/90 font-medium transition-colors"
          >
            Shop Now
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Utility functions for colors
// Function to get a consistent color based on category name
const getCategoryColor = (name) => {
  const colors = [
    "from-blue-700 to-blue-500",
    "from-purple-700 to-purple-500",
    "from-red-700 to-red-500",
    "from-green-700 to-green-500",
    "from-yellow-700 to-yellow-500",
    "from-indigo-700 to-indigo-500",
    "from-pink-700 to-pink-500",
    "from-teal-700 to-teal-500",
  ];

  // Simple hash function to get consistent color for same category name
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// Function to get a consistent color based on product name
const getProductColor = (name) => {
  const colors = [
    "bg-blue-100",
    "bg-purple-100",
    "bg-red-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-indigo-100",
    "bg-pink-100",
    "bg-teal-100",
  ];

  // Simple hash function to get consistent color for same product name
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
};

// This returns a gradient background for categories without images
const getCategoryGradient = (name) => {
  const gradients = {
    Protein: "from-orange-400 to-amber-600",
    "Pre-Workout": "from-purple-500 to-indigo-600",
    "Weight Loss": "from-green-400 to-teal-500",
    Vitamins: "from-blue-400 to-cyan-500",
    Performance: "from-red-400 to-rose-600",
    Wellness: "from-pink-400 to-fuchsia-600",
    Accessories: "from-gray-400 to-slate-600",
  };

  return gradients[name] || "from-primary/60 to-primary";
};

// Calculate number of items to show based on screen size
function useWindowSize() {
  const [size, setSize] = useState(4);

  useEffect(() => {
    function updateSize() {
      if (window.innerWidth < 640) {
        setSize(1);
      } else if (window.innerWidth < 768) {
        setSize(2);
      } else if (window.innerWidth < 1024) {
        setSize(3);
      } else {
        setSize(4);
      }
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}

// Featured Products Component with modern card design
const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id || product.slug || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href={`/products/${product.slug || ""}`}>
                <div className="relative aspect-square bg-gray-50">
                  <Image
                    src={product.image || "/product-placeholder.jpg"}
                    alt={product.name || "Product"}
                    fill
                    className="object-contain p-6 transform group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {product.hasSale && (
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        SALE
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Quick Actions */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.preventDefault();
                    setQuickViewProduct(product);
                    setQuickViewOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-4">
                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={
                          i < Math.round(product.avgRating || 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Product Info */}
                <Link
                  href={`/products/${product.slug || ""}`}
                  className="block group"
                >
                  <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name || "Product"}
                  </h3>
                </Link>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-primary">
                      ₹{product.basePrice || 0}
                    </span>
                    {product.hasSale && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.regularPrice || 0}
                      </span>
                    )}
                  </div>
                  {(product.flavors || 0) > 1 && (
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                      {product.flavors} variants
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link href="/products">
          <Button
            variant="outline"
            size="lg"
            className="font-medium border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-6 group"
          >
            View All Products
            <motion.span
              className="inline-block ml-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowRight className="h-5 w-5" />
            </motion.span>
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

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Fitness Enthusiast",
      avatar: "/avatar1.jpg",
      quote:
        "These supplements have completely transformed my fitness journey. The quality and results are unmatched!",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Yoga Instructor",
      avatar: "/avatar2.jpg",
      quote:
        "Clean ingredients and exceptional quality. I confidently recommend these products to all my clients.",
      rating: 5,
    },
    {
      name: "Arjun Singh",
      role: "Professional Athlete",
      avatar: "/avatar3.jpg",
      quote:
        "The performance boost from these supplements is incredible. They've become an essential part of my training.",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#2E9692]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#D5DA2A]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Headtext
              title={"VOICES OF SUCCESS"}
              subtitle={
                "Real stories from our community members who've experienced remarkable transformations"
              }
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow relative z-10">
                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-[#2E9692] to-[#D5DA2A] rounded-full opacity-10" />

                {/* Quote */}
                <div className="relative">
                  <div className="mb-6">
                    <svg
                      className="w-10 h-10 text-gray-200"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>

                  <p className="text-gray-700 text-lg font-medium italic mb-6">
                    &quot;{testimonial.quote}&quot;
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonial.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Profile */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-[#2E9692] to-[#D5DA2A] flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-900">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {testimonial.role}
                      </p>
                    </div>
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

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
    <div className="aspect-square bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

// Home page component
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
    <div className="overflow-hidden">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Announcement Banner */}
      <AnnouncementBanner />

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <FeaturedCategoriesSection />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Headtext
              title={"FEATURED PRODUCTS"}
              subtitle={
                "Premium supplements designed to enhance your fitness journey"
              }
            />
          </div>
          <FeaturedProducts
            products={featuredProducts}
            isLoading={productsLoading}
            error={error}
          />
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto">
          <GymSupplementShowcase />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Headtext
              title={"WHY CHOOSE US"}
              subtitle={
                "Experience the difference with our premium quality products"
              }
            />
          </div>
          <BenefitsSec />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </div>
  );
}
