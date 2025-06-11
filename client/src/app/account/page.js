"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ClientOnly } from "@/components/client-only";
import { DynamicIcon } from "@/components/dynamic-icon";
import { fetchApi, formatDate } from "@/lib/utils";
import Image from "next/image";
import { ProtectedRoute } from "@/components/protected-route";
import { motion } from "framer-motion";

export default function AccountPage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profileImage: null,
  });
  const [preview, setPreview] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profileImage: null,
      });
    }
  }, [user]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;

      try {
        const response = await fetchApi("/users/addresses", {
          credentials: "include",
        });
        setAddresses(response.data.addresses || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profileImage" && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        profileImage: files[0],
      }));

      // Create preview URL
      const file = files[0];
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await updateProfile(formData);
      setIsEditing(false);
      setMessage({
        type: "success",
        text: "Profile updated successfully",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <ClientOnly>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                <Link href="/products">
                  <Button variant="outline" className="gap-2">
                    <DynamicIcon name="ShoppingBag" className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Information */}
                <div className="lg:col-span-2 space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <DynamicIcon
                              name="User"
                              className="h-5 w-5 text-primary"
                            />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            Profile Information
                          </h2>
                        </div>
                        {!isEditing && (
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            className="gap-2"
                          >
                            <DynamicIcon name="Edit" className="h-4 w-4" />
                            Edit Profile
                          </Button>
                        )}
                      </div>

                      {message.text && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mb-6 p-4 rounded-lg ${
                            message.type === "success"
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {message.text}
                        </motion.div>
                      )}

                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Full Name
                              </label>
                              <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700 mb-2"
                              >
                                Phone Number
                              </label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsEditing(false);
                                setPreview(null);
                                setFormData({
                                  name: user?.name || "",
                                  phone: user?.phone || "",
                                  profileImage: null,
                                });
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="min-w-[120px]"
                            >
                              {isSubmitting ? (
                                <>
                                  <DynamicIcon
                                    name="Loader2"
                                    className="mr-2 h-4 w-4 animate-spin"
                                  />
                                  Saving...
                                </>
                              ) : (
                                "Save Changes"
                              )}
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">
                                Full Name
                              </h3>
                              <p className="mt-1 text-base font-medium text-gray-900">
                                {user?.name || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">
                                Email Address
                              </h3>
                              <p className="mt-1 text-base font-medium text-gray-900">
                                {user?.email || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">
                                Phone Number
                              </h3>
                              <p className="mt-1 text-base font-medium text-gray-900">
                                {user?.phone || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">
                                Member Since
                              </h3>
                              <p className="mt-1 text-base font-medium text-gray-900">
                                {user?.createdAt
                                  ? formatDate(user.createdAt)
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Saved Addresses */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-sm border overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <DynamicIcon
                              name="MapPin"
                              className="h-5 w-5 text-primary"
                            />
                          </div>
                          <h2 className="text-xl font-semibold text-gray-900">
                            Saved Addresses
                          </h2>
                        </div>
                        <Link href="/account/addresses">
                          <Button variant="outline" size="sm" className="gap-2">
                            <DynamicIcon name="Plus" className="h-4 w-4" />
                            Manage Addresses
                          </Button>
                        </Link>
                      </div>

                      {addresses.length > 0 ? (
                        <div className="grid gap-4">
                          {addresses.slice(0, 2).map((address) => (
                            <motion.div
                              key={address.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  {address.isDefault && (
                                    <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md mb-2">
                                      Default
                                    </span>
                                  )}
                                  <p className="font-medium text-gray-900">
                                    {address.name || user?.name}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {address.street}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {address.city}, {address.state}{" "}
                                    {address.postalCode}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {address.country}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {addresses.length > 2 && (
                            <p className="text-sm text-gray-600 text-center">
                              + {addresses.length - 2} more addresses
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 border rounded-lg">
                          <DynamicIcon
                            name="MapPin"
                            className="h-12 w-12 mx-auto text-gray-400 mb-4"
                          />
                          <p className="text-gray-600 mb-4">
                            No addresses added yet
                          </p>
                          <Link href="/account/addresses">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <DynamicIcon name="Plus" className="h-4 w-4" />
                              Add Address
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Security Section */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-sm border p-6 sticky top-20"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        <DynamicIcon
                          name="Shield"
                          className="h-5 w-5 text-primary"
                        />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Security
                      </h2>
                    </div>

                    <div className="space-y-4">
                      <Link href="/account/change-password">
                        <Button variant="outline" className="w-full gap-2">
                          <DynamicIcon name="Lock" className="h-4 w-4" />
                          Change Password
                        </Button>
                      </Link>

                      <div className="pt-4 border-t space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DynamicIcon name="Shield" className="h-4 w-4" />
                          <span>Secure Account</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DynamicIcon name="Bell" className="h-4 w-4" />
                          <span>Email Notifications</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </ClientOnly>
    </ProtectedRoute>
  );
}
