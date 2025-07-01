"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { motion } from "framer-motion";
import Link from "next/link";

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
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!open) {
      // Reset everything when dialog closes
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
      // Set initial image when product changes
      setImgSrc(product.image || "/c3.jpg");
    }
  }, [product, open]);

  // Update image when variant changes
  useEffect(() => {
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      const primaryImage = selectedVariant.images.find((img) => img.isPrimary);
      const imageUrl = primaryImage
        ? primaryImage.url
        : selectedVariant.images[0].url;
      setImgSrc(imageUrl);
    }
  }, [selectedVariant]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !open) return;

      setLoading(true);
      setInitialLoading(true);
      try {
        // Fetch detailed product info
        const response = await fetchApi(`/public/products/${product.slug}`);
        if (response.data && response.data.product) {
          const productData = response.data.product;
          setProductDetails(productData);

          // Update image if available
          if (productData.images && productData.images.length > 0) {
            setImgSrc(
              productData.images[0].url ||
                productData.image ||
                "/product-placeholder.jpg"
            );
          }

          // Extract all available combinations from variants
          if (productData.variants && productData.variants.length > 0) {
            const combinations = productData.variants
              .filter((v) => v.isActive)
              .map((variant) => ({
                flavorId: variant.flavorId,
                weightId: variant.weightId,
                variant: variant,
              }));

            setAvailableCombinations(combinations);

            // Set default selections
            if (productData.flavorOptions?.length > 0) {
              const firstAvailableFlavor = productData.flavorOptions[0];
              setSelectedFlavor(firstAvailableFlavor);

              // Find matching weights for this flavor
              const matchingVariant = combinations.find(
                (combo) => combo.flavorId === firstAvailableFlavor.id
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
              // If no flavor/weight options but variants exist, use the first variant
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
    const combo = availableCombinations.find(
      (combo) => combo.flavorId === flavorId && combo.weightId === weightId
    );
    return combo && combo.variant.quantity > 0;
  };

  // Get stock status object for variant
  const getStockStatus = (variant) => {
    if (!variant) return { text: "Select options", color: "gray" };
    if (variant.quantity <= 0) return { text: "Out of stock", color: "red" };
    if (variant.quantity <= 5) return { text: "Low stock", color: "orange" };
    return { text: "In stock", color: "green" };
  };

  // Handle flavor change
  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
    setQuantity(1); // Reset quantity when variant changes

    // Find available weights for this flavor
    const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);

    if (
      productDetails?.weightOptions?.length > 0 &&
      availableWeightIds.length > 0
    ) {
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
        const firstAvailableWeight = productDetails.weightOptions.find(
          (weight) => availableWeightIds.includes(weight.id)
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
    setQuantity(1); // Reset quantity when variant changes

    // Find available flavors for this weight
    const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);

    if (
      productDetails?.flavorOptions?.length > 0 &&
      availableFlavorIds.length > 0
    ) {
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
        const firstAvailableFlavor = productDetails.flavorOptions.find(
          (flavor) => availableFlavorIds.includes(flavor.id)
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

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (selectedVariant && newQuantity > selectedVariant.quantity) return;
    setQuantity(newQuantity);
  };

  // Handle quantity direct input
  const handleQuantityInput = (e) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) return setQuantity(1);
    if (selectedVariant && value > selectedVariant.quantity) {
      return setQuantity(selectedVariant.quantity);
    }
    setQuantity(value);
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    setAddingToCart(true);
    setError(null);
    setSuccess(false);

    // If no variant is selected but product has variants, use the first one
    let variantToAdd = selectedVariant;

    if (!variantToAdd && productDetails?.variants?.length > 0) {
      variantToAdd = productDetails.variants[0];
    }

    if (!variantToAdd) {
      setError("Please select product options");
      setAddingToCart(false);
      return;
    }

    if (variantToAdd.quantity < 1) {
      setError("This product is out of stock");
      setAddingToCart(false);
      return;
    }

    try {
      await addToCart(variantToAdd.id, quantity);
      setSuccess(true);

      // Auto close after success notification
      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  // Format price display
  const getPriceDisplay = () => {
    // Show loading state while initial data is being fetched
    if (initialLoading || loading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    // If we have a selected variant, show its price
    if (selectedVariant) {
      if (selectedVariant.salePrice && selectedVariant.salePrice > 0) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(selectedVariant.salePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(selectedVariant.price)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(selectedVariant.price || 0)}
        </span>
      );
    }

    // If no variant but product details available, show base price
    if (productDetails) {
      if (productDetails.hasSale && productDetails.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(productDetails.basePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(productDetails.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(productDetails.basePrice || 0)}
        </span>
      );
    }

    // Fallback to product from props if no details fetched yet
    if (product) {
      if (product.hasSale && product.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-lg text-gray-500 line-through">
              {formatCurrency(product.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-2xl font-bold">
          {formatCurrency(product.basePrice || 0)}
        </span>
      );
    }

    return null;
  };

  if (!product) return null;

  // Use the detailed product info if available, otherwise fall back to the basic product
  const displayProduct = productDetails || product;

  // Get stock status for the current variant
  const stockStatus = getStockStatus(selectedVariant);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {displayProduct?.slug ? (
              <Link
                href={`/products/${displayProduct.slug}`}
                className="hover:text-primary"
              >
                {displayProduct.name}
              </Link>
            ) : (
              <span>{displayProduct?.name}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square md:sticky md:top-0 overflow-hidden rounded-xl bg-gray-100">
            <div className="w-full h-full relative group">
              <Image
                src={imgSrc}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#2E9692]/20 to-[#D5DA2A]/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6 md:pb-8">
            <div className="space-y-4">
              {getPriceDisplay()}

              {/* Stock Status */}
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${stockStatus.color}-100 text-${stockStatus.color}-800`}
              >
                <div
                  className={`w-2 h-2 mr-2 rounded-full bg-${stockStatus.color}-500`}
                />
                {stockStatus.text}
                {selectedVariant && selectedVariant.quantity > 0 && (
                  <span className="ml-1 text-gray-500">
                    ({selectedVariant.quantity} available)
                  </span>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant Selection */}
            {productDetails?.flavorOptions &&
              productDetails.flavorOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Flavor</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {productDetails.flavorOptions.map((flavor) => {
                      const isAvailable = selectedWeight
                        ? isCombinationAvailable(flavor.id, selectedWeight.id)
                        : availableCombinations.some(
                            (combo) => combo.flavorId === flavor.id
                          );

                      return (
                        <Button
                          key={flavor.id}
                          variant={
                            selectedFlavor?.id === flavor.id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleFlavorChange(flavor)}
                          disabled={!isAvailable}
                          className={`rounded-lg justify-start h-auto py-3 ${
                            !isAvailable ? "opacity-50" : ""
                          }`}
                        >
                          {flavor.name}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Weight Selection */}
            {productDetails?.weightOptions &&
              productDetails.weightOptions.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Weight</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {productDetails.weightOptions.map((weight) => {
                      const isAvailable = selectedFlavor
                        ? isCombinationAvailable(selectedFlavor.id, weight.id)
                        : availableCombinations.some(
                            (combo) => combo.weightId === weight.id
                          );

                      return (
                        <Button
                          key={weight.id}
                          variant={
                            selectedWeight?.id === weight.id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handleWeightChange(weight)}
                          disabled={!isAvailable}
                          className={`rounded-lg justify-start h-auto py-3 ${
                            !isAvailable ? "opacity-50" : ""
                          }`}
                        >
                          {weight.value} {weight.unit}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center rounded-lg border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={
                      quantity <= 1 ||
                      !selectedVariant ||
                      selectedVariant.quantity < 1
                    }
                    className="h-10 rounded-l-lg border-r hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityInput}
                    className="w-16 text-center focus:outline-none"
                    min="1"
                    max={selectedVariant?.quantity || 1}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      !selectedVariant ||
                      selectedVariant.quantity < 1 ||
                      quantity >= selectedVariant.quantity
                    }
                    className="h-10 rounded-r-lg border-l hover:bg-gray-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {selectedVariant && selectedVariant.quantity > 0 && (
                  <span className="text-sm text-gray-500">
                    Max: {selectedVariant.quantity}
                  </span>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={
                addingToCart ||
                !selectedVariant ||
                selectedVariant.quantity < 1 ||
                quantity < 1
              }
              className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-[#2E9692] to-[#D5DA2A] text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {addingToCart ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Adding to Cart...</span>
                </div>
              ) : success ? (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Added to Cart</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {selectedVariant ? "Add to Cart" : "Select Options"}
                  </span>
                </div>
              )}
            </motion.button>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
