"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";

export default function AccountLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="container mx-auto py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // List of navigation items with their paths and icons
  const navItems = [
    { path: "/account", label: "Profile", icon: "User" },
    { path: "/account/orders", label: "Orders", icon: "Package" },
    { path: "/account/addresses", label: "Addresses", icon: "MapPin" },
    { path: "/wishlist", label: "Wishlist", icon: "Heart" },
  ];

  // Check if the current path matches a nav item
  const isActive = (path) => pathname === path;

  // Special pages like order details or change password that should not show the sidebar
  const specialPages = ["/account/orders/", "/account/change-password"];

  // Check if current path is a special page where we don't show the sidebar
  const isSpecialPage = specialPages.some(
    (path) => pathname.startsWith(path) && pathname !== "/account/orders"
  );

  return (
    <ClientOnly>
      <div className="container mx-auto py-10 px-4">
        {isSpecialPage ? (
          // For pages like order details, just render the children
          children
        ) : (
          // For regular account pages, render with the sidebar
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold mb-4">Account</h2>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={`flex items-center p-2 rounded-md ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <DynamicIcon
                          name={item.icon}
                          className="mr-2 h-5 w-5"
                        />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="md:col-span-3">{children}</div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
