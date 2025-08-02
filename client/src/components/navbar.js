"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import Image from "next/image";
import { toast, Toaster } from "sonner";
import {
  ArrowDown,
  Heart,
  LogIn,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
  X,
  Truck,
  Package,
  ArrowRight,
} from "lucide-react";
import { logo } from "@/assets";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const announcements = [
    {
      icon: <Phone className="h-4 w-4" />,
      text: "24/7 Customer Support: +91 98765 43210",
    },
    {
      icon: <Truck className="h-4 w-4" />,
      text: "Scratch card reward on every order above ₹999 – try your luck!",
    },

    {
      icon: <Package className="h-4 w-4" />,
      text: "100% Authentic supplements guaranteed",
    },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Rotating announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [announcements.length]);

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
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownHover = (dropdown) => {
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    setTimeout(() => {
      if (!navbarRef.current?.contains(document.activeElement)) {
        setActiveDropdown(null);
      }
    }, 150);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200"
            : "bg-white shadow-lg border-b border-gray-100"
        }`}
        ref={navbarRef}
      >
        <Toaster position="top-center" />

        {/* Top announcement bar with smooth transitions */}
        <div className="bg-primary text-primary-foreground py-3 overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center relative h-6">
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex justify-center items-center transition-all duration-500 ${
                    index === announcementIndex
                      ? "opacity-100 translate-y-0"
                      : index ===
                        (announcementIndex - 1 + announcements.length) %
                          announcements.length
                      ? "opacity-0 -translate-y-full"
                      : "opacity-0 translate-y-full"
                  }`}
                >
                  <div className="flex items-center space-x-2 text-sm font-medium capitalize">
                    {announcement.icon}
                    <span>{announcement.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-primary-foreground/30 w-full">
            <div
              className="h-full bg-primary-foreground transition-all duration-4000 ease-linear"
              style={{
                width: `${
                  ((announcementIndex + 1) / announcements.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        {/* Main navbar with enhanced design */}
        <div
          className={`bg-white/95 backdrop-blur-sm transition-all duration-300 ${
            isScrolled ? "py-2" : "py-0"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo - Left positioned */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center group">
                  <div className="relative overflow-hidden rounded-xl">
                    <Image
                      src="/logo.png"
                      alt="Genuine Vitals"
                      width={150}
                      height={150}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation - Centered */}
              <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                <Link
                  href="/products"
                  className="relative text-gray-700 hover:text-primary font-medium transition-all duration-300 group py-2"
                >
                  All Products
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>

                {/* Categories dropdown with enhanced design */}
                <div
                  className="relative"
                  onMouseEnter={() => handleDropdownHover("categories")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className={`flex items-center space-x-1 text-gray-700 hover:text-primary font-medium transition-all duration-300 relative group py-2 ${
                      activeDropdown === "categories" ? "text-primary" : ""
                    }`}
                    onClick={() => toggleDropdown("categories")}
                  >
                    <span>Categories</span>
                    <ArrowDown
                      className={`h-4 w-4 transition-all duration-300 ${
                        activeDropdown === "categories"
                          ? "rotate-180 text-primary"
                          : ""
                      }`}
                    />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                  </button>

                  <div
                    className={`absolute left-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl py-6 border border-gray-100 z-50 transition-all duration-300 ease-out ${
                      activeDropdown === "categories"
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                    }`}
                  >
                    <div className="px-6 pb-4 mb-4 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <Package className="h-5 w-5 text-primary mr-2" />
                        Shop by Category
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Find your perfect supplement
                      </p>
                    </div>

                    <div className="max-h-72 overflow-y-auto px-2">
                      {categories.map((category, index) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="flex items-center justify-between px-4 py-3 mx-2 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group rounded-xl"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="flex-1">
                            <div className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                              {category.name}
                            </div>
                            {category._count && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {category._count.products} products available
                              </div>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                      <Link
                        href="/categories"
                        className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-medium transition-all duration-200 group"
                        onClick={() => setActiveDropdown(null)}
                      >
                        View All Categories
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  href="/blog"
                  className="relative text-gray-700 hover:text-primary font-medium transition-all duration-300 group py-2"
                >
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
                <Link
                  href="/about"
                  className="relative text-gray-700 hover:text-primary font-medium transition-all duration-300 group py-2"
                >
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
                <Link
                  href="/contact"
                  className="relative text-gray-700 hover:text-primary font-medium transition-all duration-300 group py-2"
                >
                  Contact
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </Link>
              </nav>

              {/* Right side actions */}
              <div className="flex items-center space-x-2">
                {/* Enhanced Search */}
                <div className="relative">
                  {isSearchExpanded ? (
                    <>
                      <div
                        className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
                        onClick={() => setIsSearchExpanded(false)}
                      />
                      <div className="fixed inset-x-0 top-0 z-50 w-full p-4">
                        <form
                          onSubmit={handleSearch}
                          className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 max-w-2xl mx-auto overflow-hidden"
                        >
                          <div className="flex items-center p-6">
                            <Search className="h-6 w-6 text-primary mr-4" />
                            <Input
                              ref={searchInputRef}
                              type="search"
                              placeholder="Search supplements, proteins, vitamins, pre-workouts..."
                              className="flex-1 border-0 focus:ring-0 text-lg bg-transparent placeholder:text-gray-400"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => setIsSearchExpanded(false)}
                              className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all duration-200"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="px-6 pb-4">
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Protein",
                                "Creatine",
                                "BCAA",
                                "Pre-workout",
                              ].map((term) => (
                                <button
                                  key={term}
                                  type="button"
                                  onClick={() => setSearchQuery(term)}
                                  className="px-3 py-1 bg-gray-100 hover:bg-primary hover:text-primary-foreground rounded-full text-sm transition-all duration-200"
                                >
                                  {term}
                                </button>
                              ))}
                            </div>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsSearchExpanded(true)}
                      className="p-3 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                    >
                      <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    </button>
                  )}
                </div>

                {/* Cart with enhanced design */}
                <ClientOnly>
                  <Link
                    href="/cart"
                    className="relative p-3 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                  >
                    <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    {cart && cart.items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {cart.items.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}
                      </span>
                    )}
                  </Link>
                </ClientOnly>

                {/* Enhanced Account dropdown with wishlist integration */}
                <div
                  className="hidden md:block relative"
                  onMouseEnter={() => handleDropdownHover("account")}
                  onMouseLeave={handleDropdownLeave}
                >
                  <ClientOnly>
                    <button
                      className={`flex items-center space-x-2 p-3 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition-all duration-200 group ${
                        activeDropdown === "account"
                          ? "text-primary bg-gray-100"
                          : ""
                      }`}
                      onClick={() => toggleDropdown("account")}
                    >
                      {isAuthenticated ? (
                        <>
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shadow-md">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <span className="text-sm font-medium hidden xl:inline max-w-20 truncate">
                            {user?.name?.split(" ")[0] || "Account"}
                          </span>
                        </>
                      ) : (
                        <>
                          <LogIn className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="text-sm font-medium hidden xl:inline">
                            Login
                          </span>
                        </>
                      )}
                      <ArrowDown
                        className={`h-4 w-4 transition-all duration-300 ${
                          activeDropdown === "account"
                            ? "rotate-180 text-primary"
                            : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`absolute right-0 top-full mt-3 w-72 bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl py-6 border border-gray-100 z-50 transition-all duration-300 ease-out ${
                        activeDropdown === "account"
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
                      }`}
                    >
                      {isAuthenticated ? (
                        <>
                          {/* User Profile Section */}
                          <div className="px-6 pb-4 mb-4 border-b border-gray-100">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base font-bold text-gray-900 truncate">
                                  {user?.name || "User"}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {user?.email}
                                </p>
                                <div className="flex items-center mt-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                  <span className="text-xs text-green-600 font-medium">
                                    Active
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Wishlist Integration */}
                          <Link
                            href="/wishlist"
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-center">
                              <Heart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              <span className="font-medium">My Wishlist</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                0
                              </span>
                              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                            </div>
                          </Link>

                          {/* Other Menu Items */}
                          <Link
                            href="/account"
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              <span className="font-medium">My Account</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </Link>

                          <Link
                            href="/account/orders"
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-center">
                              <Package className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              <span className="font-medium">My Orders</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </Link>

                          <div className="border-t border-gray-100 mt-4 pt-4 px-6">
                            <button
                              onClick={handleLogout}
                              className="flex items-center justify-center w-full py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all duration-200 group"
                            >
                              <LogIn className="h-4 w-4 mr-2 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                              Logout
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="px-6 pb-4 mb-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                              Welcome!
                            </h3>
                            <p className="text-sm text-gray-600">
                              Sign in to access your account
                            </p>
                          </div>

                          <Link
                            href="/login"
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-center">
                              <LogIn className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              <span className="font-medium">Login</span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </Link>

                          <Link
                            href="/register"
                            className="flex items-center justify-between px-6 py-3 text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="flex items-center">
                              <User className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                              <span className="font-medium">
                                Create Account
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                          </Link>
                        </>
                      )}
                    </div>
                  </ClientOnly>
                </div>

                {/* Mobile menu button */}
                <button
                  className="lg:hidden p-3 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-xl transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
                  ) : (
                    <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile menu */}
        <div
          className={`lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-screen opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6"
              >
                Search
              </Button>
            </form>

            {/* Mobile navigation */}
            <nav className="space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/categories", label: "Categories" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 font-medium rounded-xl transition-all duration-200 group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Mobile account section */}
            <div className="border-t border-gray-100 pt-6">
              <ClientOnly>
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-4 px-4 py-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-900 truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Wishlist */}
                    <Link
                      href="/wishlist"
                      className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Heart className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        My Wishlist
                      </span>
                    </Link>

                    <Link
                      href="/account"
                      className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        My Account
                      </span>
                    </Link>

                    <Link
                      href="/account/orders"
                      className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Package className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        My Orders
                      </span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full py-4 px-4 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                      <LogIn className="h-5 w-5 mr-3 rotate-180 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Logout
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogIn className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Login
                      </span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center py-4 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                        Create Account
                      </span>
                    </Link>
                  </div>
                )}
              </ClientOnly>
            </div>
          </div>
        </div>
      </header>
      {/* Enhanced Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200/50 z-50 shadow-2xl">
        {/* Gradient overlay for better visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none" />

        <div className="relative grid grid-cols-5 gap-1 px-2 py-3">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 group ${
              pathname === "/"
                ? "text-primary bg-primary/10 shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <div
              className={`relative ${
                pathname === "/" ? "scale-110" : "group-hover:scale-110"
              } transition-transform duration-300`}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill={pathname === "/" ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {pathname === "/" && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                pathname === "/" ? "text-primary" : "text-gray-600"
              }`}
            >
              Home
            </span>
          </Link>

          {/* Products */}
          <Link
            href="/products"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 group ${
              pathname === "/products"
                ? "text-primary bg-primary/10 shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <div
              className={`relative ${
                pathname === "/products" ? "scale-110" : "group-hover:scale-110"
              } transition-transform duration-300`}
            >
              <Package className="h-6 w-6" />
              {pathname === "/products" && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                pathname === "/products" ? "text-primary" : "text-gray-600"
              }`}
            >
              Products
            </span>
          </Link>

          {/* Cart with badge */}
          <Link
            href="/cart"
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 group relative ${
              pathname === "/cart"
                ? "text-primary bg-primary/10 shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <div
              className={`relative ${
                pathname === "/cart" ? "scale-110" : "group-hover:scale-110"
              } transition-transform duration-300`}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart && cart.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center font-bold animate-bounce shadow-lg">
                  {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
              {pathname === "/cart" && (
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                pathname === "/cart" ? "text-primary" : "text-gray-600"
              }`}
            >
              Cart
            </span>
          </Link>

          {/* Account */}
          <Link
            href={isAuthenticated ? "/account" : "/login"}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all duration-300 group ${
              pathname.includes("/account") || pathname === "/login"
                ? "text-primary bg-primary/10 shadow-lg"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <div
              className={`relative ${
                pathname.includes("/account") || pathname === "/login"
                  ? "scale-110"
                  : "group-hover:scale-110"
              } transition-transform duration-300`}
            >
              {isAuthenticated ? (
                <User className="h-6 w-6" />
              ) : (
                <LogIn className="h-6 w-6" />
              )}
              {(pathname.includes("/account") || pathname === "/login") && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
            <span
              className={`text-xs mt-1 font-medium ${
                pathname.includes("/account") || pathname === "/login"
                  ? "text-primary"
                  : "text-gray-600"
              }`}
            >
              {isAuthenticated ? "Account" : "Login"}
            </span>
          </Link>

          {/* Logo - Main Site Link */}
          <a
            href="https://genuinenutrition.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-1"
          >
            <div className=" transition-transform duration-300">
              <Image
                src={logo}
                alt="Genuine Nutrition"
                width={100}
                height={100}
                className="h-full w-full object-contain"
              />
            </div>
          </a>
        </div>

        {/* Bottom safe area for devices with home indicator */}
        <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
      </div>
    </>
  );
}
