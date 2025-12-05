/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUserEmail = async () => {
      if (!token) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        await axios.post("/api/users/verifyemail", { token });
        setVerified(true);
        toast.success("Email verified successfully!");

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 3000);
      } catch (error: any) {
        setError(true);
        toast.error(error.response?.data?.error || "Verification failed");
        console.log("Verification error:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyUserEmail();
  }, [token, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
        <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">Verifying your email...</p>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
        <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Email Verified!
            </h2>
            <p className="text-sm text-gray-400 text-center">
              Your email has been successfully verified.
            </p>
            <p className="text-xs text-gray-500 text-center">
              Redirecting to your profile in 3 seconds...
            </p>
            <Link
              href="/profile"
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                     shadow hover:bg-blue-700 transition"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
        <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center">
              Verification Failed
            </h2>
            <p className="text-sm text-gray-400 text-center">
              This verification link is invalid or has expired.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                href="/profile"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                     shadow hover:bg-blue-700 transition"
              >
                Go to Profile
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-zinc-800 text-gray-200 text-sm font-medium rounded-lg 
                     shadow hover:bg-zinc-700 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
