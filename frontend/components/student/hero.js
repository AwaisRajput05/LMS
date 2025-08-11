"use client";
import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/courseList?query=${encodeURIComponent(query)}`);
  };

  return (
    <section className="bg-gradient-to-b from-sky-50 via-sky-100 to-white py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Empower your future with the <br /> courses designed to
          <span className="text-indigo-600"> fit your choice.</span>
        </h1>

        <div className="mt-0 ml-[670px]">
          <Image
            src="/images/sktech.svg"
            alt="Sketch"
            width={220}
            height={220}
            priority
          />
        </div>

        {/* Sub-text */}
        <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-700">
          We bring together world-class instructors, interactive content, and a
          supportive community to help you achieve your personal and professional goals.
        </p>

        {/* Search Bar */}
        <div className="mt-10 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for courses"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-12 pr-28 py-3 rounded-full border border-gray-300
                         focus:ring-2 focus:ring-indigo-500 focus:outline-none
                         shadow-sm text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <button
              type="button"
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white 
                         px-4 py-2 rounded-full text-sm hover:bg-indigo-700 transition"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}