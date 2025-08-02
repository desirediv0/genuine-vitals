import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Loader2 } from "lucide-react";
import { loginbg } from "@/assets";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate inputs
    if (!email.trim()) {
      setFormError("Email is required");
      return;
    }

    if (!password) {
      setFormError("Password is required");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
    } catch (error: any) {
      console.error("Login error:", error);
      setFormError(error.message || "Failed to login. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left branding section (hidden on small screens) */}
      <div
        className="hidden lg:flex flex-col justify-center items-start w-1/2 px-16 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('${loginbg}')`,
          backgroundColor: "#2E948A",
        }}
      >
        <div className="absolute inset-0 bg-[#2E948A]/50" />
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white mr-3">
              <Package className="h-6 w-6 text-[#2E948A]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                Genuine Vitals
              </div>
              <div className="text-xs text-white/80">Admin Portal</div>
            </div>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">
            Genuine Vitals
          </h1>
          <p className="text-xl text-white/90 mb-2">
            Premium Supplements for Your Fitness Journey
          </p>
        </div>
      </div>
      {/* Right login form section */}
      <div className="flex flex-1 min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-2xl border border-gray-200">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#2E948A] shadow-lg">
              <Package className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-600">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          {(error || formError) && (
            <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-gray-700"
              >
                Email{" "}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@login.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
                className="bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-[#2E948A] focus:ring-[#2E948A]"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                required
                className="bg-white text-gray-900 border-gray-300 placeholder-gray-500 focus:border-[#2E948A] focus:ring-[#2E948A]"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2E948A] text-white font-bold shadow-lg hover:bg-[#2E948A]/90 cursor-pointer transition-colors duration-200"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in to Dashboard"
              )}
            </Button>
          </form>
          <div className="pt-8 text-xs text-gray-500 text-center">
            © 2025 Genuine Vitals. All rights reserved.
            <br />
            <span className="underline">Secure admin access portal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
