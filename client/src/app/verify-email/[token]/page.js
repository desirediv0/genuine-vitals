"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClientOnly } from "@/components/client-only";
import { Check, XCircle, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

// Helper function to check if token was already verified in this session
const wasTokenVerifiedInSession = (token) => {
  if (typeof window === "undefined") return false;

  try {
    const verified = localStorage.getItem(`verified_${token}`);
    return verified === "true";
  } catch (e) {
    console.error("Error checking token verification status:", e);
    return false;
  }
};

// Helper function to mark token as verified in this session
const markTokenAsVerifiedInSession = (token) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(`verified_${token}`, "true");
  } catch (e) {
    console.error("Failed to mark token as verified in session", e);
  }
};

export default function VerifyEmailPage({ params }) {
  const router = useRouter();
  const { token } = params;
  const { verifyEmail, resendVerification } = useAuth();
  const [status, setStatus] = useState("initial"); // initial, verifying, success, error, resent
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);

  // Use a ref to ensure verification is only attempted once
  const verificationAttemptedRef = useRef(false);
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  // Auto redirect after successful verification
  useEffect(() => {
    let timer;
    if (status === "success" && redirectCountdown > 0) {
      timer = setTimeout(() => {
        if (isMounted.current) {
          setRedirectCountdown((prev) => prev - 1);
        }
      }, 1000);
    } else if (status === "success" && redirectCountdown === 0) {
      router.push("/login");
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status, redirectCountdown, router]);

  useEffect(() => {
    // Set mounted flag
    isMounted.current = true;

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Skip if no token or already attempted verification
    if (!token || verificationAttemptedRef.current) {
      return;
    }

    // Set verification attempted flag to prevent multiple attempts
    verificationAttemptedRef.current = true;

    // Check if this token was already verified in this session
    if (wasTokenVerifiedInSession(token)) {
      if (isMounted.current) {
        console.log("Token already verified in this session");
        setStatus("success");
        setMessage("Your email has been verified successfully.");
      }
      return;
    }

    const verify = async () => {
      // Set state to verifying
      if (isMounted.current) {
        setStatus("verifying");
      }

      try {
        const response = await verifyEmail(token);

        // Mark token as verified AFTER successful verification
        markTokenAsVerifiedInSession(token);

        // Only update state if component is still mounted
        if (isMounted.current) {
          setStatus("success");
          const message = response.message || "Email verified successfully";
          setMessage(message);

          // Check if it's already verified or newly verified
          if (message.toLowerCase().includes("already verified")) {
            toast.success("Email already verified! You can now log in.");
          } else {
            toast.success("Email verified successfully! You can now log in.");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);

        // Only update state if component is still mounted
        if (!isMounted.current) return;

        setStatus("error");
        const errorMessage =
          error.message ||
          "Unable to verify email. The token may be invalid or expired.";
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    // Start verification process
    verify();
  }, [token, verifyEmail]);

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!email) return;

    setResending(true);
    try {
      await resendVerification(email);

      if (isMounted.current) {
        setStatus("resent");
        setMessage(
          "Verification email has been resent. Please check your inbox."
        );
        toast.success("Verification email sent! Please check your inbox.");
      }
    } catch (error) {
      if (isMounted.current) {
        const errorMessage =
          error.message || "Failed to resend verification email";
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      if (isMounted.current) {
        setResending(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Email Verification
          </h1>

          <ClientOnly fallback={<div className="py-8">Loading...</div>}>
            {(status === "initial" || status === "verifying") && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary"></div>
                <p className="mt-6 text-lg text-gray-700 font-medium">
                  Verifying your email...
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Please wait while we verify your email address.
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3">
                  <Check className="h-12 w-12 text-green-500" />
                </div>
                <p className="mt-4 text-green-600 font-medium">{message}</p>
                <p className="mt-2 text-gray-600">
                  {message.toLowerCase().includes("already verified")
                    ? "Your email was already verified. You can now log in."
                    : "Your email has been verified successfully."}
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Redirecting to login in {redirectCountdown} seconds...
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Continue to Login <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
                <p className="mt-4 text-red-600 font-medium">{message}</p>
                <p className="mt-2 text-gray-600">
                  Please check if you clicked the correct link or try resending
                  the verification email.
                </p>

                <div className="mt-6 w-full max-w-xs">
                  <form
                    onSubmit={handleResendVerification}
                    className="space-y-3"
                  >
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resending || !email}
                      className="w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:bg-gray-400 transition-all duration-300"
                    >
                      {resending ? "Sending..." : "Resend Verification Email"}
                    </button>
                  </form>
                </div>

                <Link
                  href="/register"
                  className="mt-4 text-primary hover:underline"
                >
                  Back to Registration
                </Link>
              </div>
            )}

            {status === "resent" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="rounded-full bg-green-100 p-3">
                  <Mail className="h-12 w-12 text-green-500" />
                </div>
                <p className="mt-4 text-green-600 font-medium">{message}</p>
                <p className="mt-2 text-gray-600">
                  Please check your email for the verification link.
                </p>
                <Link
                  href="/login"
                  className="mt-6 text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            )}
          </ClientOnly>
        </div>
      </div>
    </div>
  );
}
