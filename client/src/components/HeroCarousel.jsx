"use client";

import { useState, useEffect } from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

import { useRouter } from "next/navigation";
import { bg1, bg1sm } from "@/assets";

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [api, setApi] = useState(null);
  const [autoplay, setAutoplay] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();


  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await fetchApi("/public/banners");

        // Handle response: fetchApi returns { success, data: { banners: [...] }, message }
        if (
          response &&
          response.success &&
          response.data &&
          response.data.banners
        ) {
          const bannersArray = response.data.banners;

          // Only set banners if array has items (length > 0)
          if (Array.isArray(bannersArray) && bannersArray.length > 0) {
            setBanners(bannersArray);
          } else {
            // Empty array from API - use fallback
            setBanners([]);
          }
        } else {
          // No banners in response - use fallback
          setBanners([]);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
        // On error, set empty array so fallback slides will show
        setBanners([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const fallbackSlides = [
    {
      ctaLink: "/category/protein",
      img: bg1,
      smimg: bg1sm,
      title: "Protein Collection",
      subtitle: "Build Muscle Faster",
    },
  ];
  const slides =
    banners.length > 0
      ? banners.map((banner) => ({
        ctaLink: banner.link || "/products",
        img: banner.desktopImage,
        smimg: banner.mobileImage,
        title: banner.title || "",
        subtitle: banner.subtitle || "",
      }))
      : fallbackSlides;

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle autoplay functionality
  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoplay]);

  // Update current slide index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);


  const handleSlideClick = (ctaLink) => {
    if (ctaLink) {
      router.push(ctaLink);
    } else {
      router.push("/products");
    }
  };


  if (isLoading) {
    return (
      <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
        <div className="relative overflow-hidden w-full aspect-[9/16] md:aspect-[16/9] bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <p className="text-gray-700 font-semibold text-lg mb-1">
                  Loading ....
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Mobile: Smaller height, Desktop: Larger height */}
      <div className="relative overflow-hidden">
        <Carousel
          setApi={setApi}
          className="h-full w-full"
          opts={{
            loop: true,
            align: "start",
          }}
        >
          <CarouselContent className="h-full">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="h-full p-0">
                <div
                  className="relative h-[180px] sm:h-[250px] md:h-[350px] w-full cursor-pointer group overflow-hidden"
                  onClick={() => handleSlideClick(slide.ctaLink)}
                >
                  {/* Background Image */}
                  <Image
                    src={isMobile ? slide.smimg : slide.img}
                    alt={slide.title || "Hero banner"}
                    fill
                    className="object-cover md:object-fill transition-transform duration-700"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Controls - Better positioned and sized */}
          <CarouselPrevious className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-10 sm:w-10 md:h-12 md:w-12 z-30 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />
          <CarouselNext className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-10 sm:w-10 md:h-12 md:w-12 z-30 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" />

          {/* Dot Indicators - Better responsive sizing */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2 h-2  rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Autoplay Toggle - Better positioned */}
          <div className="absolute top-4 right-4 z-30">
            <Button
              variant="outline"
              size="sm"
              className="h-5 w-5  bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm"
              onClick={() => setAutoplay(!autoplay)}
              aria-label={autoplay ? "Pause slideshow" : "Play slideshow"}
            >
              {autoplay ? (
                <div className="w-2 h-2 flex space-x-0.5">
                  <div className="w-1 h-full bg-current"></div>
                  <div className="w-1 h-full bg-current"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-t-[4px] sm:border-t-[6px] border-t-transparent border-b-[4px] sm:border-b-[6px] border-b-transparent border-l-[6px] sm:border-l-[8px] border-l-current ml-0.5"></div>
              )}
            </Button>
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default HeroCarousel;
