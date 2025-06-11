"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";
import { fetchApi, formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

// Add this function before the OrderDetailsPage component
const getPaymentIcon = (method) => {
  const paymentIcons = {
    CREDIT_CARD: "CreditCard",
    DEBIT_CARD: "CreditCard",
    UPI: "Smartphone",
    NET_BANKING: "Building2",
    WALLET: "Wallet",
    CASH_ON_DELIVERY: "Banknote",
    PAYPAL: "Paypal",
    GOOGLE_PAY: "Smartphone",
    APPLE_PAY: "Smartphone",
  };
  return paymentIcons[method] || "CreditCard";
};

const getStatusIcon = (status) => {
  const statusIcons = {
    PLACED: "ShoppingBag",
    CONFIRMED: "CheckCircle",
    SHIPPED: "Truck",
    DELIVERED: "PackageCheck",
    CANCELLED: "XCircle",
    REFUNDED: "ReceiptRefund",
  };
  return statusIcons[status] || "Circle";
};

const getOrderProgress = (status) => {
  const statusProgress = {
    PLACED: 25,
    CONFIRMED: 50,
    SHIPPED: 75,
    DELIVERED: 100,
    CANCELLED: 0,
    REFUNDED: 0,
  };
  return statusProgress[status] || 0;
};

export default function OrderDetailsPage({ params }) {
  const { orderId } = params;
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!isAuthenticated || !orderId) return;

      setLoadingOrder(true);
      setError("");

      try {
        const response = await fetchApi(`/payment/orders/${orderId}`, {
          credentials: "include",
        });

        setOrder(response.data);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrderDetails();
  }, [isAuthenticated, orderId]);

  // Handle cancel order
  const handleCancelOrder = async (e) => {
    e.preventDefault();

    if (!cancelReason.trim()) {
      setError("Please provide a reason for cancellation");
      return;
    }

    setCancelling(true);
    setError("");

    try {
      await fetchApi(`/payment/orders/${orderId}/cancel`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ reason: cancelReason }),
      });

      // Refresh order data
      const response = await fetchApi(`/payment/orders/${orderId}`, {
        credentials: "include",
      });

      setOrder(response.data);
      setShowCancelForm(false);
      setCancelReason("");
    } catch (error) {
      console.error("Failed to cancel order:", error);
      setError(
        error.message || "Failed to cancel order. Please try again later."
      );
    } finally {
      setCancelling(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const statusColors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      SHIPPED: "bg-indigo-100 text-indigo-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-purple-100 text-purple-800",
    };
    return statusColors[status] || "bg-gray-100 text-gray-800";
  };

  // Check if order can be cancelled
  const canCancel = order && ["PENDING", "PROCESSING"].includes(order.status);

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <Link
                  href="/account/orders"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2"
                >
                  <DynamicIcon name="ArrowLeft" className="mr-1 h-4 w-4" />
                  Back to Orders
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Details
                </h1>
              </div>
              {canCancel && !showCancelForm && (
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 gap-2"
                  onClick={() => setShowCancelForm(true)}
                >
                  <DynamicIcon name="X" className="h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {loadingOrder ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                    >
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !order ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon
                    name="FileX"
                    className="h-10 w-10 text-gray-400"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6">
                  The order you&apos;re looking for doesn&apos;t exist or you
                  don&apos;t have permission to view it.
                </p>
                <Link href="/account/orders">
                  <Button>View All Orders</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Order Status Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 border-b border-primary/10">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                              Order #{order.orderNumber}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="text-gray-600">
                            Placed on {formatDate(order.date)}
                          </p>
                        </div>
                        {order.status === "DELIVERED" && (
                          <Button variant="outline" className="gap-2">
                            <DynamicIcon name="Star" className="h-4 w-4" />
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Order Progress */}
                    <div className="p-6">
                      <div className="relative">
                        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
                          <div
                            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                            style={{
                              width: `${getOrderProgress(order.status)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="relative flex justify-between">
                          {["PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"].map(
                            (status, index) => (
                              <div
                                key={status}
                                className="flex flex-col items-center"
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    getOrderProgress(order.status) >=
                                    (index + 1) * 25
                                      ? "bg-primary text-white"
                                      : "bg-gray-100 text-gray-400"
                                  }`}
                                >
                                  <DynamicIcon
                                    name={getStatusIcon(status)}
                                    className="h-4 w-4"
                                  />
                                </div>
                                <span className="text-xs mt-2 text-gray-600">
                                  {status}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Order Items */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order Items
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {order.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6"
                        >
                          <div className="flex gap-4">
                            <Link
                              href={`/products/${item.slug}`}
                              className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden"
                            >
                              {item.image ? (
                                <Image
                                  width={80}
                                  height={80}
                                  src={item.image}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <DynamicIcon
                                    name="Package"
                                    className="h-8 w-8 text-gray-400"
                                  />
                                </div>
                              )}
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${item.slug}`}
                                className="text-base font-medium text-gray-900 hover:text-primary truncate block"
                              >
                                {item.name}
                              </Link>
                              <div className="mt-1 text-sm text-gray-600 space-y-1">
                                {(item.flavor || item.weight) && (
                                  <p>
                                    {item.flavor && (
                                      <span>Flavor: {item.flavor}</span>
                                    )}
                                    {item.flavor && item.weight && (
                                      <span> • </span>
                                    )}
                                    {item.weight && (
                                      <span>Weight: {item.weight}</span>
                                    )}
                                  </p>
                                )}
                                <p>
                                  {formatCurrency(item.price)} × {item.quantity}{" "}
                                  = {formatCurrency(item.subtotal)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tracking Information */}
                  {order.tracking && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Tracking Information
                        </h2>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">
                              Carrier
                            </p>
                            <p className="font-medium">
                              {order.tracking.carrier}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.tracking.status
                              )}`}
                            >
                              {order.tracking.status}
                            </span>
                          </div>
                          <div className="sm:col-span-2">
                            <p className="text-sm text-gray-600 mb-1">
                              Tracking Number
                            </p>
                            <div className="flex items-center gap-2">
                              <span className="font-mono bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                                {order.tracking.trackingNumber}
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={() =>
                                  window.open(
                                    order.tracking.trackingUrl,
                                    "_blank"
                                  )
                                }
                              >
                                <DynamicIcon
                                  name="ExternalLink"
                                  className="h-4 w-4"
                                />
                                Track
                              </Button>
                            </div>
                          </div>
                          {order.tracking.estimatedDelivery && (
                            <div className="sm:col-span-2">
                              <p className="text-sm text-gray-600 mb-1">
                                Estimated Delivery
                              </p>
                              <p className="font-medium">
                                {formatDate(order.tracking.estimatedDelivery)}
                              </p>
                            </div>
                          )}
                        </div>

                        {order.tracking.updates &&
                          order.tracking.updates.length > 0 && (
                            <div className="mt-8">
                              <h3 className="text-sm font-semibold mb-4">
                                Tracking Updates
                              </h3>
                              <div className="space-y-4">
                                {order.tracking.updates.map((update, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex gap-4"
                                  >
                                    <div className="flex flex-col items-center">
                                      <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          index === 0
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-400"
                                        }`}
                                      >
                                        <DynamicIcon
                                          name="Check"
                                          className="h-4 w-4"
                                        />
                                      </div>
                                      {index <
                                        order.tracking.updates.length - 1 && (
                                        <div className="w-0.5 h-full bg-gray-200 my-2"></div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-900">
                                        {update.status}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {formatDate(update.timestamp)}
                                        {update.location &&
                                          ` • ${update.location}`}
                                      </p>
                                      {update.description && (
                                        <p className="text-sm text-gray-600 mt-1">
                                          {update.description}
                                        </p>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column - Order Summary */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-20"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Order Summary
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span>{formatCurrency(order.subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                        </div>
                        {order.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>Discount</span>
                            <span>-{formatCurrency(order.discount)}</span>
                          </div>
                        )}
                      </div>

                      {order.couponCode && (
                        <div className="p-3 bg-green-50 border border-green-100 rounded-lg">
                          <div className="flex items-center text-green-700 text-sm font-medium mb-1">
                            <DynamicIcon name="Tag" className="h-4 w-4 mr-1" />
                            Coupon applied: {order.couponCode}
                          </div>
                          {order.couponDetails && (
                            <div className="text-xs text-green-600">
                              {order.couponDetails.discountType ===
                              "PERCENTAGE" ? (
                                <span>
                                  {order.couponDetails.discountValue}% off your
                                  order
                                </span>
                              ) : (
                                <span>
                                  {formatCurrency(
                                    order.couponDetails.discountValue
                                  )}{" "}
                                  off your order
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Payment Information */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Payment Information
                      </h2>
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Method</p>
                        <div className="flex items-center gap-2">
                          <DynamicIcon
                            name={getPaymentIcon(order.paymentMethod)}
                            className="h-5 w-5 text-gray-500"
                          />
                          <span className="font-medium">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      {order.paymentId && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            Payment ID
                          </p>
                          <span className="font-mono bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                            {order.paymentId}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Shipping Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Shipping Address
                      </h2>
                    </div>
                    <div className="p-6">
                      {order.shippingAddress ? (
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">
                            {order.shippingAddress.name}
                          </p>
                          <p className="text-gray-600">
                            {order.shippingAddress.street}
                          </p>
                          <p className="text-gray-600">
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.postalCode}
                          </p>
                          <p className="text-gray-600">
                            {order.shippingAddress.country}
                          </p>
                          {order.shippingAddress.phone && (
                            <p className="text-gray-600">
                              Phone: {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No shipping address available
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Order Notes */}
                  {order.notes && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white rounded-xl shadow-sm overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Order Notes
                        </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-600">{order.notes}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* Cancel Order Form */}
            {showCancelForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Cancel Order
                    </h3>
                    <button
                      onClick={() => {
                        setShowCancelForm(false);
                        setCancelReason("");
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <DynamicIcon name="X" className="h-5 w-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCancelOrder} className="space-y-4">
                    <div>
                      <label
                        htmlFor="cancelReason"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Reason for cancellation
                      </label>
                      <textarea
                        id="cancelReason"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        rows={3}
                        placeholder="Please provide a reason for cancelling this order"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowCancelForm(false);
                          setCancelReason("");
                        }}
                      >
                        Never Mind
                      </Button>
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={cancelling}
                        className="gap-2"
                      >
                        {cancelling ? (
                          <>
                            <DynamicIcon
                              name="Loader2"
                              className="h-4 w-4 animate-spin"
                            />
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <DynamicIcon name="X" className="h-4 w-4" />
                            Cancel Order
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </ClientOnly>
  );
}
