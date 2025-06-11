"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { fetchApi, formatCurrency, loadScript } from "@/lib/utils";
import { playSuccessSound, fireConfetti } from "@/lib/sound-utils";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle,
  MapPin,
  Plus,
  IndianRupee,
  ShoppingBag,
  PartyPopper,
  Gift,
  Shield,
  Truck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AddressForm from "@/components/AddressForm";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CheckoutPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { cart, coupon, getCartTotals, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("RAZORPAY");
  const [processing, setProcessing] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [razorpayKey, setRazorpayKey] = useState("");
  const [error, setError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [successAnimation, setSuccessAnimation] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [confettiCannon, setConfettiCannon] = useState(false);

  const totals = getCartTotals();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=checkout");
    }
  }, [isAuthenticated, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (isAuthenticated && cart.items?.length === 0) {
      router.push("/cart");
    }
  }, [isAuthenticated, cart, router]);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!isAuthenticated) return;

    setLoadingAddresses(true);
    try {
      const response = await fetchApi("/users/addresses", {
        credentials: "include",
      });

      if (response.success) {
        setAddresses(response.data.addresses || []);

        // Set the default address if available
        if (response.data.addresses?.length > 0) {
          const defaultAddress = response.data.addresses.find(
            (addr) => addr.isDefault
          );
          if (defaultAddress) {
            setSelectedAddressId(defaultAddress.id);
          } else {
            setSelectedAddressId(response.data.addresses[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load your addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [isAuthenticated]);

  // Fetch Razorpay key
  useEffect(() => {
    const fetchRazorpayKey = async () => {
      try {
        const response = await fetchApi("/payment/razorpay-key", {
          credentials: "include",
        });
        if (response.success) {
          console.log("Razorpay key fetched successfully");
          setRazorpayKey(response.data.key);
        } else {
          console.error("Failed to fetch Razorpay key:", response);
        }
      } catch (error) {
        console.error("Error fetching Razorpay key:", error);
      }
    };

    if (isAuthenticated) {
      fetchRazorpayKey();
    }
  }, [isAuthenticated]);

  // Handle address selection
  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  // Handle address form success
  const handleAddressFormSuccess = () => {
    setShowAddressForm(false);
    fetchAddresses();
  };

  // Add countdown for redirect
  useEffect(() => {
    if (orderCreated && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (orderCreated && redirectCountdown === 0) {
      router.push(`/account/orders`);
    }
  }, [orderCreated, redirectCountdown, router]);

  // Enhanced confetti effect when order is successful
  useEffect(() => {
    if (successAnimation) {
      // Trigger the celebration confetti
      fireConfetti.celebration();

      // Follow with just one more cannon after 1.5 seconds for lighter effect
      const timer = setTimeout(() => {
        setConfettiCannon(true);
        fireConfetti.sides();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successAnimation]);

  // Update the payment handler with enhanced audio feedback
  const handleSuccessfulPayment = (paymentResponse, orderData) => {
    setPaymentId(paymentResponse.razorpay_payment_id);
    setOrderCreated(true);
    setOrderNumber(orderData.orderNumber || "");

    // Start success animation
    setSuccessAnimation(true);

    // Play a single success sound
    // Don't play both sounds as that might be too much
    playSuccessSound();

    // Clear cart after successful order
    clearCart();

    // Show enhanced success toast
    toast.success("Order placed successfully!", {
      duration: 4000, // Reduced duration
      icon: <PartyPopper className="h-5 w-5 text-green-500" />,
      description: `Your order #${
        orderData.orderNumber || ""
      } has been confirmed.`,
    });
  };

  // Process checkout
  const handleCheckout = async () => {
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      // Get checkout amount
      const calculatedAmount = totals.subtotal - totals.discount;
      // Fix: Keep 2 decimal places instead of rounding to preserve exact amount
      const amount = Math.max(parseFloat(calculatedAmount.toFixed(2)), 1);

      // Show warning if original amount was less than 1
      if (calculatedAmount < 1) {
        toast.info("Minimum order amount is ₹1. Your total has been adjusted.");
      }

      if (paymentMethod === "RAZORPAY") {
        // Step 1: Create Razorpay order
        const orderResponse = await fetchApi("/payment/checkout", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            amount,
            currency: "INR",
            // Include coupon information for proper tracking
            couponCode: coupon?.code || null,
            couponId: coupon?.id || null,
            discountAmount: totals.discount || 0,
          }),
        });

        if (!orderResponse.success) {
          throw new Error(orderResponse.message || "Failed to create order");
        }

        const razorpayOrder = orderResponse.data;
        setOrderId(razorpayOrder.id);

        // Step 2: Load Razorpay script
        const loaded = await loadScript(
          "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!loaded) {
          throw new Error("Razorpay SDK failed to load");
        }

        const options = {
          key: razorpayKey,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Genuine Vitals - Premium Supplements for Your Fitness Journey",
          description: "Get high-quality supplements at the best prices.",
          order_id: razorpayOrder.id,
          prefill: {
            name: user?.name || "",
            email: user?.email || "",
            contact: user?.phone || "",
          },
          handler: async function (response) {
            // Step 4: Verify payment
            try {
              const verificationResponse = await fetchApi("/payment/verify", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                  // Send both formats to ensure compatibility
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  // Also send camelCase versions
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  // Include shipping and coupon information
                  shippingAddressId: selectedAddressId,
                  billingAddressSameAsShipping: true,
                  // Also pass coupon information again to ensure it's included
                  couponCode: coupon?.code || null,
                  couponId: coupon?.id || null,
                  discountAmount: totals.discount || 0,
                  notes: "",
                }),
              });

              if (verificationResponse.success) {
                setOrderId(verificationResponse.data.orderId);
                handleSuccessfulPayment(response, verificationResponse.data);
              } else {
                throw new Error(
                  verificationResponse.message || "Payment verification failed"
                );
              }
            } catch (error) {
              console.error("Payment verification error:", error);

              // If the error is about a previously cancelled order, guide the user
              if (
                error.message &&
                error.message.includes("previously cancelled")
              ) {
                setError(
                  "Your previous order was cancelled. Please refresh the page and try again."
                );
                toast.error("Please refresh the page to start a new checkout", {
                  duration: 6000,
                });
              } else {
                setError(error.message || "Payment verification failed");
              }
            }
          },
          theme: {
            color: "#F47C20",
          },
          modal: {
            ondismiss: function () {
              // When Razorpay modal is dismissed
              setProcessing(false);
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
      // Add COD implementation here if required
    } catch (error) {
      console.error("Checkout error:", error);

      if (
        error.message &&
        error.message.includes("order was previously cancelled")
      ) {
        // Clear local state and guide the user
        setError(
          "This order was previously cancelled. Please refresh the page to start a new checkout."
        );
        toast.error("Please refresh the page to start a new checkout", {
          duration: 6000,
        });
      } else {
        setError(error.message || "Checkout failed");
        toast.error(error.message || "Checkout failed");
      }
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated || loadingAddresses) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // If order created successfully
  if (orderCreated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg border shadow-lg relative overflow-hidden">
          {/* Background pattern for festive feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>

          {/* Celebration animation */}
          <div className="relative z-10">
            <div className="relative flex justify-center">
              <div className="h-36 w-36 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <PartyPopper
                  className={`h-20 w-20 text-primary ${
                    confettiCannon ? "animate-pulse" : ""
                  }`}
                />
              </div>

              {/* Radiating circles animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-ping absolute h-40 w-40 rounded-full bg-primary opacity-20"></div>
                <div className="animate-ping absolute h-32 w-32 rounded-full bg-green-500 opacity-10 delay-150"></div>
                <div className="animate-ping absolute h-24 w-24 rounded-full bg-yellow-500 opacity-10 delay-300"></div>
              </div>
            </div>

            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2 text-gray-800 animate-pulse">
                Woohoo!
              </h1>

              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                Order Confirmed!
              </h2>

              {orderNumber && (
                <div className="bg-primary/10 py-2 px-4 rounded-full inline-block mb-3">
                  <p className="text-lg font-semibold text-primary">
                    Order #{orderNumber}
                  </p>
                </div>
              )}

              <div className="my-6 flex items-center justify-center bg-green-50 p-4 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <p className="text-xl text-green-600 font-medium">
                  Payment Successful
                </p>
              </div>

              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Thank you for your purchase! Your order has been successfully
                placed and you&apos;ll receive an email confirmation shortly.
              </p>

              <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center justify-center space-x-2">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <p className="text-blue-700">
                  Redirecting to orders page in {redirectCountdown} seconds...
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Link href="/account/orders">
                  <Button className="gap-2">
                    <ShoppingBag size={16} />
                    My Orders
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="gap-2">
                    <Gift size={16} />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <Link href="/cart">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Back to Cart
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
                <p className="text-red-700 font-semibold">Payment Failed</p>
                <p className="text-red-600">{error}</p>
              </div>
            </motion.div>
          )}

          {orderCreated ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-sm border p-8 text-center"
            >
              <div className="inline-flex justify-center items-center bg-green-50 p-4 rounded-full mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 inline-block">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="text-lg font-semibold text-gray-900">
                  {orderNumber}
                </p>
              </div>
              <p className="text-sm text-gray-500 mb-8">
                Redirecting to orders page in {redirectCountdown} seconds...
              </p>
              <div className="flex justify-center gap-4">
                <Link href="/account/orders">
                  <Button className="gap-2">
                    <ShoppingBag size={16} />
                    View Orders
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" className="gap-2">
                    <Gift size={16} />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Address Section */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-6 border-b">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Delivery Address
                      </h2>
                    </div>

                    {loadingAddresses ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : addresses.length > 0 ? (
                      <div className="space-y-4">
                        {addresses.map((address) => (
                          <motion.div
                            key={address.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedAddressId === address.id
                                ? "border-primary bg-primary/5"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                            onClick={() => handleAddressSelect(address.id)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {address.name}
                                </p>
                                <p className="text-gray-600 mt-1">
                                  {address.street}
                                </p>
                                <p className="text-gray-600">
                                  {address.city}, {address.state}{" "}
                                  {address.postalCode}
                                </p>
                                <p className="text-gray-600">
                                  {address.country}
                                </p>
                                <p className="text-gray-600 mt-1">
                                  Phone: {address.phone}
                                </p>
                              </div>
                              {selectedAddressId === address.id && (
                                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 mb-4">No addresses found</p>
                      </div>
                    )}

                    {!showAddressForm ? (
                      <Button
                        variant="outline"
                        className="w-full mt-4 gap-2"
                        onClick={() => setShowAddressForm(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add New Address
                      </Button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <AddressForm
                          onSuccess={handleAddressFormSuccess}
                          onCancel={() => setShowAddressForm(false)}
                          isInline={true}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Payment Method
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <div
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === "RAZORPAY"
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                        onClick={() => handlePaymentMethodSelect("RAZORPAY")}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg border">
                              <IndianRupee className="h-5 w-5 text-gray-700" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                Razorpay
                              </p>
                              <p className="text-sm text-gray-600">
                                Pay securely with Razorpay
                              </p>
                            </div>
                          </div>
                          {paymentMethod === "RAZORPAY" && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-20">
                  <h2 className="text-xl font-semibold mb-6 text-gray-900">
                    Order Summary
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <p className="text-sm font-medium mb-3 text-gray-700">
                        {cart.totalQuantity} Items in Cart
                      </p>
                      <div className="max-h-52 overflow-y-auto space-y-3">
                        {cart.items?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex-shrink-0 relative">
                              {item.product.image && (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.name}
                                  fill
                                  className="object-contain p-1"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.quantity} × {formatCurrency(item.price)}
                              </p>
                            </div>
                            <p className="font-medium text-sm">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

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

                      <div className="flex justify-between font-bold text-lg pt-4 border-t">
                        <span className="text-gray-900">Total</span>
                        <span className="text-primary">
                          {formatCurrency(totals.subtotal - totals.discount)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Button
                        className="w-full py-6 text-base font-medium"
                        size="lg"
                        onClick={handleCheckout}
                        disabled={processing || !selectedAddressId}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pay Now
                          </>
                        )}
                      </Button>

                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4" />
                        <span>Secure Payment</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Truck className="h-4 w-4" />
                        <span>Free shipping</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RefreshCw className="h-4 w-4" />
                        <span>Easy returns within 7 days</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
