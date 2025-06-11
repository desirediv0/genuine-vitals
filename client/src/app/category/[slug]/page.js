"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  Package,
  ArrowLeft,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import { motion, AnimatePresence } from "framer-motion";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/images/product-placeholder.jpg";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function CategoryPage() {
  const params = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [filters, setFilters] = useState({
    sort: "newest",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryRes, productsRes] = await Promise.all([
          fetchApi(`/public/categories/${params.slug}`),
          fetchApi(
            `/public/categories/${params.slug}/products?sort=${filters.sort}${
              filters.minPrice ? `&minPrice=${filters.minPrice}` : ""
            }${filters.maxPrice ? `&maxPrice=${filters.maxPrice}` : ""}`
          ),
        ]);

        setCategory(categoryRes.data.category);
        setProducts(productsRes.data.products || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.slug, filters]);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Category
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/categories">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronDown className="h-4 w-4" />
            <Link
              href="/categories"
              className="hover:text-primary transition-colors"
            >
              Categories
            </Link>
            <ChevronDown className="h-4 w-4" />
            <span className="text-primary">{category?.name}</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8">
            {category?.image && (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={getImageUrl(category.image)}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {category?.name}
              </h1>
              {category?.description && (
                <p className="text-gray-600 text-lg mb-4 max-w-2xl">
                  {category.description}
                </p>
              )}
              <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>{products.length} Products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and View Options */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <select
              value={filters.sort}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sort: e.target.value }))
              }
              className="px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            minPrice: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            maxPrice: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden"
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={product.image || "/product-placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain p-6 transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.hasSale && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          SALE
                        </div>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                    onClick={() => handleQuickView(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mb-3">
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
                    <span className="text-xs text-gray-500">
                      ({product.reviewCount || 0})
                    </span>
                  </div>

                  {/* Product Info */}
                  <Link
                    href={`/products/${product.slug}`}
                    className="block group"
                  >
                    <h3 className="font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Price */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(product.basePrice)}
                      </span>
                      {product.hasSale && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatCurrency(product.regularPrice)}
                        </span>
                      )}
                    </div>
                    {product.hasVariants && (
                      <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                        {product.variants} options
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden"
              >
                <div className="flex">
                  <Link
                    href={`/products/${product.slug}`}
                    className="relative w-48 aspect-square bg-gray-50"
                  >
                    <Image
                      src={product.image || "/product-placeholder.jpg"}
                      alt={product.name}
                      fill
                      className="object-contain p-6 transform group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {product.hasSale && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                          SALE
                        </div>
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 p-6">
                    <div className="flex justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
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
                          <span className="text-xs text-gray-500">
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        {/* Product Info */}
                        <Link
                          href={`/products/${product.slug}`}
                          className="block group"
                        >
                          <h3 className="text-xl font-medium text-gray-800 group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                        </Link>

                        {/* Description */}
                        <p className="text-gray-600 mt-2 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Price */}
                        <div className="mt-4 flex items-center gap-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-primary">
                              {formatCurrency(product.basePrice)}
                            </span>
                            {product.hasSale && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(product.regularPrice)}
                              </span>
                            )}
                          </div>
                          {product.hasVariants && (
                            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                              {product.variants} options
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                          onClick={() => handleQuickView(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white shadow-lg hover:scale-110 transition-transform"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-6">
              Products will appear here once added to this category
            </p>
            <Link href="/categories">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      )}
    </div>
  );
}
