"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Loader2,
  ArrowLeft,
  CreditCard,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.png";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

// Cart item component to optimize re-renders
const CartItem = React.memo(
  ({ item, onUpdateQuantity, onRemove, isLoading }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-6 mb-4"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Product Image */}
          <div className="relative h-24 w-24 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden flex-shrink-0 border">
            <Image
              src={getImageUrl(item.image || item.product?.image)}
              alt={item.productName || item.product?.name}
              fill
              className="object-contain p-2"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <Link
                  href={`/products/${item.productSlug || item.product?.slug}`}
                  className="font-semibold text-gray-900 hover:text-primary transition-colors text-lg"
                >
                  {item.productName || item.product?.name}
                </Link>
                <div className="text-sm text-gray-600 mt-1">
                  {item.variantName ||
                    `${item.variant?.flavor?.name || ""} ${
                      item.variant?.weight?.value || ""
                    }${item.variant?.weight?.unit || ""}`}
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </div>
                <div className="text-sm text-gray-500">per item</div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    disabled={isLoading || item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 bg-gray-50 font-medium min-w-[60px] text-center">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin inline" />
                    ) : (
                      item.quantity
                    )}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
                    className="px-3 py-2 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    disabled={isLoading}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {formatCurrency(item.subtotal)}
                  </div>
                  <div className="text-sm text-gray-500">subtotal</div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                  aria-label="Remove item"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);
CartItem.displayName = "CartItem";

export default function CartPage() {
  const {
    cart,
    loading,
    cartItemsLoading,
    error,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    couponLoading,
    getCartTotals,
    mergeProgress,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const router = useRouter();

  // Use useCallback to memoize handlers
  const handleQuantityChange = useCallback(
    async (cartItemId, currentQuantity, change) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity < 1) return;

      try {
        await updateCartItem(cartItemId, newQuantity);
        toast.success("Cart updated successfully");
      } catch (err) {
        console.error("Error updating quantity:", err);
        toast.error("Failed to update cart");
      }
    },
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId) => {
      try {
        await removeFromCart(cartItemId);
        toast.success("Item removed from cart");
      } catch (err) {
        console.error("Error removing item:", err);
        toast.error("Failed to remove item");
      }
    },
    [removeFromCart]
  );

  const handleClearCart = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        toast.success("Cart has been cleared");
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Failed to clear cart");
      }
    }
  }, [clearCart]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();

      if (!couponCode.trim()) {
        setCouponError("Please enter a coupon code");
        return;
      }

      setCouponError("");

      try {
        await applyCoupon(couponCode);
        setCouponCode("");
        toast.success("Coupon applied successfully");
      } catch (err) {
        setCouponError(err.message || "Invalid coupon code");
        toast.error(err.message || "Invalid coupon code");
      }
    },
    [couponCode, applyCoupon]
  );

  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  }, [removeCoupon]);

  // Memoize cart totals to prevent re-renders
  const totals = useMemo(() => getCartTotals(), [getCartTotals, cart, coupon]);

  const handleCheckout = useCallback(() => {
    // Ensure minimum amount is 1
    const calculatedAmount = totals.subtotal - totals.discount;
    if (calculatedAmount < 1) {
      toast.info("Minimum order amount is ₹1");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=checkout");
    } else {
      router.push("/checkout");
    }
  }, [isAuthenticated, router, totals]);

  // Display loading state
  if (loading && (!cart.items || cart.items.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Shop
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Display empty cart - but not when there's an error
  if ((!cart.items || cart.items.length === 0) && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Shop
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
            <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100 max-w-md mx-auto">
              <div className="inline-flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-full mb-6">
                <ShoppingBag className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
              <Link href="/products">
                <Button size="lg" className="gap-2 px-8 py-3">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Shop
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            </div>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Guest cart notice */}
          {!isAuthenticated && cart.items.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-primary/10 to-primary/10 border border-primary p-8 rounded-2xl flex items-start mb-8 shadow-sm"
            >
              <div className="flex-shrink-0 mr-6">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Guest Shopping Cart
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">
                  You&apos;re currently shopping as a guest. To complete your
                  purchase and save your cart items for future visits, please
                  log in to your account.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/login?redirect=cart">
                    <Button className="bg-gradient-to-r from-primary to-primary hover:from-primary/50 hover:to-primary/90 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                      Log In to Continue
                    </Button>
                  </Link>
                  <Link href="/register?redirect=cart">
                    <Button
                      variant="outline"
                      className="border-2 border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-semibold px-8 py-3 rounded-xl transition-all duration-200"
                    >
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl flex items-start shadow-sm"
            >
              <AlertCircle className="text-red-500 mt-1 mr-4 flex-shrink-0 h-6 w-6" />
              <div>
                <p className="text-red-700 font-semibold text-lg">Cart Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Show merge progress */}
          {mergeProgress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl flex items-start shadow-sm"
            >
              <Loader2 className="text-primary mt-1 mr-4 flex-shrink-0 h-6 w-6 animate-spin" />
              <div>
                <p className="text-blue-700 font-semibold text-lg">
                  Merging Cart
                </p>
                <p className="text-blue-600">{mergeProgress}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart Items ({cart.items.length})
                  </h2>
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="text-red-500 border-red-200 hover:bg-red-50 gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Clear Cart
                  </Button>
                </div>

                {/* Cart Items */}
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={handleQuantityChange}
                      onRemove={handleRemoveItem}
                      isLoading={cartItemsLoading[item.id]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Order Summary
                </h2>

                {/* Apply Coupon */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">
                    Have a coupon?
                  </h3>
                  {coupon ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold text-green-700 text-lg">
                            {coupon.code}
                          </span>
                          <p className="text-sm text-green-600 mt-1">
                            {coupon.discountType === "PERCENTAGE"
                              ? `${coupon.discountValue}% off`
                              : `₹${coupon.discountValue} off`}
                          </p>
                          {((parseFloat(coupon.discountValue) > 90 &&
                            coupon.discountType === "PERCENTAGE") ||
                            coupon.isDiscountCapped) && (
                            <p className="text-xs text-amber-600 mt-1">
                              *Maximum discount capped at 90%
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleRemoveCoupon}
                          className="text-sm text-red-500 hover:text-red-700 transition-colors font-medium"
                          disabled={couponLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <form
                        onSubmit={handleApplyCoupon}
                        className="flex space-x-2"
                      >
                        <Input
                          type="text"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) =>
                            setCouponCode(e.target.value.toUpperCase())
                          }
                          className={`flex-1 ${
                            couponError
                              ? "border-red-300 focus-visible:ring-red-300"
                              : ""
                          }`}
                        />
                        <Button
                          type="submit"
                          disabled={couponLoading}
                          variant="outline"
                        >
                          {couponLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </form>
                      <p className="text-xs text-gray-500 mt-2">
                        *Maximum discount limited to 90% of cart value
                      </p>
                      {couponError && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 flex items-start gap-1.5 text-red-600"
                        >
                          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="text-xs">{couponError}</p>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>

                {/* Price Details */}
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>

                    {coupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-semibold">
                          -{formatCurrency(totals.discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping
                      </span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-xl pt-4 border-t border-gray-200">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary">
                      {formatCurrency(totals.subtotal - totals.discount)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full mt-6 py-6 text-lg font-semibold rounded-xl"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
