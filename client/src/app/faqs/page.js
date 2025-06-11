"use client";

import { useEffect, useState } from "react";
import { fetchApi } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, HelpCircle, Mail, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);

  useEffect(() => {
    async function fetchFAQs() {
      setLoading(true);
      try {
        const response = await fetchApi("/faqs");

        // Handle various possible response formats
        let faqsData = [];
        if (response?.data?.faqs && Array.isArray(response.data.faqs)) {
          // Format: { data: { faqs: [...] } }
          faqsData = response.data.faqs;
        } else if (Array.isArray(response?.data)) {
          // Format: { data: [...] }
          faqsData = response.data;
        } else if (response?.data?.data && Array.isArray(response.data.data)) {
          // Format: { statusCode, data: [...], message, success }
          faqsData = response.data.data;
        }

        setFaqs(faqsData);
        setFilteredFaqs(faqsData);

        // Fetch categories
        const categoriesResponse = await fetchApi("/faqs/categories");

        // Handle categories response format
        let categoriesData = [];
        if (categoriesResponse?.data?.categories) {
          categoriesData = categoriesResponse.data.categories;
        } else if (Array.isArray(categoriesResponse?.data)) {
          categoriesData = categoriesResponse.data;
        } else if (
          categoriesResponse?.data?.data &&
          Array.isArray(categoriesResponse.data.data)
        ) {
          categoriesData = categoriesResponse.data.data;
        }

        if (categoriesData.length) {
          setCategories(["all", ...categoriesData.map((cat) => cat.name)]);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFAQs();
  }, []);

  // Filter FAQs based on search query and category
  useEffect(() => {
    if (!faqs.length) return;

    let filtered = faqs;

    // Filter by category if not "all"
    if (activeCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      );
    }

    // Sort by order (ascending)
    filtered = [...filtered].sort((a, b) => a.order - b.order);

    setFilteredFaqs(filtered);
  }, [searchQuery, activeCategory, faqs]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-10 w-1/2 mx-auto mb-6" />
          <Skeleton className="h-5 w-full mb-2" />
          <Skeleton className="h-5 w-3/4 mb-10 mx-auto" />

          <Skeleton className="h-12 w-full mb-8" />

          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border rounded-md p-2">
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our products, ordering,
              shipping, and more.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-lg mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-primary focus:ring-primary shadow-sm"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Category filters */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                  }`}
                >
                  {category === "all" ? "All Questions" : category}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Accordion */}
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={faq.id.toString()}
                    className="bg-white rounded-lg shadow-sm border px-4"
                  >
                    <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-2 pb-4 pt-1 text-gray-600">
                      <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                No FAQs found for &quot;{searchQuery}&quot;
              </p>
              <span className="text-gray-600">
                Try a different search term or{" "}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="text-primary hover:underline"
                >
                  view all FAQs
                </button>
              </span>
            </div>
          )}

          {/* Contact section */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our support
              team is here to help you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors gap-2"
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </a>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors gap-2"
              >
                <Phone className="h-5 w-5" />
                Call Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
