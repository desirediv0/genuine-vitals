"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";
import { fetchApi, formatCurrency, formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState("");

  // Handle page from URL
  const page = searchParams.get("page")
    ? parseInt(searchParams.get("page"))
    : 1;

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;

      setLoadingOrders(true);
      setError("");

      try {
        const response = await fetchApi(
          `/payment/orders?page=${page}&limit=10`,
          {
            credentials: "include",
          }
        );

        setOrders(response.data.orders || []);
        setPagination(
          response.data.pagination || {
            total: 0,
            page: 1,
            limit: 10,
            pages: 0,
          }
        );
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, page]);

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

  // Get payment method icon
  const getPaymentIcon = (method) => {
    const methodIcons = {
      CARD: "CreditCard",
      NETBANKING: "Building",
      WALLET: "Wallet",
      UPI: "Smartphone",
      EMI: "Calendar",
      OTHER: "DollarSign",
    };
    return methodIcons[method] || "DollarSign";
  };

  // Handle pagination
  const changePage = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    router.push(`/account/orders?page=${newPage}`);
  };

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
                  href="/account"
                  className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-2"
                >
                  <DynamicIcon name="ArrowLeft" className="mr-1 h-4 w-4" />
                  Back to Account
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              </div>
              <Link href="/products">
                <Button variant="outline" className="gap-2">
                  <DynamicIcon name="ShoppingBag" className="h-4 w-4" />
                  Continue Shopping
                </Button>
              </Link>
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

            {loadingOrders ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
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
            ) : orders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm p-8 text-center"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon
                    name="Package"
                    className="h-10 w-10 text-gray-400"
                  />
                </div>
                <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
                <p className="text-gray-600 mb-6">
                  Start shopping to see your orders here
                </p>
                <Link href="/products">
                  <Button>Start Shopping</Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Recent Order Highlight */}
                {orders[0] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            Latest Order
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                              orders[0].status
                            )}`}
                          >
                            {orders[0].status}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-1">
                          Order #{orders[0].orderNumber}
                        </h3>
                        <p className="text-gray-600">
                          Placed on {formatDate(orders[0].date)}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href={`/account/orders/${orders[0].id}`}>
                          <Button className="w-full sm:w-auto">
                            View Details
                          </Button>
                        </Link>
                        {orders[0].status === "DELIVERED" && (
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto gap-2"
                          >
                            <DynamicIcon name="Star" className="h-4 w-4" />
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Orders Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(order.date)}
                          </span>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">
                              Order #{order.orderNumber}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {order.items.slice(0, 2).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center gap-3 text-sm"
                              >
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <DynamicIcon
                                    name="Package"
                                    className="h-4 w-4 text-gray-500"
                                  />
                                </div>
                                <span className="text-gray-600 truncate">
                                  {item.name}
                                </span>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <p className="text-sm text-gray-500">
                                +{order.items.length - 2} more items
                              </p>
                            )}
                          </div>

                          <div className="pt-4 border-t">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Total</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(order.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="flex-1"
                          >
                            <Button variant="outline" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          {order.status === "DELIVERED" && (
                            <Button variant="outline" className="flex-1 gap-2">
                              <DynamicIcon name="Star" className="h-4 w-4" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-2 mt-8"
                  >
                    <Button
                      variant="outline"
                      onClick={() => changePage(1)}
                      disabled={page === 1}
                      className="gap-2"
                    >
                      <DynamicIcon name="ChevronsLeft" className="h-4 w-4" />
                      First
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => changePage(page - 1)}
                      disabled={page === 1}
                      className="gap-2"
                    >
                      <DynamicIcon name="ChevronLeft" className="h-4 w-4" />
                      Previous
                    </Button>

                    {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                      .filter((p) => {
                        if (pagination.pages <= 7) return true;
                        if (p === 1 || p === pagination.pages) return true;
                        if (p >= page - 1 && p <= page + 1) return true;
                        return false;
                      })
                      .map((p, i, arr) => {
                        if (i > 0 && arr[i - 1] !== p - 1) {
                          return (
                            <span
                              key={`ellipsis-${p}`}
                              className="px-4 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        return (
                          <Button
                            key={p}
                            variant={page === p ? "default" : "outline"}
                            onClick={() => changePage(p)}
                            className="min-w-[40px]"
                          >
                            {p}
                          </Button>
                        );
                      })}

                    <Button
                      variant="outline"
                      onClick={() => changePage(page + 1)}
                      disabled={page === pagination.pages}
                      className="gap-2"
                    >
                      Next
                      <DynamicIcon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => changePage(pagination.pages)}
                      disabled={page === pagination.pages}
                      className="gap-2"
                    >
                      Last
                      <DynamicIcon name="ChevronsRight" className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </ClientOnly>
  );
}
