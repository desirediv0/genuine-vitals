"use client";
import { formatCurrency, fetchApi } from "@/lib/utils";
import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAddProductToCart } from "@/lib/cart-utils";
import ProductQuickView from "./ProductQuickView";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

const ProductCard = ({ product }) => {
  const [wishlistItems, setWishlistItems] = useState({});
  const [isAddingToWishlist, setIsAddingToWishlist] = useState({});
  const [isAddingToCart, setIsAddingToCart] = useState({});
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { addProductToCart } = useAddProductToCart();

  // Fetch wishlist status for this product
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

  // Handle add to cart click
  const handleAddToCart = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingToCart((prev) => ({ ...prev, [product.id]: true }));
    try {
      const result = await addProductToCart(product, 1);
      if (!result.success) {
        return;
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add product to cart");
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = async (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: true }));

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
    } finally {
      setIsAddingToWishlist((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons
    if (e.target.closest("button")) {
      return;
    }
    router.push(`/products/${product.slug}`);
  };

  return (
    <>
      <div
        className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 h-full cursor-pointer"
        onClick={handleCardClick}
      >
        {/* Image Container */}
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={(() => {
              let selectedVariant = null;
              if (product.variants && product.variants.length > 0) {
                selectedVariant = product.variants.reduce((min, v) => {
                  if (!v.weight || typeof v.weight.value !== "number")
                    return min;
                  if (!min || (min.weight && v.weight.value < min.weight.value))
                    return v;
                  return min;
                }, null);
                if (!selectedVariant) selectedVariant = product.variants[0];
              }
              if (
                selectedVariant &&
                selectedVariant.images &&
                selectedVariant.images.length > 0
              ) {
                const primaryImg = selectedVariant.images.find(
                  (img) => img.isPrimary
                );
                if (primaryImg && primaryImg.url)
                  return getImageUrl(primaryImg.url);
                if (selectedVariant.images[0].url)
                  return getImageUrl(selectedVariant.images[0].url);
              }
              if (product.image) return getImageUrl(product.image);
              return "/placeholder.jpg";
            })()}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay with action buttons */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 flex gap-2">
              <button
                onClick={(e) => handleAddToCart(product, e)}
                disabled={isAddingToCart[product.id]}
                className="w-10 h-10 bg-[#2E9692]/90 hover:bg-[#2E9692] rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              >
                {isAddingToCart[product.id] ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <ShoppingCart className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.hasSale && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                SALE
              </div>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={(e) => handleAddToWishlist(product, e)}
            disabled={isAddingToWishlist[product.id]}
            className="absolute top-3 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-200 ${
                wishlistItems[product.id]
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Rating */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
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
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-[#2E9692] transition-colors duration-200 cursor-pointer">
            {product.name}
          </h3>

          {/* Variant info */}
          {(() => {
            let selectedVariant = null;
            if (product.variants && product.variants.length > 0) {
              selectedVariant = product.variants.reduce((min, v) => {
                if (!v.weight || typeof v.weight.value !== "number") return min;
                if (!min || (min.weight && v.weight.value < min.weight.value))
                  return v;
                return min;
              }, null);
              if (!selectedVariant) selectedVariant = product.variants[0];
            }
            if (!selectedVariant) return null;
            const flavor = selectedVariant.flavor?.name;
            const weight = selectedVariant.weight?.value;
            const unit = selectedVariant.weight?.unit;
            if (flavor || (weight && unit)) {
              return (
                <div className="text-xs text-gray-500 mb-3 bg-gray-50 px-2 py-1 rounded-md inline-block">
                  {flavor}
                  {flavor && weight && unit ? " • " : ""}
                  {weight && unit ? `${weight} ${unit}` : ""}
                </div>
              );
            }
            return null;
          })()}

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#2E9692]">
                {formatCurrency(product.basePrice)}
              </span>
              {product.hasSale && (
                <span className="text-gray-400 line-through text-sm">
                  {formatCurrency(product.regularPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Add to cart button and quick view button */}
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product, e);
              }}
              disabled={isAddingToCart[product.id]}
              className="flex-1 bg-gradient-to-r from-[#2E9692] to-[#1a7a76] hover:from-[#1a7a76] hover:to-[#2E9692] text-white font-medium py-2.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50"
            >
              {isAddingToCart[product.id] ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </div>
              )}
            </Button>

            {/* Quick view button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQuickViewOpen(true);
              }}
              className="w-12 h-10 bg-white border border-gray-200 hover:border-[#2E9692] rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <Eye className="h-4 w-4 text-[#2E9692]" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Quick View */}
      <ProductQuickView
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
};

export default ProductCard;
