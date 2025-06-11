"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  Phone,
  LogIn,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import Image from "next/image";
import { toast, Toaster } from "sonner";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchExpanded(false);
    setActiveDropdown(null);
  }, [pathname]);

  // Handle click outside of navbar to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    // Show logout toast notification
    toast.success("Logged out successfully");
    // Force reload to ensure UI updates correctly
    window.location.href = "/";
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Handle hover for dropdowns
  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown);
    if (dropdown) {
      setActiveDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null);
    // Only close if not clicking inside the dropdown
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null);
    }
  };

  // Mobile menu with ClientOnly to prevent hydration issues
  const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    handleLogout,
  }) => {
    const mobileSearchInputRef = useRef(null);

    useEffect(() => {
      // Focus the search input when menu opens with a small delay
      if (isMenuOpen) {
        const timer = setTimeout(() => {
          if (mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [isMenuOpen]);

    const handleMobileSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setIsMenuOpen(false);
        setSearchQuery("");
      }
    };

    const handleSearchInputChange = (e) => {
      e.stopPropagation();
      setSearchQuery(e.target.value);
    };

    if (!isMenuOpen) return null;

    return (
      <div
        className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 flex justify-between items-center px-4 py-3 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Image
                src="/logo.jpeg"
                alt="Logo"
                width={120}
                height={120}
                className="ml-2 p-2 lg:p-0"
              />
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-[#2E9692] transition-all duration-300 focus:outline-none rounded-full hover:bg-[#2E9692]/5"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-6">
            <form onSubmit={handleMobileSearch} className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-4 text-base border-gray-100 focus:border-[#2E9692] focus:ring-[#2E9692] rounded-full bg-gray-50"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  autoComplete="off"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-[#2E9692] transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      if (mobileSearchInputRef.current) {
                        mobileSearchInputRef.current.focus();
                      }
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-[#2E9692] text-white hover:bg-[#2E9692]/90 transition-all duration-300"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="border-b pb-2 mb-4">
              <Link
                href="/products"
                className="block py-3 text-lg font-medium hover:text-[#2E9692] transition-all duration-300 hover:bg-[#2E9692]/5 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <h3 className="font-bold text-lg mb-3 px-2">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/category/${category.slug}`}
                      className="block hover:text-[#2E9692] text-base transition-all duration-300 py-2 px-3 hover:bg-[#2E9692]/5 rounded-lg"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/blog"
                className="block py-3 text-lg font-medium hover:text-[#2E9692] transition-all duration-300 hover:bg-[#2E9692]/5 px-3 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/about"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
            </div>

            <div className="border-b pb-4 mb-4">
              <Link
                href="/contact"
                className="block py-3 text-lg font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="border-b pb-4 mb-4">
                <h3 className="font-bold text-lg mb-3">My Account</h3>
                <div className="space-y-3 pl-2">
                  <Link
                    href="/account"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-1.5 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-1.5 text-red-600 hover:text-red-800 w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 mt-6 px-4">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-6 text-base bg-[#2E9692] hover:bg-[#2E9692]/90 text-white transition-all duration-300">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base border-[#2E9692] text-[#2E9692] hover:bg-[#2E9692]/5 transition-all duration-300"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header
      className="sticky top-0 z-50 bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl shadow-lg"
      ref={navbarRef}
    >
      <Toaster position="top-center" />
      {/* Top bar with modern glassmorphism effect */}
      <div className="bg-gradient-to-r from-[#2E9692]/90 via-[#2E9692]/80 to-[#D5DA2A]/90 backdrop-blur-md text-white py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center text-sm hover:text-white/90 transition-all duration-300 group">
                <Phone className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            <p className="text-center text-sm font-medium mx-auto md:mx-0 bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm">
              Free shipping on orders over ₹999 | Use code FIT10 for 10% off
            </p>

            <div className="hidden md:flex items-center space-x-8 text-sm">
              <Link
                href="/faqs"
                className="hover:text-white/90 transition-all duration-300 hover:scale-105"
              >
                FAQs
              </Link>
              <Link
                href="/contact"
                className="hover:text-white/90 transition-all duration-300 hover:scale-105"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar with glassmorphism */}
      <div className="border-b border-gray-200/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            {/* Menu toggle for mobile */}
            <div className="flex items-center md:hidden">
              <button
                className="p-2 text-gray-600 hover:text-[#2E9692] transition-all duration-300 focus:outline-none hover:scale-110"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo with hover effect */}
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={140}
                  height={140}
                  className="ml-2 p-2 lg:p-0 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2E9692]/0 via-[#2E9692]/0 to-[#2E9692]/0 group-hover:from-[#2E9692]/0 group-hover:via-[#2E9692]/10 group-hover:to-[#2E9692]/0 transition-all duration-500" />
              </div>
            </Link>

            {/* Desktop Navigation with modern hover effects */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/products"
                className="font-medium text-gray-700 hover:text-[#2E9692] transition-all duration-300 py-2 relative group"
              >
                All Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E9692] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Categories dropdown with modern design */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover("categories")}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`font-medium ${
                    activeDropdown === "categories"
                      ? "text-[#2E9692]"
                      : "text-gray-700"
                  } hover:text-[#2E9692] transition-all duration-300 flex items-center focus:outline-none group py-2 relative`}
                  onClick={() => toggleDropdown("categories")}
                  aria-expanded={activeDropdown === "categories"}
                >
                  Categories
                  <ChevronDown
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      activeDropdown === "categories" ? "rotate-180" : ""
                    } group-hover:rotate-180`}
                  />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E9692] transition-all duration-300 group-hover:w-full" />
                </button>
                <div
                  className={`absolute left-0 top-full mt-1 w-64 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl py-2 border border-gray-200/30 z-50 transition-all duration-300 ease-in-out transform origin-top ${
                    activeDropdown === "categories"
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {categories.map((category) => (
                    <div key={category.id}>
                      <Link
                        href={`/category/${category.slug}`}
                        className="block px-4 py-2.5 hover:bg-[#2E9692]/5 hover:text-[#2E9692] transition-all duration-300 hover:translate-x-1"
                        onClick={() => setActiveDropdown(null)}
                      >
                        {category.name}
                      </Link>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-200/30">
                    <Link
                      href="/categories"
                      className="block px-4 py-2.5 text-[#2E9692] font-medium hover:bg-[#2E9692]/5 transition-all duration-300 hover:translate-x-1"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/blog"
                className="font-medium text-gray-700 hover:text-[#2E9692] transition-all duration-300 py-2 relative group"
              >
                Blog
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E9692] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                href="/about"
                className="font-medium text-gray-700 hover:text-[#2E9692] transition-all duration-300 py-2 relative group"
              >
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E9692] transition-all duration-300 group-hover:w-full" />
              </Link>

              <Link
                href="/contact"
                className="font-medium text-gray-700 hover:text-[#2E9692] transition-all duration-300 py-2 relative group"
              >
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2E9692] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Search, Cart, Account with modern design */}
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Search button/form with glassmorphism */}
              <div className="relative">
                {isSearchExpanded ? (
                  <>
                    <div
                      className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
                      onClick={() => setIsSearchExpanded(false)}
                    />
                    <div className="fixed inset-x-0 top-0 z-50 w-full animate-in slide-in-from-top duration-300 p-4">
                      <form
                        onSubmit={handleSearch}
                        className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/30 overflow-hidden max-h-[90vh] md:max-w-[600px] mx-auto"
                      >
                        <div className="flex items-center px-6 py-4 border-b border-gray-200/30 bg-gradient-to-r from-[#2E9692] to-[#2E9692]/90">
                          <h3 className="text-lg font-semibold text-white">
                            Search Products
                          </h3>
                          <button
                            type="button"
                            className="ml-auto p-2 rounded-full hover:bg-white/10 transition-all duration-300"
                            onClick={() => setIsSearchExpanded(false)}
                            aria-label="Close search"
                          >
                            <X className="h-6 w-6 text-white" />
                          </button>
                        </div>

                        <div className="p-6">
                          <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              ref={searchInputRef}
                              type="search"
                              placeholder="Search for products..."
                              className="w-full pl-12 pr-12 py-3 border-gray-200/30 focus:border-[#2E9692] focus:ring-[#2E9692] rounded-full text-base bg-gray-50/80 backdrop-blur-sm"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              autoComplete="off"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-[#2E9692] rounded-full hover:bg-gray-100/80"
                                onClick={() => setSearchQuery("")}
                                aria-label="Clear search"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            )}
                          </div>

                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-500 mb-3">
                              Popular Searches
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Protein Powder",
                                "Dumbbells",
                                "Resistance Bands",
                                "Pre-Workout",
                              ].map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => {
                                    setSearchQuery(term);
                                    handleSearch({ preventDefault: () => {} });
                                  }}
                                  className="px-4 py-2 text-sm bg-gray-50/80 hover:bg-[#2E9692]/10 text-gray-700 hover:text-[#2E9692] rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-105"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50/80 backdrop-blur-sm border-t border-gray-200/30 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setIsSearchExpanded(false)}
                            className="px-5 py-2.5 bg-gray-200/80 text-gray-700 rounded-full hover:bg-gray-300/80 transition-all duration-300 font-medium text-sm backdrop-blur-sm hover:scale-105"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-[#2E9692] text-white rounded-full hover:bg-[#2E9692]/90 transition-all duration-300 flex items-center gap-2 font-medium text-sm hover:scale-105"
                          >
                            <Search className="h-4 w-4" />
                            Search
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-gray-600 hover:text-[#2E9692] transition-all duration-300 focus:outline-none hover:scale-110 hidden md:flex items-center gap-2 bg-gray-50/80 hover:bg-[#2E9692]/5 rounded-full backdrop-blur-sm"
                    aria-label="Search"
                  >
                    <Search className="h-5 w-5" />
                    <span className="text-sm mr-1">Search</span>
                  </button>
                )}
              </div>

              {/* Wishlist with modern design */}
              <Link
                href="/wishlist"
                className="hidden md:flex items-center p-2 text-gray-600 hover:text-[#2E9692] transition-all duration-300 relative bg-gray-50/80 hover:bg-[#2E9692]/5 rounded-full gap-2 backdrop-blur-sm hover:scale-110"
              >
                <Heart className="h-5 w-5" />
                <span className="text-sm mr-1">Wishlist</span>
              </Link>

              {/* Cart with modern design */}
              <ClientOnly>
                <Link
                  href="/cart"
                  className="flex items-center p-2 text-gray-600 hover:text-[#2E9692] transition-all duration-300 relative bg-gray-50/80 hover:bg-[#2E9692]/5 rounded-full gap-2 backdrop-blur-sm hover:scale-110"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="hidden md:block text-sm mr-1">Cart</span>
                  {cart && cart.items?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#D5DA2A] text-gray-900 font-medium rounded-full text-xs min-w-5 h-5 flex items-center justify-center px-1 shadow-lg">
                      {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </ClientOnly>

              {/* Account with modern design */}
              <div
                className="hidden md:block relative"
                onMouseEnter={() => handleDropdownHover("account")}
                onMouseLeave={handleDropdownLeave}
              >
                <ClientOnly>
                  <button
                    className={`p-2 ${
                      activeDropdown === "account"
                        ? "text-[#2E9692] bg-[#2E9692]/5"
                        : "text-gray-600 bg-gray-50/80"
                    } hover:text-[#2E9692] hover:bg-[#2E9692]/5 transition-all duration-300 flex items-center gap-2 rounded-full backdrop-blur-sm hover:scale-110`}
                    onClick={() => toggleDropdown("account")}
                    aria-expanded={activeDropdown === "account"}
                  >
                    {isAuthenticated ? (
                      <>
                        <User className="h-5 w-5" />
                        <span className="text-sm">Account</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span className="text-sm">Login</span>
                      </>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${
                        activeDropdown === "account" ? "rotate-180" : ""
                      } group-hover:rotate-180`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl py-3 border border-gray-200/30 z-50 transition-all duration-300 ease-in-out transform origin-top ${
                      activeDropdown === "account"
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-3 border-b border-gray-200/30 mb-2">
                          <p className="font-medium text-lg mb-0.5">
                            Hi, {user?.name || "User"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <div className="px-2 py-1">
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#2E9692]/5 hover:text-[#2E9692] rounded-lg transition-all duration-300 hover:translate-x-1"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <User className="h-5 w-5" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#2E9692]/5 hover:text-[#2E9692] rounded-lg transition-all duration-300 hover:translate-x-1"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>Order History</span>
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#2E9692]/5 hover:text-[#2E9692] rounded-lg transition-all duration-300 hover:translate-x-1"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Heart className="h-5 w-5" />
                            <span>My Wishlist</span>
                          </Link>
                        </div>
                        <div className="px-2 mt-2 pt-2 border-t border-gray-200/30">
                          <button
                            onClick={() => {
                              handleLogout();
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-300 hover:translate-x-1"
                          >
                            <LogIn className="h-5 w-5" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4">
                          <h3 className="text-lg font-medium mb-1">Welcome!</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            Sign in to access your account
                          </p>
                          <Link
                            href="/login"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Button className="w-full mb-2 py-5 text-base hover:scale-[1.02] transition-all duration-300 bg-[#2E9692] hover:bg-[#2E9692]/90 text-white rounded-xl">
                              Login
                            </Button>
                          </Link>
                          <Link
                            href="/register"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Button
                              variant="outline"
                              className="w-full py-5 text-base hover:scale-[1.02] transition-all duration-300 border-[#2E9692] text-[#2E9692] hover:bg-[#2E9692]/5 rounded-xl"
                            >
                              Register
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                </ClientOnly>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu with modern design */}
      <ClientOnly>
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isAuthenticated={isAuthenticated}
          user={user}
          cart={cart}
          handleLogout={handleLogout}
        />
      </ClientOnly>
    </header>
  );
}
