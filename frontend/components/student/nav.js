"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlus } from "lucide-react";
import {
  UserButton,
  SignInButton,
  SignedIn,
  SignedOut,
  useUser
} from "@clerk/nextjs";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();

  const isCourseList = pathname === "/courseList";
  const isEducatorPage = pathname.startsWith("/educator");

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
            // Educator page pe sirf user ka naam
            <span className="text-sm font-medium hidden sm:inline">
              {user?.fullName || user?.firstName || "User"}
            </span>
          ) : (
            <>
              <Link
                href="/educator"
                className="hover:underline text-xs sm:text-base ml-2 sm:ml-0"
              >
                Become Educator
              </Link>
              <p className="text-xs sm:text-base">|</p>
              <Link href="/myenrollments" className="hover:underline text-xs sm:text-base">
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
