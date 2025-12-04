"use client";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { get } from "node_modules/axios/index.cjs";
export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = React.useState("nothing");
  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.log("Logout failed", error);
    }
  };

  const getUserDetails = async () => {
    const response = await axios.get("/api/users/me");
    console.log("User Details:", response.data);
    setData(response.data.user._id);
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>User Profile</h1>
      <hr />
      <p>Welcome to your profile page!</p>
      <h2 className="p-3 rounded bg-green-500">{data === "nothing"? "Nothing" : <Link href={`/profile/${data}`}>{data}</Link>}</h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-green-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get User Details
      </button>
    </div>
  );
}
