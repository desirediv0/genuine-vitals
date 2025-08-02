"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle,
  CreditCard,
  Mail,
  Phone,
  Shield,
  Truck,
  MapPin,
} from "lucide-react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Free Shipping",
      description:
        "Scratch card reward on every order above ₹999 – try your luck!",
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Secure Payment",
      description: "100% secure transaction",
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Multiple Payment Options",
      description: "Credit cards, UPI & more",
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Quality Products",
      description: "100% genuine supplements",
    },
  ];

  const footerLinks = {
    shop: [
      { label: "All Products", href: "/products" },
      { label: "Protein", href: "/category/protein" },
      { label: "Pre-Workout", href: "/category/pre-workout" },
      { label: "Weight Gainers", href: "/category/weight-gainers" },
      { label: "Vitamins", href: "/category/vitamins" },
    ],
    help: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <div className="text-[#2E9692]">{feature.icon}</div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt="Genuine Vitals"
                width={200}
                height={100}
                className="rounded-lg"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Premium quality fitness supplements to help you achieve your goals
              faster and safer.
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Shop</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[#2E9692] transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Help</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-[#2E9692] transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get the latest updates and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm"
              />
              <Button
                type="submit"
                className="w-full bg-[#2E9692] hover:bg-[#2E9692]/90 text-sm"
                disabled={loading}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <MapPin className="h-5 w-5 text-[#2E9692]" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Address</h4>
                <p className="text-gray-600 text-sm">
                  89/2 sector 39 gurugram haryana
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Phone className="h-5 w-5 text-[#2E9692]" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Phone</h4>
                <p className="text-gray-600 text-sm">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Mail className="h-5 w-5 text-[#2E9692]" />
              <div>
                <h4 className="font-medium text-gray-900 text-sm">Email</h4>
                <p className="text-gray-600 text-sm">info@genuinevitals.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Genuine Vitals. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/terms"
                className="text-sm hover:text-gray-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-gray-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-sm hover:text-gray-300 transition-colors duration-200"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
