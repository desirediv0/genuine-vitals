"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { fetchApi } from "@/lib/utils";
import Image from "next/image";
import { Heart, Star, ShoppingBag, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function WishlistPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [error, setError] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/wishlist");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;

      setLoadingItems(true);
      setError("");

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        setWishlistItems(response.data.wishlistItems || []);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        setError("Failed to load your wishlist. Please try again later.");
      } finally {
        setLoadingItems(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  // Remove item from wishlist
  const removeFromWishlist = async (wishlistItemId) => {
    try {
      await fetchApi(`/users/wishlist/${wishlistItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Remove the item from state
      setWishlistItems((current) =>
        current.filter((item) => item.id !== wishlistItemId)
      );
      toast.success("Item removed from wishlist");
    } catch (error) {
      console.error("Failed to remove item from wishlist:", error);
      toast.error("Failed to remove item. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E9692]"></div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="container mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Wishlist</h1>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-4 animate-pulse"
                >
                  <div className="h-64 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#2E9692]/10 mb-6">
                <Heart className="h-10 w-10 text-[#2E9692]" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">
                Your Wishlist is Empty
              </h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Save your favorite items to your wishlist for easy access later.
                Browse our products and add items you love!
              </p>
              <Link href="/products">
                <Button
                  size="lg"
                  className="gap-2 bg-[#2E9692] hover:bg-[#2E9692]/90"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Explore Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden group"
                >
                  <div className="relative">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    </Link>

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-red-500"
                          onClick={() => removeFromWishlist(product.id)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
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
                        <span className="text-xs text-gray-500 ml-2">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                      {product.flavors > 1 && (
                        <span className="text-xs bg-[#2E9692]/10 text-[#2E9692] px-2 py-1 rounded-full">
                          {product.flavors} variants
                        </span>
                      )}
                    </div>

                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="font-medium text-lg mb-2 line-clamp-2 hover:text-[#2E9692] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </ClientOnly>
  );
}
