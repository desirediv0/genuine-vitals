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
} from "lucide-react";

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
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown);
    if (dropdown) {
      setActiveDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null);
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null);
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200"
      ref={navbarRef}
    >
      <Toaster position="top-center" />

      {/* Top announcement bar with scrolling text */}
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="relative">
          <div className="flex animate-scroll whitespace-nowrap">
            <div className="flex items-center space-x-8 text-sm min-w-full">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <span>🎉 Free shipping on orders over ₹999</span>
              <span>💪 Use code FIT10 for 10% off</span>
              <span>⚡ Fast delivery across India</span>
              <span>🏆 100% Authentic supplements</span>
              <span>💳 Secure payment options</span>
              <span>🎯 Expert fitness guidance</span>
            </div>
            <div className="flex items-center space-x-8 text-sm min-w-full">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <span>🎉 Free shipping on orders over ₹999</span>
              <span>💪 Use code FIT10 for 10% off</span>
              <span>⚡ Fast delivery across India</span>
              <span>🏆 100% Authentic supplements</span>
              <span>💳 Secure payment options</span>
              <span>🎯 Expert fitness guidance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar with new layout */}
      <div className="bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation menus */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#2E9692] font-medium transition-colors duration-200"
              >
                All Products
              </Link>

              {/* Categories dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleDropdownHover("categories")}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`flex items-center space-x-1 text-gray-700 hover:text-[#2E9692] font-medium transition-colors duration-200 ${
                    activeDropdown === "categories" ? "text-[#2E9692]" : ""
                  }`}
                  onClick={() => toggleDropdown("categories")}
                >
                  <span>Categories</span>
                  <ArrowDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeDropdown === "categories" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg py-2 border border-gray-200 z-50 transition-all duration-200 ease-in-out ${
                    activeDropdown === "categories"
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Link
                      href="/categories"
                      className="block px-4 py-2 text-[#2E9692] font-medium hover:bg-gray-50"
                      onClick={() => setActiveDropdown(null)}
                    >
                      View All Categories
                    </Link>
                  </div>
                </div>
              </div>

              <Link
                href="/blog"
                className="text-gray-700 hover:text-[#2E9692] font-medium transition-colors duration-200"
              >
                Blog
              </Link>

              <Link
                href="/about"
                className="text-gray-700 hover:text-[#2E9692] font-medium transition-colors duration-200"
              >
                About
              </Link>

              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#2E9692] font-medium transition-colors duration-200"
              >
                Contact
              </Link>
            </div>

            {/* Center - Logo */}
            <div className="flex-1 flex justify-center lg:flex-none">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.jpeg"
                  alt="Genuine Vitals"
                  width={120}
                  height={40}
                  className="rounded-lg"
                />
              </Link>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                {isSearchExpanded ? (
                  <>
                    <div
                      className="fixed inset-0 bg-black/20 z-40"
                      onClick={() => setIsSearchExpanded(false)}
                    />
                    <div className="fixed inset-x-0 top-0 z-50 w-full p-4">
                      <form
                        onSubmit={handleSearch}
                        className="relative bg-white rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto"
                      >
                        <div className="flex items-center p-3">
                          <Search className="h-5 w-5 text-gray-400 mr-3" />
                          <Input
                            ref={searchInputRef}
                            type="search"
                            placeholder="Search products..."
                            className="flex-1 border-0 focus:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button
                            type="button"
                            onClick={() => setIsSearchExpanded(false)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </form>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => setIsSearchExpanded(true)}
                    className="p-2 text-gray-700 hover:text-[#2E9692] transition-colors duration-200"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:block p-2 text-gray-700 hover:text-[#2E9692] transition-colors duration-200"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {/* Cart */}
              <ClientOnly>
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-[#2E9692] transition-colors duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cart && cart.items?.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#2E9692] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {cart.items.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </ClientOnly>

              {/* Account */}
              <div
                className="hidden md:block relative"
                onMouseEnter={() => handleDropdownHover("account")}
                onMouseLeave={handleDropdownLeave}
              >
                <ClientOnly>
                  <button
                    className={`flex items-center space-x-1 p-2 text-gray-700 hover:text-[#2E9692] transition-colors duration-200 ${
                      activeDropdown === "account" ? "text-[#2E9692]" : ""
                    }`}
                    onClick={() => toggleDropdown("account")}
                  >
                    {isAuthenticated ? (
                      <>
                        <User className="h-5 w-5" />
                        <span className="text-sm font-medium">Account</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span className="text-sm font-medium">Login</span>
                      </>
                    )}
                    <ArrowDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeDropdown === "account" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg py-2 border border-gray-200 z-50 transition-all duration-200 ease-in-out ${
                      activeDropdown === "account"
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm text-gray-900 font-medium">
                            {user?.name || "User"}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <Link
                          href="/account"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Wishlist
                        </Link>
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors duration-200"
                          >
                            Logout
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Login
                        </Link>
                        <Link
                          href="/register"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#2E9692] transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </ClientOnly>
              </div>

              {/* Mobile menu button */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:text-[#2E9692] transition-colors duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden bg-white border-t border-gray-200 transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-4">
          {/* Mobile search */}
          <form onSubmit={handleSearch} className="flex space-x-2">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" className="bg-[#2E9692]">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          {/* Mobile navigation */}
          <div className="space-y-2">
            <Link
              href="/products"
              className="block py-2 text-gray-700 hover:text-[#2E9692] font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              href="/categories"
              className="block py-2 text-gray-700 hover:text-[#2E9692] font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/blog"
              className="block py-2 text-gray-700 hover:text-[#2E9692] font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-[#2E9692] font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-gray-700 hover:text-[#2E9692] font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          </div>

          {/* Mobile account section */}
          <div className="border-t border-gray-200 pt-4">
            <ClientOnly>
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="py-2">
                    <p className="text-sm text-gray-900 font-medium">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    className="block py-2 text-gray-700 hover:text-[#2E9692]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="block py-2 text-gray-700 hover:text-[#2E9692]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-2 text-gray-700 hover:text-[#2E9692]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-[#2E9692]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-gray-700 hover:text-[#2E9692]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </ClientOnly>
          </div>
        </div>
      </div>
    </header>
  );
}
