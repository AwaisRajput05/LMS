"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();

  const isCourseList = pathname === "/courseList";
  const isEducatorPage = pathname.startsWith("/educator");

  // Track educator role in state
  const [isEducator, setIsEducator] = useState(false);

  // Optional: Check educator role from backend on mount
  useEffect(() => {
    // If you want to persist educator role after reload, call an API here to check role
    // For now, it resets on reload (can be improved later)
  }, [user]);

  // Handle Become Educator click
  const handleBecomeEducator = async () => {
    try {
      const token = user?.id ? await window.Clerk.session.getToken() : null;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/educator/update-role`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("You can publish a course now");
        setIsEducator(true);
      } else {
        toast.error(data.message || "Failed to update role");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  // Handle Educator Dashboard click
  const handleDashboard = () => {
    router.push("/educator");
  };

  return (
    <nav
      className={`px-6 py-3 flex justify-between items-center shadow-sm transition-colors duration-300 ${
        isEducatorPage
          ? "bg-white text-gray-800"
          : isCourseList
          ? "bg-white text-gray-800"
          : "bg-[#e6f7ff] text-gray-800"
      }`}
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/favicon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="w-8 h-8 sm:w-8 sm:h-8"
        />
        <span className="font-semibold sm:text-4xl text-xl">Edemy</span>
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
        <SignedIn>
          {isEducatorPage ? (
            <span className="text-sm font-medium hidden sm:inline">
              {user?.fullName || user?.firstName || "User"}
            </span>
          ) : (
            <>
              {/* Button design bilkul same hai */}
              {!isEducator ? (
                <button
                  onClick={handleBecomeEducator}
                  className="hover:underline text-xs sm:text-base ml-2 sm:ml-0  px-3 py-1 rounded"
                >
                  Become Educator
                </button>
              ) : (
                <button
                  onClick={handleDashboard}
                  className="hover:underline text-xs sm:text-base ml-2 sm:ml-0  px-3 py-1 rounded"
                >
                  Educator Dashboard
                </button>
              )}
              <p className="text-xs sm:text-base">|</p>
              <Link
                href="/myenrollments"
                className="hover:underline text-xs sm:text-base"
              >
                My Enrollments
              </Link>
            </>
          )}
        </SignedIn>

        <SignedOut>
          <SignInButton mode="modal" redirectUrl="/">
            <button className="bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-blue-700 transition hidden sm:inline">
              Create Account
            </button>
          </SignInButton>

          <SignInButton mode="modal" redirectUrl="/">
            <button
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition sm:hidden"
              title="Create Account"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </nav>
  );
}
