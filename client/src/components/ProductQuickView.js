"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  X,
  Heart,
  Eye,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAddVariantToCart } from "@/lib/cart-utils";
import { useAuth } from "@/lib/auth-context";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/product-placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function ProductQuickView({ product, open, onOpenChange }) {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();
  const { addVariantToCart } = useAddVariantToCart();
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const { isAuthenticated } = useAuth();

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedFlavor(null);
      setSelectedWeight(null);
      setSelectedVariant(null);
      setQuantity(1);
      setError(null);
      setSuccess(false);
      setProductDetails(null);
      setImgSrc("");
      setAvailableCombinations([]);
      setInitialLoading(true);
      return;
    }

    if (product) {
      setImgSrc(product.image || "/product-placeholder.jpg");
    }
  }, [product, open]);

  // Fetch wishlist status
  useEffect(() => {
    const fetchWishlistStatus = async () => {
      if (!isAuthenticated || typeof window === "undefined") return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });
        const items = response.data.wishlistItems.reduce((acc, item) => {
          acc[item.productId] = true;
          return acc;
        }, {});
        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlistStatus();
  }, [isAuthenticated]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !open) return;

      setLoading(true);
      setInitialLoading(true);
      try {
        const response = await fetchApi(`/public/products/${product.slug}`);
        if (response.data && response.data.product) {
          const productData = response.data.product;
          setProductDetails(productData);

          if (productData.images && productData.images.length > 0) {
            setImgSrc(
              getImageUrl(productData.images[0].url) ||
                getImageUrl(productData.image) ||
                "/product-placeholder.jpg"
            );
          }

          if (productData.variants && productData.variants.length > 0) {
            const combinations = productData.variants
              .filter((v) => v.isActive && v.quantity > 0)
              .map((variant) => ({
                flavorId: variant.flavorId,
                weightId: variant.weightId,
                variant: variant,
              }));

            setAvailableCombinations(combinations);

            if (productData.flavorOptions?.length > 0) {
              const firstFlavor = productData.flavorOptions[0];
              setSelectedFlavor(firstFlavor);

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
            } else if (
              productData.weightOptions?.length > 0 &&
              combinations.length > 0
            ) {
              const firstWeight = productData.weightOptions[0];
              setSelectedWeight(firstWeight);
              const matchingVariant = combinations.find(
                (combo) => combo.weightId === firstWeight.id
              );
              if (matchingVariant) {
                setSelectedVariant(matchingVariant.variant);
              }
            } else if (productData.variants.length > 0) {
              setSelectedVariant(productData.variants[0]);
            }
          }
        } else {
          setError("Product details not available");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProductDetails();
  }, [product, open]);

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

  // Check if a combination is available
  const isCombinationAvailable = (flavorId, weightId) => {
    return availableCombinations.some(
      (combo) => combo.flavorId === flavorId && combo.weightId === weightId
    );
  };

  // Handle flavor change
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);

    const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);

    if (
      productDetails?.weightOptions?.length > 0 &&
      availableWeightIds.length > 0
    ) {
      if (selectedWeight && availableWeightIds.includes(selectedWeight.id)) {
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.flavorId === flavor.id && combo.weightId === selectedWeight.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        const firstAvailableWeight = productDetails.weightOptions.find(
          (weight) => availableWeightIds.includes(weight.id)
        );

        if (firstAvailableWeight) {
          setSelectedWeight(firstAvailableWeight);

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

    if (productDetails?.flavorOptions?.length > 0) {
      const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);
      if (selectedFlavor && availableFlavorIds.includes(selectedFlavor.id)) {
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.weightId === weight.id && combo.flavorId === selectedFlavor.id
        );
        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        const firstAvailableFlavor = productDetails.flavorOptions.find(
          (flavor) => availableFlavorIds.includes(flavor.id)
        );
        if (firstAvailableFlavor) {
          setSelectedFlavor(firstAvailableFlavor);
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
      const matchingVariant = availableCombinations.find(
        (combo) => combo.weightId === weight.id
      );
      if (matchingVariant) {
        setSelectedVariant(matchingVariant.variant);
      }
    }
  };

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
    setAddingToCart(true);
    setError(null);
    setSuccess(false);

    let variantToAdd = selectedVariant;

    if (!variantToAdd && productDetails?.variants?.length > 0) {
      variantToAdd = productDetails.variants[0];
    }

    if (!variantToAdd) {
      setError("No product variant available");
      setAddingToCart(false);
      return;
    }

    try {
      const result = await addVariantToCart(
        variantToAdd,
        quantity,
        productDetails?.name || product?.name
      );
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          onOpenChange(false);
        }, 2000);
      } else {
        setError("Failed to add to cart. Please try again.");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle wishlist
  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      setError("Please login to add items to wishlist");
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (wishlistItems[product.id]) {
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

          setWishlistItems((prev) => ({ ...prev, [product.id]: false }));
        }
      } else {
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setWishlistItems((prev) => ({ ...prev, [product.id]: true }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setError("Failed to update wishlist");
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  // Get the appropriate image to display
  const getDisplayImage = () => {
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      const primaryImage = selectedVariant.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage
        ? primaryImage.url
        : selectedVariant.images[0]?.url;

      return getImageUrl(imageUrl);
    }

    if (displayProduct?.images && displayProduct.images.length > 0) {
      const primaryImage = displayProduct.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage
        ? primaryImage.url
        : displayProduct.images[0]?.url;

      return getImageUrl(imageUrl);
    }

    if (displayProduct?.variants && displayProduct.variants.length > 0) {
      const variantWithImages = displayProduct.variants.find(
        (variant) => variant.images && variant.images.length > 0
      );
      if (variantWithImages) {
        const primaryImage = variantWithImages.images.find(
          (img) => img.isPrimary
        );
        const imageUrl = primaryImage
          ? primaryImage.url
          : variantWithImages.images[0]?.url;

        return getImageUrl(imageUrl);
      }
    }

    if (displayProduct?.image) {
      return getImageUrl(displayProduct.image);
    }

    return imgSrc || "/placeholder.jpg";
  };

  // Format price display
  const getPriceDisplay = () => {
    if (initialLoading || loading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (selectedVariant) {
      if (selectedVariant.salePrice && selectedVariant.salePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#2E9692]">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2E9692]">
          {formatCurrency(selectedVariant.price || 0)}
        </span>
      );
    }

    if (productDetails) {
      if (productDetails.hasSale && productDetails.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#2E9692]">
              {formatCurrency(productDetails.basePrice)}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {formatCurrency(productDetails.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2E9692]">
          {formatCurrency(productDetails.basePrice || 0)}
        </span>
      );
    }

    if (product) {
      if (product.hasSale && product.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[#2E9692]">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xl text-gray-400 line-through">
              {formatCurrency(product.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-[#2E9692]">
          {formatCurrency(product.basePrice || 0)}
        </span>
      );
    }

    return null;
  };

  if (!product) return null;

  const displayProduct = productDetails || product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto p-0 bg-white rounded-2xl border-0 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {displayProduct.name}
          </DialogTitle>
        </div>

        {loading && !productDetails ? (
          <div className="py-16 flex justify-center">
            <div className="w-12 h-12 border-4 border-[#2E9692] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Image */}
            <div className="relative h-auto  bg-white p-8">
              <Image
                src={getDisplayImage()}
                alt={displayProduct.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 450px"
                onError={() => setImgSrc("/product-placeholder.jpg")}
              />

              {/* Sale badge */}

              {/* Action buttons */}
              <div className="absolute top-8 right-4 flex flex-col gap-3">
                <button
                  onClick={handleAddToWishlist}
                  disabled={isAddingToWishlist}
                  className="w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      wishlistItems[product.id]
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 flex flex-col">
              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3 text-green-600" />
                  <span className="font-medium">
                    Item added to cart successfully!
                  </span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 mr-3 text-red-600" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">{getPriceDisplay()}</div>

              {/* Rating */}
              {displayProduct.avgRating > 0 && (
                <div className="flex items-center mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(displayProduct.avgRating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-3 font-medium">
                    ({displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Description */}
              <p className="text-gray-600 text-base mb-8 leading-relaxed">
                {displayProduct.description || "No description available"}
              </p>

              {/* Flavor selection */}
              {productDetails?.flavorOptions &&
                productDetails.flavorOptions.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Flavor
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {productDetails.flavorOptions.map((flavor) => {
                        const availableWeightIds = getAvailableWeightsForFlavor(
                          flavor.id
                        );
                        const isAvailable = availableWeightIds.length > 0;

                        return (
                          <button
                            key={flavor.id}
                            type="button"
                            onClick={() => handleFlavorChange(flavor)}
                            disabled={!isAvailable}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                              selectedFlavor?.id === flavor.id
                                ? "border-[#2E9692] bg-[#2E9692]/10 text-[#2E9692] shadow-md"
                                : isAvailable
                                ? "border-gray-200 hover:border-[#2E9692] hover:bg-[#2E9692]/5"
                                : "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                            }`}
                          >
                            {flavor.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Weight selection */}
              {productDetails?.weightOptions &&
                productDetails.weightOptions.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Weight
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {productDetails.weightOptions.map((weight) => {
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
                            type="button"
                            onClick={() => handleWeightChange(weight)}
                            disabled={!isAvailable}
                            className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                              selectedWeight?.id === weight.id
                                ? "border-[#2E9692] bg-[#2E9692]/10 text-[#2E9692] shadow-md"
                                : isAvailable
                                ? "border-gray-200 hover:border-[#2E9692] hover:bg-[#2E9692]/5"
                                : "border-gray-100 text-gray-400 cursor-not-allowed bg-gray-50"
                            }`}
                          >
                            {weight.value} {weight.unit}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Stock Availability */}
              {selectedVariant && (
                <div className="mb-3 p-4 bg-gray-50 rounded-xl">
                  <span
                    className={`text-sm font-medium flex items-center ${
                      selectedVariant.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        selectedVariant.quantity > 0
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    {selectedVariant.quantity > 0
                      ? `In Stock (${selectedVariant.quantity} available)`
                      : "Out of Stock"}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center w-fit">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="w-12 h-12 rounded-l-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                    disabled={quantity <= 1 || loading}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 h-12 border-t border-b border-gray-300 bg-white flex items-center justify-center font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="w-12 h-12 rounded-r-xl border border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center justify-center"
                    disabled={
                      loading ||
                      (selectedVariant &&
                        selectedVariant.quantity > 0 &&
                        quantity >= selectedVariant.quantity)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex  gap-3 mt-auto">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-[#2E9692] to-[#1a7a76] hover:from-[#1a7a76] hover:to-[#2E9692] text-white font-semibold py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 text-sm"
                  disabled={
                    loading ||
                    addingToCart ||
                    (!selectedVariant &&
                      (!productDetails?.variants ||
                        productDetails.variants.length === 0)) ||
                    (selectedVariant && selectedVariant.quantity < 1)
                  }
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Adding to Cart...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Add to Cart
                    </div>
                  )}
                </Button>

                <Link
                  href={`/products/${displayProduct.slug}`}
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full py-4 border-2 border-gray-200 hover:border-[#2E9692] hover:bg-[#2E9692]/5 text-gray-700 hover:text-[#2E9692] font-semibold rounded-xl transition-all duration-300 text-sm"
                  >
                    <Eye className="h-5 w-5 mr-3" />
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
