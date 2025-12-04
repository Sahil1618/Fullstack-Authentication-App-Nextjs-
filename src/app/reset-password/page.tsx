"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        toast.error("Invalid reset link");
        setVerifying(false);
        return;
      }

      try {
        await axios.post("/api/users/verify-reset-token", { token });
        setTokenValid(true);
      } catch (error: any) {
        console.log("Token verification failed", error.message);
        toast.error("Invalid or expired reset link");
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const validatePassword = () => {
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) return;

    try {
      setLoading(true);
      const response = await axios.post("/api/users/reset-password", {
        token,
        password,
      });
      console.log("Password reset success", response.data);
      toast.success("Password reset successfully!");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      console.log("Password reset failed", error.message);
      toast.error(error.response?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
        <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
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
            <h2 className="text-xl font-semibold text-center">Invalid Link</h2>
            <p className="text-sm text-gray-400 text-center">
              This password reset link is invalid or has expired.
            </p>
            <div className="flex gap-3 mt-4">
              <Link
                href="/forgot-password"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                     shadow hover:bg-blue-700 transition"
              >
                Request New Link
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 bg-zinc-800 text-gray-200 text-sm font-medium rounded-lg 
                     shadow hover:bg-zinc-700 transition"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Your Password
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          Enter your new password below
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength={8}
              disabled={loading}
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-600/40 transition disabled:opacity-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-600/40 transition disabled:opacity-50"
            />
          </div>

          {/* Password Match Indicator */}
          {password && confirmPassword && (
            <div
              className={`text-xs p-2 rounded ${
                password === confirmPassword
                  ? "bg-green-900/20 text-green-400"
                  : "bg-red-900/20 text-red-400"
              }`}
            >
              {password === confirmPassword
                ? "✓ Passwords match"
                : "✗ Passwords do not match"}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !password || !confirmPassword}
            className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg 
                 shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 
                 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-center text-sm mt-6">
          <Link
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
            href="/login"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
