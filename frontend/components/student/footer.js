"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const isEducatorPage = pathname.startsWith("/educator");
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (!isEducatorPage) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 50; // 50px from bottom
      setShowFooter(scrollPosition >= threshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // check on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEducatorPage]);

  if (isEducatorPage) {
    // Educator page footer (minimal design, only shows at bottom)
    return showFooter ? (
      <footer className="bg-white border-t border-gray-200 py-6 px-6 flex flex-col-reverse sm:flex-row items-center justify-between w-full z-50">
        {/* Left side (on desktop) / Bottom (on mobile): Logo + Text */}
        <div className="flex items-center space-x-3 mt-4 sm:mt-0 sm:ml-12">
          <Image src="/images/favicon.svg" alt="Edemy Logo" width={32} height={32} />
          <span className="font-bold text-lg text-gray-900">Edemy</span>
          <span className="text-gray-400">|</span>
          <span className="text-sm text-gray-500">
            All rights reserved. Copyright @Edemy
          </span>
        </div>

        {/* Right side (on desktop) / Top (on mobile): Social icons */}
        <div className="flex space-x-3 sm:mt-0 sm:mr-12">
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-[#3b82f6] hover:border-[#3b82f6] transition"
          >
            <FaFacebookF size={14} className="text-gray-600 hover:text-white transition" />
          </a>
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-[#3b82f6] hover:border-[#3b82f6] transition"
          >
            <FaTwitter size={14} className="text-gray-600 hover:text-white transition" />
          </a>
          <a
            href="#"
            className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:bg-[#3b82f6] hover:border-[#3b82f6] transition"
          >
            <FaInstagram size={14} className="text-gray-600 hover:text-white transition" />
          </a>
        </div>
      </footer>
    ) : null;
  }

  // Default footer (your old design)
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Image src="/images/favicon.svg" alt="Edemy Logo" width={32} height={32} />
              <h3 className="text-xl font-bold text-white ml-2">Edemy</h3>
            </div>
            <p className="text-sm leading-relaxed ">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text.
            </p>
          </div>

          {/* Quick Links */}
          <div className="pl-0 md:pl-44">
            <h4 className="font-semibold text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/" className="hover:text-white transition">About us</a></li>
              <li><a href="/" className="hover:text-white transition">Contact us</a></li>
              <li><a href="/" className="hover:text-white transition">Privacy policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="pl-0 md:pl-44 md:col-span-2">
            <h4 className="font-semibold text-white mb-3">Subscribe to our newsletter</h4>
            <p className="text-sm mb-3 leading-relaxed">
              The latest news, articles, and resources, sent to <br /> your inbox weekly.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 py-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:max-w-xs px-3 py-2 rounded-md text-sm bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm">
          Copyright 2025 @ Edemy. All Right Reserved.
        </div>
      </div>
    </footer>
  );
}
