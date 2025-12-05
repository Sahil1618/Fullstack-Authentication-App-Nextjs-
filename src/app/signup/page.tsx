"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const [loading, setLoading] = React.useState(false);

  const onSignup = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("signup success", response.data);
      router.push("/login");
      toast.success("Signup successful. Please login.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Signup error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
      <div className="w-full max-w-sm bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
        <h1 className="text-3xl font-semibold text-center mb-6">
          {loading ? "Signing up..." : "Sign Up"}
        </h1>

        <div className="flex flex-col gap-4">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={user.username}
              onChange={(e) => setUser({ ...user, username: e.target.value })}
              placeholder="Enter a username"
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-600/40 transition"
            />
          </div>

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
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-600/40 transition"
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
              placeholder="Create a password"
              className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-blue-500
                     focus:ring-2 focus:ring-blue-600/40 transition"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled}
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg
                 shadow hover:bg-blue-700 active:scale-95 transition
                 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonDisabled ? "Fill all fields" : "Sign Up"}
        </button>

        {/* Login Link */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
