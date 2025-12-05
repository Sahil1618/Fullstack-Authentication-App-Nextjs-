"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [sendingVerification, setSendingVerification] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/me");
      console.log("User Details:", response.data);
      setUserData(response.data.user);
    } catch (error: any) {
      console.log("Failed to get user details", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoggingOut(true);
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout failed", error);
      setLoggingOut(false);
    }
  };

  const sendVerificationEmail = async () => {
    try {
      setSendingVerification(true);
      await axios.post("/api/users/send-verification");
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to send verification email"
      );
      console.log("Send verification failed", error);
    } finally {
      setSendingVerification(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
        <div className="w-full max-w-2xl bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4 bg-black text-gray-100">
      <div className="w-full max-w-2xl bg-zinc-900 p-8 rounded-xl shadow-lg border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold">Profile</h1>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg 
                   shadow hover:bg-red-700 active:scale-95 transition disabled:opacity-50 
                   disabled:cursor-not-allowed"
          >
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="h-px bg-zinc-800 mb-6"></div>

        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-xl text-gray-300 mb-2">
            Welcome back{userData?.username ? `, ${userData.username}` : ""}!
          </h2>
          <p className="text-sm text-gray-500">
            Manage your account information and settings
          </p>
        </div>

        {/* User Information Card */}
        {userData && (
          <div className="bg-zinc-800 rounded-lg p-6 mb-6 border border-zinc-700">
            <h3 className="text-lg font-medium mb-4 text-gray-200">
              Account Information
            </h3>

            <div className="space-y-4">
              {/* Username */}
              {userData.username && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Username
                  </label>
                  <p className="text-gray-200">{userData.username}</p>
                </div>
              )}

              {/* Email */}
              {userData.email && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <p className="text-gray-200">{userData.email}</p>
                </div>
              )}

              {/* User ID */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  User ID
                </label>
                <Link
                  href={`/profile/${userData._id}`}
                  className="text-blue-400 hover:text-blue-300 underline underline-offset-2 
                         transition break-all"
                >
                  {userData._id}
                </Link>
              </div>

              {/* Verification Status */}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-500 uppercase tracking-wide">
                  Email Verification
                </label>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {userData.isVerified ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-green-400 text-sm">Verified</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-yellow-400 text-sm">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                  {!userData.isVerified && (
                    <button
                      onClick={sendVerificationEmail}
                      disabled={sendingVerification}
                      className="px-3 py-1 bg-orange-600 text-white text-xs font-medium rounded 
                             shadow hover:bg-orange-700 active:scale-95 transition disabled:opacity-50 
                             disabled:cursor-not-allowed"
                    >
                      {sendingVerification ? "Sending..." : "Verify Email"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={getUserDetails}
            className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg 
                   shadow hover:bg-blue-700 active:scale-95 transition"
          >
            Refresh Profile
          </button>

          <Link
            href="/profile/settings"
            className="flex-1 py-2.5 bg-zinc-800 text-gray-200 text-sm font-medium rounded-lg 
                   shadow hover:bg-zinc-700 active:scale-95 transition text-center"
          >
            Account Settings
          </Link>
        </div>

        {/* Additional Links */}
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-center text-sm text-gray-500">
            Need help?{" "}
            <Link
              href="/support"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
