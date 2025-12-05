"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success("Login success");
      router.push("/profile");
    } catch (error: any) {
      console.log("Login failed", error);
      // Access the error message from the API response
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
        <h1 className="text-3xl font-semibold text-center mb-6">
          {loading ? "Processing..." : "Login"}
        </h1>

        <div className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter your email"
              disabled={loading}
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-600/40 transition disabled:opacity-50"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter your password"
              disabled={loading}
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500 
                     focus:ring-2 focus:ring-blue-600/40 transition disabled:opacity-50"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-center mt-6">
          <button
            onClick={onLogin}
            disabled={buttonDisabled || loading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg 
                 shadow hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 
                 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link href="/forgot-password">
            <button
              className="px-4 py-2 bg-orange-500 text-black text-sm font-medium rounded-lg 
                   shadow hover:bg-orange-600 active:scale-95 transition"
            >
              Forgot Password
            </button>
          </Link>
        </div>

        {/* Signup Link */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
