"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Filter,
  ChevronRight,
  Search,
  Package,
  ChevronLeft,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

// Add ProductCardSkeleton component
function ProductCardSkeleton() {
  return (
    <div className="bg-white overflow-hidden shadow-md rounded-lg animate-pulse">
      <div className="h-40 bg-gray-200"></div>
      <div className="p-3">
        <div className="flex justify-center mb-1">
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-3 w-full bg-gray-200 rounded mb-1"></div>
        <div className="h-3 w-3/4 mx-auto bg-gray-200 rounded mb-2"></div>
        <div className="flex justify-center">
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10,
  });
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, productsRes] = await Promise.all([
          fetchApi("/public/categories"),
          fetchApi(
            `/public/products?page=${pagination.page}&limit=${
              pagination.limit
            }&search=${filters.search}${
              filters.category ? `&category=${filters.category}` : ""
            }${filters.minPrice ? `&minPrice=${filters.minPrice}` : ""}${
              filters.maxPrice ? `&maxPrice=${filters.maxPrice}` : ""
            }&sort=${filters.sort}`
          ),
        ]);

        setCategories(categoriesRes.data.categories || []);
        setProducts(productsRes.data.products || []);
        setPagination((prev) => ({
          ...prev,
          ...productsRes.data.pagination,
          limit: prev.limit,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters, pagination.page, pagination.limit]);

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* Filters */}
        <div className="relative bg-white shadow-sm sm:rounded-lg border overflow-hidden">
          <div className="border-b border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              {/* Search and Toggle Filters */}
              <div className="flex-1 flex flex-col sm:flex-row gap-4 items-start sm:items-center min-w-0">
                <div className="w-full sm:w-64 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, search: e.target.value }))
                    }
                    className="pl-9 w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:ml-2"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>

              {/* Sort Options */}
              <Select
                value={filters.sort}
                onValueChange={(value) =>
                  setFilters((f) => ({ ...f, sort: value }))
                }
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Panel */}
            <div
              className={`${
                showFilters ? "grid" : "hidden"
              } grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters((f) => ({ ...f, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 flex items-end">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setFilters({
                      category: "",
                      search: "",
                      minPrice: "",
                      maxPrice: "",
                      sort: "newest",
                    });
                    setPagination((p) => ({ ...p, page: 1 }));
                  }}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <ProductCardSkeleton key={n} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center">
                  <Package className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500">
                    {filters.search ||
                    filters.category ||
                    filters.minPrice ||
                    filters.maxPrice
                      ? "Try adjusting your filters"
                      : "Products will appear here once added"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && !loading && (
            <div className="border-t border-gray-200 px-4 py-3 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.page === pagination.pages}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(pagination.page - 1) * pagination.limit + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.page * pagination.limit,
                          pagination.total
                        )}
                      </span>{" "}
                      of <span className="font-medium">{pagination.total}</span>{" "}
                      products
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex -space-x-px"
                      aria-label="Pagination"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-l-md"
                        disabled={pagination.page === 1}
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: p.page - 1 }))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center px-4 text-sm font-medium">
                        Page {pagination.page} of {pagination.pages}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-r-md"
                        disabled={pagination.page === pagination.pages}
                        onClick={() =>
                          setPagination((p) => ({ ...p, page: p.page + 1 }))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-[#2E9692] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
