"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  Award,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Happy Customers", value: "10K+" },
    { label: "Products Sold", value: "50K+" },
    { label: "Team Members", value: "50+" },
    { label: "Years Experience", value: "10+" },
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Customer First",
      description:
        "We prioritize our customers' needs and satisfaction above everything else.",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Quality Focus",
      description:
        "We maintain the highest standards in all our products and services.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Innovation",
      description:
        "We constantly innovate to bring you the best products and solutions.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community",
      description:
        "We believe in building strong relationships with our customers and partners.",
    },
  ];

  useEffect(() => {
    async function fetchAboutContent() {
      setLoading(true);
      try {
        const response = await fetchApi("/content/about");
        setContent(response.data);
      } catch (error) {
        console.error("Failed to fetch about page content:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAboutContent();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-2/3 mx-auto mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10 mx-auto" />
          <Skeleton className="w-full h-[400px] mb-10 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Us
            </h1>
            <p className="text-lg text-gray-600">
              We are dedicated to providing the best products and services to
              our customers, with a focus on quality, innovation, and customer
              satisfaction.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-square rounded-2xl overflow-hidden"
          >
            <Image
              src="/about-image.jpg"
              alt="Our Story"
              fill
              className="object-cover"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600">
              Founded in 2014, we started with a simple mission: to provide
              high-quality products that make a difference in people's lives.
              Over the years, we've grown from a small team to a company serving
              thousands of customers worldwide.
            </p>
            <p className="text-gray-600">
              Our journey has been marked by continuous innovation,
              customer-focused development, and a commitment to excellence. We
              believe in creating products that not only meet but exceed our
              customers' expectations.
            </p>
            <div className="flex items-center gap-4">
              <Button className="gap-2">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do, from product development
              to customer service.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="text-primary mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-600">
            We stand out from the competition with our commitment to quality,
            innovation, and customer satisfaction.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            "High-quality products",
            "Fast and reliable shipping",
            "Excellent customer service",
            "Secure payment options",
            "Regular product updates",
            "Loyalty rewards program",
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Journey
            </h2>
            <p className="text-gray-600 mb-8">
              Be part of our growing community and experience the difference we
              make.
            </p>
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Custom content from CMS if available */}
      {content && content.content && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-lg">
              <div dangerouslySetInnerHTML={{ __html: content.content }} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
