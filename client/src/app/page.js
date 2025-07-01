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
  Phone,
  MapPin,
  Users,
  Award,
  Clock,
  Trophy,
  Heart,
  ShoppingCart,
  CheckCircle,
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
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import useEmblaCarouselAutoplay from "@/hooks/use-embla-carousel-autoplay";
import CTASection from "@/components/cta-section";
import { useRouter } from "next/navigation";
import {
  TestimonialsSection,
  VideoSection,
} from "@/components/additional-sections";

// Modern Hero Section
const ModernHero = () => {
  const [api, setApi] = useState();
  // Auto-carousel with embla plugin
  useEmblaCarouselAutoplay(api, {
    delay: 5000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
    playOnInit: true,
  });

  const heroSlides = [
    {
      title: "Transform Your Fitness Journey",
      subtitle: "Premium Quality Supplements",
      description:
        "Discover scientifically-backed supplements that deliver real results. Lab-tested, certified, and trusted by athletes worldwide.",
      image: "/c3.jpg",
      cta: "Shop Now",
      features: ["Lab Tested", "100% Authentic", "Fast Results"],
      stats: { protein: "25g", purity: "99%", delivery: "24h" },
    },
    {
      title: "Build Lean Muscle Mass",
      subtitle: "Protein Powerhouse",
      description:
        "Get maximum muscle growth with our premium protein blends. Each serving delivers 25g of high-quality protein for optimal recovery.",
      image: "/c3.jpg",
      cta: "Explore Proteins",
      features: ["25g Protein", "Zero Sugar", "Bio-Available"],
      stats: { protein: "25g", purity: "100%", delivery: "24h" },
    },
    {
      title: "Boost Your Performance",
      subtitle: "Pre-Workout Excellence",
      description:
        "Unleash your potential with explosive energy formulas. Enhanced focus, increased endurance, and zero crash guaranteed.",
      image: "/c3.jpg",
      cta: "Get Energized",
      features: ["Instant Energy", "Focus Boost", "No Crash"],
      stats: { energy: "8h", focus: "100%", delivery: "24h" },
    },
  ];

  return (
    <section className="relative min-h-screen bg-gray-50 overflow-hidden p-10 md:p-0">
      <Carousel setApi={setApi} className="w-full md:h-screen">
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="md:min-h-screen ">
              <div className="relative md:min-h-screen bg-white flex items-center justify-center  max-w-7xl mx-auto">
                {/* Background Pattern */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content Side */}
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      className="space-y-8"
                    >
                      {/* Badge */}
                      <div className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                        <Trophy className="h-4 w-4 mr-2" />
                        #1 Trusted Brand
                      </div>

                      {/* Main Content */}
                      <div>
                        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                          {slide.title}
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
                          {slide.subtitle}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                          {slide.description}
                        </p>
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products">
                          <Button
                            size="lg"
                            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                          >
                            {slide.cta}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-3">
                        {slide.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center bg-gray-100 rounded-full px-4 py-2 text-sm font-medium text-gray-700"
                          >
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-6 pt-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {slide.stats.protein || slide.stats.energy || "25g"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {slide.stats.protein ? "Protein" : "Energy Boost"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {slide.stats.purity || slide.stats.focus || "100%"}
                          </div>
                          <div className="text-sm text-gray-600">
                            {slide.stats.purity ? "Pure" : "Focus"}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary mb-1">
                            {slide.stats.delivery}
                          </div>
                          <div className="text-sm text-gray-600">Delivery</div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Image Side */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                      className="relative"
                    >
                      <div className="relative w-full h-96 lg:h-[500px]">
                        <div className="absolute inset-0 bg-gray-100 rounded-xl shadow-2xl overflow-hidden">
                          <Image
                            src={slide.image || "/placeholder.svg"}
                            alt="Fitness Supplement"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                Premium
                              </div>
                              <div className="text-xs text-gray-600">
                                Quality
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                Lab
                              </div>
                              <div className="text-xs text-gray-600">
                                Tested
                              </div>
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
        <CarouselPrevious className="left-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
        <CarouselNext className="right-4 bg-white/90 backdrop-blur-sm border-2 border-gray-200 text-gray-700 hover:bg-primary hover:text-primary-foreground hover:border-primary" />
      </Carousel>

      {/* Trust Indicators */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span>Free Shipping ₹999+</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Lab Tested</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Categories Section
const CategoriesSection = ({
  categories = [],
  isLoading = false,
  error = null,
}) => {
  const [api, setApi] = useState();
  useEmblaCarouselAutoplay(api, {
    delay: 4000,
    stopOnInteraction: true,
    stopOnMouseEnter: true,
    playOnInit: categories.length > 2,
  });

  const CategorySkeleton = () => (
    <div className="flex-[0_0_280px] md:flex-[0_0_240px] lg:flex-[0_0_200px]">
      <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 animate-pulse h-full">
        <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-5 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Shop by Category
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Find the perfect supplements for your fitness goals
            </motion.p>
          </div>
          <div className="flex gap-6 overflow-hidden">
            {[...Array(6)].map((_, index) => (
              <CategorySkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shop by Category
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
              <p className="text-red-600 mb-4">Failed to load categories</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shop by Category
            </h2>
            <p className="text-gray-500">No categories available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Find the perfect supplements for your fitness goals
          </motion.p>
        </div>

        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
              breakpoints: {
                "(max-width: 768px)": {
                  slidesToScroll: 1,
                  containScroll: "trimSnaps",
                },
                "(min-width: 769px)": {
                  slidesToScroll: 2,
                  containScroll: "trimSnaps",
                },
                "(min-width: 1024px)": {
                  slidesToScroll: 3,
                  containScroll: "trimSnaps",
                },
              },
            }}
          >
            <CarouselContent className="-ml-4">
              {categories.map((category, index) => (
                <CarouselItem
                  key={category.id}
                  className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group cursor-pointer h-full"
                  >
                    <Link href={`/category/${category.slug}`}>
                      <div className="bg-white rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 group-hover:scale-[1.02] group-hover:border-primary/30 overflow-hidden h-full relative">
                        <div className="relative aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
                          <Image
                            src={category.image || "/c3.jpg"}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {category._count?.products || 0} items
                          </div>
                        </div>

                        <div className="text-center space-y-3">
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {category.description}
                            </p>
                          )}
                          <div className="pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                            <span className="inline-flex items-center text-sm text-primary-foreground bg-primary px-4 py-2 rounded-full font-medium shadow-lg">
                              Shop Now
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {categories.length > 3 && (
              <>
                <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 backdrop-blur-sm border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shadow-xl" />
                <CarouselNext className="hidden md:flex -right-4 bg-white/90 backdrop-blur-sm border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground shadow-xl" />
              </>
            )}
          </Carousel>
        </div>

        {categories.length > 0 && (
          <div className="text-center mt-16">
            <Link href="/categories">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-4 rounded-xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                View All Categories
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

// Featured Products Section
const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Wishlist state management
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState({});

  // Check wishlist status for all products
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || products.length === 0) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });
        const items = response.data.wishlistItems || [];
        setWishlistItems(items);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, products]);

  // Handle add to wishlist
  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/`);
      return;
    }

    const productId = product.id;
    setWishlistLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const isInWishlist = wishlistItems.some(
        (item) => item.productId === productId
      );

      if (isInWishlist) {
        // Remove from wishlist
        const wishlistItem = wishlistItems.find(
          (item) => item.productId === productId
        );
        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });
          setWishlistItems((prev) =>
            prev.filter((item) => item.productId !== productId)
          );
          toast.success(`${product.name} removed from wishlist!`);
        }
      } else {
        // Add to wishlist
        const response = await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId }),
        });
        setWishlistItems((prev) => [...prev, response.data]);
        toast.success(`${product.name} added to wishlist!`);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.productId === productId);
  };

  const ProductSkeleton = () => (
    <div className="bg-white rounded-xl p-4 shadow-md animate-pulse border border-gray-100">
      <div className="aspect-square bg-gray-200 rounded-xl mb-4"></div>
      <div className="space-y-3">
        <div className="flex space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-3 w-3 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="flex space-x-2 mt-3">
          <div className="h-8 bg-gray-200 rounded-xl flex-1"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id || product.slug || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/30 group-hover:scale-[1.02] relative overflow-hidden">
              <Link
                href={`/products/${product.slug || ""}`}
                className="relative z-10"
              >
                <div className="relative aspect-square bg-gray-50 rounded-xl mb-4 overflow-hidden">
                  <Image
                    src={product.image || "/c3.jpg"}
                    alt={product.name || "Product"}
                    fill
                    className="object-cover p-4 group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  {product.hasSale && (
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        SALE
                      </div>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToWishlist(product);
                    }}
                    disabled={wishlistLoading[product.id]}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group/heart ${
                      isInWishlist(product.id)
                        ? "bg-red-50 text-red-500"
                        : "bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500"
                    } ${wishlistLoading[product.id] ? "animate-pulse" : ""}`}
                  >
                    <Heart
                      className={`h-4 w-4 transition-all duration-300 ${
                        isInWishlist(product.id)
                          ? "fill-red-500"
                          : "group-hover/heart:fill-red-500"
                      }`}
                    />
                  </button>
                </div>
              </Link>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5"
                        fill={
                          i < Math.round(product.avgRating || 0)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    ({product.reviewCount || 0} reviews)
                  </span>
                </div>

                <Link
                  href={`/products/${product.slug || ""}`}
                  className="block"
                >
                  <h3 className="font-bold text-gray-900 hover:text-primary transition-colors line-clamp-2 text-base leading-tight">
                    {product.name || "Product"}
                  </h3>
                </Link>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary">
                      ₹{product.basePrice || 0}
                    </span>
                    {product.hasSale && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.regularPrice || 0}
                      </span>
                    )}
                  </div>
                  {product.hasSale && (
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(
                        ((product.regularPrice - product.basePrice) /
                          product.regularPrice) *
                          100
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Link
                    href={`/products/${product.slug || ""}`}
                    className="flex-1"
                  >
                    <Button
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                      Shop Now
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-transparent"
                    onClick={(e) => {
                      e.preventDefault();
                      setQuickViewProduct(product);
                      setQuickViewOpen(true);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/products">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            View All Products
            <ArrowRight className="ml-2 h-5 w-5" />
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Genuine Vitals
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;re committed to providing you with the best supplements and
            service
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-primary">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-3 opacity-80">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                {stat.number}
              </div>
              <div className="text-sm font-medium opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get the latest fitness tips, product launches, and exclusive offers
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-primary focus:outline-none"
              required
            />
            <Button
              type="submit"
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                isSubscribed
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              } shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {isSubscribed ? "Subscribed!" : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

// Main Home Component
export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [newProducts, setNewProducts] = useState([]);
  const [newProductsLoading, setNewProductsLoading] = useState(true);
  const [newProductsError, setNewProductsError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, newProductsRes] = await Promise.all([
          fetchApi("/public/products?featured=true&limit=8"),
          fetchApi("/public/categories"),
          fetchApi("/public/products?new=true&limit=4"),
        ]);

        setFeaturedProducts(productsRes?.data?.products || []);
        setCategories(categoriesRes?.data?.categories || []);
        setNewProducts(newProductsRes?.data?.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.message.includes("categories")) {
          setCategoriesError(err?.message || "Failed to fetch categories");
        } else if (err.message.includes("new")) {
          setNewProductsError(err?.message || "Failed to fetch new products");
        } else {
          setError(err?.message || "Failed to fetch data");
        }
      } finally {
        setProductsLoading(false);
        setCategoriesLoading(false);
        setNewProductsLoading(false); // This was missing!
      }
    };

    fetchData();
  }, []);

  return (
    <div className="md:min-h-screen">
      <ModernHero />
      <CategoriesSection
        categories={categories}
        isLoading={categoriesLoading}
        error={categoriesError}
      />

      <VideoSection />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
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

      <CTASection />

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Zap className="h-4 w-4 mr-2" />
              Just Launched
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              New Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our latest supplements and cutting-edge formulations
            </p>
          </div>
          <FeaturedProducts
            products={newProducts}
            isLoading={newProductsLoading}
            error={newProductsError}
          />
        </div>
      </section>

      <WhyChooseUsSection />
      <StatsSection />
      <TestimonialsSection />
    </div>
  );
}
