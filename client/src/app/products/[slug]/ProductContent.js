"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  Minus,
  Plus,
  AlertCircle,
  ShoppingCart,
  Heart,
  Share2,
  ChevronRight,
  CheckCircle,
  Search,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ReviewSection from "./ReviewSection";
import ProductCarousel from "./ProductCarousel";

export default function ProductContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [selectedShade, setSelectedShade] = useState(null);
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const { addToCart } = useCart();

  // Update main image when variant changes
  useEffect(() => {
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      const primaryImage = selectedVariant.images.find((img) => img.isPrimary);
      setMainImage(primaryImage || selectedVariant.images[0]);
    } else if (product && product.images && product.images.length > 0) {
      const primaryImage = product.images.find((img) => img.isPrimary);
      setMainImage(primaryImage || product.images[0]);
    }
  }, [selectedVariant, product]);

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setInitialLoading(true);
      try {
        const response = await fetchApi(`/public/products/${slug}`);
        const productData = response.data.product;
        setProduct(productData);
        setRelatedProducts(response.data.relatedProducts || []);

        // Set main image
        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        }

        // Extract all available combinations from variants
        if (productData.variants && productData.variants.length > 0) {
          const combinations = productData.variants
            .filter((v) => v.isActive && v.quantity > 0)
            .map((variant) => ({
              flavorId: variant.flavorId,
              weightId: variant.weightId,
              variant: variant,
            }));

          setAvailableCombinations(combinations);

          // Set default flavor and weight if available
          if (
            productData.flavorOptions &&
            productData.flavorOptions.length > 0
          ) {
            const firstFlavor = productData.flavorOptions[0];
            setSelectedFlavor(firstFlavor);

            // Find matching weights for this flavor
            const matchingVariant = combinations.find(
              (combo) => combo.flavorId === firstFlavor.id
            );

            if (matchingVariant && productData.weightOptions) {
              const matchingWeight = productData.weightOptions.find(
                (weight) => weight.id === matchingVariant.weightId
              );

              if (matchingWeight) {
                setSelectedWeight(matchingWeight);
                setSelectedVariant(matchingVariant.variant);
              }
            }
          } else if (productData.variants.length > 0) {
            // If no flavor/weight options but we have variants, select the first one
            setSelectedVariant(productData.variants[0]);
          }
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    if (slug) {
      fetchProductDetails();
    }
  }, [slug]);

  // Get available weights for a specific flavor
  const getAvailableWeightsForFlavor = (flavorId) => {
    const availableWeights = availableCombinations
      .filter((combo) => combo.flavorId === flavorId)
      .map((combo) => combo.weightId);

    return availableWeights;
  };

  // Get available flavors for a specific weight
  const getAvailableFlavorsForWeight = (weightId) => {
    const availableFlavors = availableCombinations
      .filter((combo) => combo.weightId === weightId)
      .map((combo) => combo.flavorId);

    return availableFlavors;
  };

  // Handle flavor change
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);

    // Find available weights for this flavor
    const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);

    if (product?.weightOptions?.length > 0 && availableWeightIds.length > 0) {
      // Use currently selected weight if it's compatible with the new flavor
      if (selectedWeight && availableWeightIds.includes(selectedWeight.id)) {
        // Current weight is compatible, keep it selected
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.flavorId === flavor.id && combo.weightId === selectedWeight.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        // Current weight is not compatible, switch to first available
        const firstAvailableWeight = product.weightOptions.find((weight) =>
          availableWeightIds.includes(weight.id)
        );

        if (firstAvailableWeight) {
          setSelectedWeight(firstAvailableWeight);

          // Find the corresponding variant
          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.flavorId === flavor.id &&
              combo.weightId === firstAvailableWeight.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedWeight(null);
      setSelectedVariant(null);
    }
  };

  // Handle weight change
  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);

    // Find available flavors for this weight
    const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);

    if (product?.flavorOptions?.length > 0 && availableFlavorIds.length > 0) {
      // Use currently selected flavor if it's compatible with the new weight
      if (selectedFlavor && availableFlavorIds.includes(selectedFlavor.id)) {
        // Current flavor is compatible, keep it selected
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.weightId === weight.id && combo.flavorId === selectedFlavor.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        // Current flavor is not compatible, switch to first available
        const firstAvailableFlavor = product.flavorOptions.find((flavor) =>
          availableFlavorIds.includes(flavor.id)
        );

        if (firstAvailableFlavor) {
          setSelectedFlavor(firstAvailableFlavor);

          // Find the corresponding variant
          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.weightId === weight.id &&
              combo.flavorId === firstAvailableFlavor.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedFlavor(null);
      setSelectedVariant(null);
    }
  };

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItems = response.data.wishlistItems || [];
        const inWishlist = wishlistItems.some(
          (item) => item.productId === product.id
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (
      selectedVariant &&
      selectedVariant.quantity > 0 &&
      newQuantity > selectedVariant.quantity
    )
      return;
    setQuantity(newQuantity);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      // If no variant is selected but product has variants, use the first one
      if (product?.variants && product.variants.length > 0) {
        setIsAddingToCart(true);
        setCartSuccess(false);

        try {
          await addToCart(product.variants[0].id, quantity);
          setCartSuccess(true);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setCartSuccess(false);
          }, 3000);
        } catch (err) {
          console.error("Error adding to cart:", err);
        } finally {
          setIsAddingToCart(false);
        }
      }
      return;
    }

    setIsAddingToCart(true);
    setCartSuccess(false);

    try {
      await addToCart(selectedVariant.id, quantity);
      setCartSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setCartSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Render product images
  const renderImages = () => {
    // Determine which images to show based on selected variant
    let imagesToShow = [];
    let fallbackImage = "/c3.jpg";

    // Priority 1: Selected variant images
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      imagesToShow = selectedVariant.images;
    }
    // Priority 2: Product-level images
    else if (product && product.images && product.images.length > 0) {
      imagesToShow = product.images;
    }

    // If no images available, show placeholder
    if (imagesToShow.length === 0) {
      return (
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={fallbackImage}
            alt={product?.name || "Product"}
            fill
            className="object-contain p-4"
            priority
          />
        </div>
      );
    }

    // If there's only one image
    if (imagesToShow.length === 1) {
      return (
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(imagesToShow[0].url)}
            alt={product?.name || "Product"}
            fill
            className="object-contain p-4"
            priority
          />
        </div>
      );
    }

    // Determine main image - use primary image if available, otherwise first image
    const currentMainImage =
      mainImage || imagesToShow.find((img) => img.isPrimary) || imagesToShow[0];

    // Main image display with thumbnails
    return (
      <div className="space-y-4">
        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(currentMainImage.url)}
            alt={product?.name || "Product"}
            fill
            className="object-contain p-4"
            priority
          />
        </div>

        {/* Thumbnail grid for multiple images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {imagesToShow.map((image, index) => (
            <div
              key={`${selectedVariant?.id || "product"}-${image.id || index}`}
              className={`relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:border-[#2E9692]/50 ${
                currentMainImage?.url === image.url ||
                currentMainImage?.id === image.id
                  ? "border-[#2E9692] shadow-md"
                  : "border-transparent"
              }`}
              onClick={() => setMainImage(image)}
            >
              <Image
                src={getImageUrl(image.url)}
                alt={`${product.name} - Image ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Get image URL helper
  const getImageUrl = (image) => {
    if (!image) return "/images/product-placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
  };

  // Format price display
  const getPriceDisplay = () => {
    // Show loading state while initial data is being fetched
    if (initialLoading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    // If we have a selected variant, use its price
    if (selectedVariant) {
      if (selectedVariant.salePrice && selectedVariant.salePrice > 0) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }

      return (
        <span className="text-3xl font-bold">
          {formatCurrency(selectedVariant.price || 0)}
        </span>
      );
    }

    // Fallback to product base price if no variant is selected
    if (product) {
      if (product.hasSale && product.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(product.regularPrice || 0)}
            </span>
          </div>
        );
      }

      return (
        <span className="text-3xl font-bold">
          {formatCurrency(product.basePrice || 0)}
        </span>
      );
    }

    return null;
  };

  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        // Get wishlist to find the item ID
        const wishlistResponse = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );

        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Display loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 flex flex-col items-center text-center">
          <AlertCircle className="text-red-500 h-12 w-12 mb-4" />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Error Loading Product
          </h2>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/products">
            <Button className="px-6">
              <ChevronRight className="mr-2 h-4 w-4" /> Browse Other Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200 flex flex-col items-center text-center">
          <AlertCircle className="text-yellow-500 h-12 w-12 mb-4" />
          <h2 className="text-2xl font-semibold text-yellow-700 mb-2">
            Product Not Found
          </h2>
          <p className="text-yellow-600 mb-6">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products">
            <Button className="px-6">
              <ChevronRight className="mr-2 h-4 w-4" /> Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Updated render code for the product image carousel
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm mb-8">
        <Link
          href="/"
          className="text-gray-500 hover:text-[#2E9692] transition-colors"
        >
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link
          href="/products"
          className="text-gray-500 hover:text-[#2E9692] transition-colors"
        >
          Products
        </Link>
        {product?.categories?.length > 0 && product.categories[0].category && (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            <Link
              href={`/category/${product.categories[0].category.slug}`}
              className="text-gray-500 hover:text-[#2E9692] transition-colors"
            >
              {product.categories[0].category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-[#2E9692] font-medium">{product?.name}</span>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="relative">
          {loading ? (
            <div className="aspect-square w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl animate-pulse"></div>
          ) : error ? (
            <div className="aspect-square w-full bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center border border-red-200">
              <div className="text-center p-6">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="relative">
              {renderImages()}

              {/* Floating badge for premium quality */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl">
                ✓ Premium Quality
              </div>

              {/* Sale badge if applicable */}
              {selectedVariant?.salePrice &&
                selectedVariant?.salePrice < selectedVariant?.price && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl animate-pulse">
                    SALE
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Right Column - Product Details */}
        <div className="flex flex-col space-y-6">
          {/* Brand name if available */}
          {product.brand && (
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full w-fit">
              {product.brand}
            </div>
          )}

          {/* Product name */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Category badge */}
            {product?.categories?.length > 0 &&
              product.categories[0].category && (
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2E9692]/10 to-[#D5DA2A]/10 text-[#2E9692] text-sm font-bold rounded-full border border-[#2E9692]/20">
                  <span className="mr-2">🏷️</span>
                  {product.categories[0].category.name}
                </div>
              )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
            <div className="flex text-[#D5DA2A]">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5"
                  fill={
                    i < Math.round(product.avgRating || 0)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {product.avgRating
                ? `${product.avgRating} out of 5 (${product.reviewCount} reviews)`
                : "No reviews yet - Be the first to review!"}
            </span>
          </div>

          {/* Price */}
          <div className="p-6 bg-gradient-to-r from-[#2E9692]/5 to-[#D5DA2A]/5 rounded-2xl border border-[#2E9692]/20">
            <div className="flex items-center justify-between">
              {getPriceDisplay()}
              {selectedVariant?.salePrice &&
                selectedVariant?.salePrice < selectedVariant?.price && (
                  <div className="bg-green-100 text-green-800 text-sm font-bold px-4 py-2 rounded-full">
                    Save{" "}
                    {Math.round(
                      ((selectedVariant.price - selectedVariant.salePrice) /
                        selectedVariant.price) *
                        100
                    )}
                    %
                  </div>
                )}
            </div>

            {/* Stock status */}
            {selectedVariant && (
              <div className="mt-3 flex items-center">
                {selectedVariant.quantity > 0 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">
                      {selectedVariant.quantity > 10
                        ? "In Stock"
                        : `Only ${selectedVariant.quantity} left!`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Short Description */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Product Highlights
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {product.shortDescription ||
                product.description?.substring(0, 200)}
              {product.description?.length > 200 &&
                !product.shortDescription &&
                "..."}
            </p>
          </div>

          {/* Flavor Selection for supplements */}
          {product.flavorOptions && product.flavorOptions.length > 0 && (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">🍓</span>
                Choose Your Flavor
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.flavorOptions.map((flavor) => {
                  // Check if this flavor has any available combinations
                  const availableWeightIds = getAvailableWeightsForFlavor(
                    flavor.id
                  );
                  const isAvailable = availableWeightIds.length > 0;

                  return (
                    <button
                      key={flavor.id}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        selectedFlavor?.id === flavor.id
                          ? "border-[#2E9692] bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white shadow-lg transform scale-105"
                          : isAvailable
                          ? "border-gray-200 hover:border-[#2E9692]/50 hover:bg-gray-50 hover:scale-102"
                          : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => handleFlavorChange(flavor)}
                      disabled={!isAvailable}
                    >
                      {flavor.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weight Selection */}
          {product.weightOptions && product.weightOptions.length > 0 && (
            <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">⚖️</span>
                Select Weight/Size
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {product.weightOptions.map((weight) => {
                  // Check if this weight has any available combinations with the selected flavor
                  const availableFlavorIds = getAvailableFlavorsForWeight(
                    weight.id
                  );
                  const isAvailable = selectedFlavor
                    ? availableCombinations.some(
                        (combo) =>
                          combo.flavorId === selectedFlavor.id &&
                          combo.weightId === weight.id
                      )
                    : availableFlavorIds.length > 0;

                  return (
                    <button
                      key={weight.id}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        selectedWeight?.id === weight.id
                          ? "border-[#2E9692] bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white shadow-lg transform scale-105"
                          : isAvailable
                          ? "border-gray-200 hover:border-[#2E9692]/50 hover:bg-gray-50 hover:scale-102"
                          : "border-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                      }`}
                      onClick={() => handleWeightChange(weight)}
                      disabled={!isAvailable}
                    >
                      {weight.display || `${weight.value}${weight.unit}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {cartSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-md flex items-center border border-green-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Item successfully added to your cart!
            </div>
          )}

          <div className="mb-4">
            {selectedVariant && selectedVariant.quantity > 0 && (
              <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                In Stock ({selectedVariant.quantity} available)
              </div>
            )}
            {selectedVariant && selectedVariant.quantity === 0 && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                Out of stock
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📦</span>
              Quantity
            </h3>
            <div className="flex items-center justify-center w-fit mx-auto">
              <button
                className="p-3 bg-gray-100 hover:bg-[#2E9692] hover:text-white rounded-l-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-[#2E9692]"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || isAddingToCart}
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="px-8 py-3 border-t-2 border-b-2 border-gray-200 min-w-[4rem] text-center font-bold text-lg bg-gray-50">
                {quantity}
              </span>
              <button
                className="p-3 bg-gray-100 hover:bg-[#2E9692] hover:text-white rounded-r-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-[#2E9692]"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  (selectedVariant &&
                    selectedVariant.quantity > 0 &&
                    quantity >= selectedVariant.quantity) ||
                  isAddingToCart
                }
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <Button
              className="w-full flex items-center justify-center gap-3 py-6 text-lg font-bold bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] hover:from-[#2E9692]/90 hover:to-[#D5DA2A]/90 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              size="lg"
              onClick={handleAddToCart}
              disabled={
                isAddingToCart ||
                (selectedVariant && selectedVariant.quantity < 1) ||
                (!selectedVariant &&
                  (!product?.variants ||
                    product.variants.length === 0 ||
                    product.variants[0].quantity < 1))
              }
            >
              {isAddingToCart ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-6 w-6" />
                  Add to Cart
                </>
              )}
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className={`py-4 rounded-2xl border-2 font-semibold transition-all duration-300 ${
                  isInWishlist
                    ? "text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                    : "border-gray-200 text-gray-700 hover:border-[#2E9692] hover:text-[#2E9692] hover:bg-[#2E9692]/5"
                }`}
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isInWishlist ? "fill-current" : ""
                  }`}
                />
                {isInWishlist ? "Wishlisted" : "Add to Wishlist"}
              </Button>

              <Button
                variant="outline"
                className="py-4 rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-[#2E9692] hover:text-[#2E9692] hover:bg-[#2E9692]/5 font-semibold transition-all duration-300"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Metadata */}
          <div className="border-t border-gray-200 pt-5 space-y-3 text-sm">
            {selectedVariant && selectedVariant.sku && (
              <div className="flex">
                <span className="font-medium w-32 text-gray-700">SKU:</span>
                <span className="text-gray-600">{selectedVariant.sku}</span>
              </div>
            )}

            {product.category && (
              <div className="flex">
                <span className="font-medium w-32 text-gray-700">
                  Category:
                </span>
                <Link
                  href={`/category/${product.category?.slug}`}
                  className="text-primary hover:underline"
                >
                  {product.category?.name}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16 mt-5">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
          <div className="flex overflow-x-auto gap-2">
            <button
              className={`px-6 py-4 font-bold text-sm rounded-xl transition-all duration-300 ${
                activeTab === "description"
                  ? "bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-[#2E9692] hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("description")}
            >
              📝 Description
            </button>
            <button
              className={`px-6 py-4 font-bold text-sm rounded-xl transition-all duration-300 ${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-[#2E9692] hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              ⭐ Reviews ({product.reviewCount || 0})
            </button>
            <button
              className={`px-6 py-4 font-bold text-sm rounded-xl transition-all duration-300 ${
                activeTab === "shipping"
                  ? "bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-[#2E9692] hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("shipping")}
            >
              🚚 Shipping & Returns
            </button>
          </div>
        </div>

        <div className="py-8">
          {activeTab === "description" && (
            <div className="prose max-w-none">
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.isSupplement && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="bg-primary/5 p-6 rounded-md border border-primary/10">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-3">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold">Pure Quality</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Premium ingredients with no unnecessary fillers or
                        harmful additives
                      </p>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-md border border-primary/10">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-3">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold">Lab Tested</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Every batch is tested for purity and potency to ensure
                        maximum results
                      </p>
                    </div>

                    <div className="bg-primary/5 p-6 rounded-md border border-primary/10">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 mr-3">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold">Expert Formulated</h3>
                      </div>
                      <p className="text-sm text-gray-600">
                        Developed by fitness experts to maximize your
                        performance and results
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {product.directions && (
                <div className="mt-8 p-6 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="text-xl font-bold mb-4 text-primary">
                    Directions for Use
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.directions}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && <ReviewSection product={product} />}

          {activeTab === "shipping" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Shipping Information
                </h3>
                <ul className="space-y-4">
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Delivery Time</p>
                    <p className="text-gray-600 text-sm">
                      3-5 business days (standard shipping)
                    </p>
                  </li>
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Free Shipping</p>
                    <p className="text-gray-600 text-sm">
                      Free shipping on all orders above ₹999
                    </p>
                  </li>
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Express Delivery</p>
                    <p className="text-gray-600 text-sm">
                      1-2 business days (₹199 extra)
                    </p>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4">Return Policy</h3>
                <ul className="space-y-4">
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Return Window</p>
                    <p className="text-gray-600 text-sm">
                      30 days from the date of delivery
                    </p>
                  </li>
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Condition</p>
                    <p className="text-gray-600 text-sm">
                      Product must be unused and in original packaging
                    </p>
                  </li>
                  <li className="pb-4 border-b border-gray-100">
                    <p className="font-medium mb-1">Process</p>
                    <p className="text-gray-600 text-sm">
                      Initiate return from your account and we&apos;ll arrange
                      pickup
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recently Viewed section would go here */}

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-gradient-to-r from-[#2E9692]/10 to-[#D5DA2A]/10 px-6 py-3 rounded-full mb-6">
              <span className="text-[#2E9692] font-bold text-sm uppercase tracking-wide">
                🔗 Related Products
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              You might also like
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover more amazing products from our premium collection
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => {
              // Get the primary image from the first available variant
              const getRelatedProductImage = () => {
                if (
                  relatedProduct.variants &&
                  relatedProduct.variants.length > 0
                ) {
                  // Find first variant with images
                  const variantWithImages = relatedProduct.variants.find(
                    (variant) => variant.images && variant.images.length > 0
                  );

                  if (variantWithImages) {
                    // Get primary image or first image
                    const primaryImage = variantWithImages.images.find(
                      (img) => img.isPrimary
                    );
                    return getImageUrl(
                      (primaryImage || variantWithImages.images[0]).url
                    );
                  }
                }
                return "/c3.jpg"; // Fallback image
              };

              return (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-[#2E9692]/30 group transform hover:scale-[1.02]"
                >
                  <div className="relative h-64 w-full bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={getRelatedProductImage()}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />

                    {relatedProduct.hasSale && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          SALE
                        </div>
                      </div>
                    )}

                    {/* Floating elements */}
                    <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute bottom-6 right-8 w-1 h-1 bg-white/30 rounded-full animate-bounce delay-300 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2E9692]/5 to-[#D5DA2A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div className="flex text-[#D5DA2A]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5"
                            fill={
                              i < Math.round(relatedProduct.avgRating || 0)
                                ? "currentColor"
                                : "none"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-2 font-medium">
                        ({relatedProduct.reviewCount || 0} reviews)
                      </span>
                    </div>

                    <h3 className="font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-[#2E9692] transition-colors duration-300 leading-tight">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        {relatedProduct.hasSale ? (
                          <div className="flex items-baseline gap-2">
                            <span className="font-black text-[#2E9692] text-lg">
                              {formatCurrency(relatedProduct.basePrice)}
                            </span>
                            <span className="text-gray-500 line-through text-sm">
                              {formatCurrency(relatedProduct.regularPrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="font-black text-[#2E9692] text-lg">
                            {formatCurrency(relatedProduct.basePrice)}
                          </span>
                        )}
                      </div>

                      {relatedProduct.hasSale && (
                        <div className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                          {Math.round(
                            ((relatedProduct.regularPrice -
                              relatedProduct.basePrice) /
                              relatedProduct.regularPrice) *
                              100
                          )}
                          % OFF
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#2E9692]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gradient-to-br from-[#D5DA2A]/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
