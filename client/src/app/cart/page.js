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
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Cart item component to optimize re-renders
const CartItem = React.memo(
  ({ item, onUpdateQuantity, onRemove, isLoading }) => {
    return (
      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6 flex items-center">
          <div className="relative h-20 w-20 bg-gray-100 rounded overflow-hidden mr-4 flex-shrink-0">
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-contain p-2"
            />
          </div>
          <div>
            <Link
              href={`/products/${item.product.slug}`}
              className="font-medium hover:text-primary"
            >
              {item.product.name}
            </Link>
            <div className="text-sm text-gray-600 mt-1">
              {item.variant.flavor?.name} {item.variant.weight?.value}
              {item.variant.weight?.unit}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between md:justify-center">
          <span className="md:hidden">Price:</span>
          <span className="font-medium">{formatCurrency(item.price)}</span>
        </div>

        <div className="md:col-span-2 flex items-center justify-between md:justify-center">
          <span className="md:hidden">Quantity:</span>
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              disabled={isLoading || item.quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-3 py-1">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin inline" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex items-center justify-between md:justify-center">
          <div className="flex items-center md:block">
            <span className="md:hidden mr-2">Subtotal:</span>
            <span className="font-medium">{formatCurrency(item.subtotal)}</span>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-red-500 hover:text-red-700 ml-4 disabled:opacity-50"
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
        // Toast notification for success
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
        const response = await applyCoupon(couponCode);
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
  if (loading && !cart.items.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Display empty cart - but not when there's an error
  if ((!cart.items || cart.items.length === 0) && !error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
        <div className="bg-white p-8 rounded-lg shadow-sm text-center border">
          <div className="inline-flex justify-center items-center bg-gray-100 p-6 rounded-full mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold mb-3">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven&apos;t added any products to your cart yet.
          </p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start"
            >
              <AlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-700 font-semibold">Cart Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50">
                  <div className="col-span-6 font-medium text-gray-700">
                    Product
                  </div>
                  <div className="col-span-2 font-medium text-center text-gray-700">
                    Price
                  </div>
                  <div className="col-span-2 font-medium text-center text-gray-700">
                    Quantity
                  </div>
                  <div className="col-span-2 font-medium text-center text-gray-700">
                    Subtotal
                  </div>
                </div>

                {/* Cart Items */}
                <div className="divide-y">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <CartItem
                        item={item}
                        onUpdateQuantity={handleQuantityChange}
                        onRemove={handleRemoveItem}
                        isLoading={cartItemsLoading[item.id]}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Cart Actions */}
                <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
                  <Link href="/products">
                    <Button variant="outline" className="gap-2">
                      <ShoppingBag className="h-4 w-4" />
                      Continue Shopping
                    </Button>
                  </Link>
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
              </div>
            </div>

            {/* Cart Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-20">
                <h2 className="text-xl font-bold mb-6 text-gray-900">
                  Cart Summary
                </h2>

                {/* Apply Coupon */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-gray-700">
                    Have a coupon?
                  </h3>
                  {coupon ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-between items-center bg-green-50 p-4 rounded-lg border border-green-200"
                    >
                      <div>
                        <span className="font-medium text-green-700">
                          {coupon.code}
                        </span>
                        <p className="text-xs text-green-600 mt-1">
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
                        className="text-sm text-red-500 hover:text-red-700 transition-colors"
                        disabled={couponLoading}
                      >
                        Remove
                      </button>
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
                      <span className="font-medium">
                        {formatCurrency(totals.subtotal)}
                      </span>
                    </div>

                    {coupon && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span className="font-medium">
                          -{formatCurrency(totals.discount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">FREE</span>
                    </div>
                  </div>

                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary">
                      {formatCurrency(totals.subtotal - totals.discount)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full mt-6 py-6 text-base font-medium"
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
