"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgot-password", {
        email,
      });
      console.log("Reset email sent", response.data);
      toast.success("Password reset link sent to your email!");
      setEmailSent(true);
    } catch (error: any) {
      console.log("Failed to send reset email", error.message);
      toast.error(error.response?.data?.error || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
        <h1 className="text-2xl font-semibold text-center mb-2">
          {emailSent ? "Check Your Email" : "Forgot Password?"}
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          {emailSent
            ? "We've sent a password reset link to your email address."
            : "Enter your email and we'll send you a reset link."}
        </p>

        {!emailSent ? (
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                       placeholder-gray-500 focus:outline-none focus:border-blue-500 
                       focus:ring-2 focus:ring-blue-600/40 transition disabled:opacity-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg 
                   shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 
                   disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
              <p className="text-sm text-green-400 text-center">
                If an account exists with {email}, you will receive a password
                reset email shortly.
              </p>
            </div>
            <button
              onClick={() => {
                setEmailSent(false);
                setEmail("");
              }}
              className="w-full py-2.5 bg-zinc-800 text-gray-200 text-sm font-medium rounded-lg 
                   shadow hover:bg-zinc-700 active:scale-95 transition"
            >
              Try Another Email
            </button>
          </div>
        )}

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
