"use client";
import { courses, getStars } from "@/lib/coursesData";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // 👈 Add this

export default function CourseListPage() {
  const searchParams = useSearchParams(); // 👈 Use the hook
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [keyword, setKeyword] = useState(query);

  // Keep keyword in sync with URL query param
  useEffect(() => {
    setKeyword(query);
  }, [query]);

  // Filter logic
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(keyword) ||
      course.subtitle.toLowerCase().includes(keyword)
  );

  // Slug banane ka function
  const generateSlug = (title) =>
    title.toLowerCase().trim().replace(/\s+/g, "-");

  return (
    <section className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Heading + Search Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-gray-800">Course List</h1>

          {/* Search Bar Right */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search course..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value.toLowerCase())}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <a href="/" className="font-semibold text-indigo-600">
            Home
          </a>
          <span className="font-semibold"> / Course List</span>
        </div>

        {/* Current search tag */}
        {keyword && (
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing results for:{" "}
              <span className="font-semibold text-indigo-600">{keyword}</span>
            </span>
            <button
              onClick={() => setKeyword("")}
              className="text-xs text-indigo-600 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/* Course Cards */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Link
                key={course.title}
                href={`/courseList/${generateSlug(course.title)}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition block"
              >
                <div className="relative w-full h-44">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-base text-gray-800">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600">{course.subtitle}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.instructor}
                  </p>

                  <div className="flex items-center space-x-1 mt-2 text-yellow-400 text-sm">
                    {getStars(course.rating).map((type, i) => (
                      <span key={i}>
                        {type === "full" && <FaStar />}
                        {type === "half" && <FaStarHalfAlt />}
                        {type === "empty" && <FaRegStar />}
                      </span>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({course.reviews})
                    </span>
                  </div>

                  <div className="text-sm text-gray-800 mt-2 font-semibold">
                    ${course.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-lg text-center text-red-500">
            Course is not available.
          </p>
        )}
      </div>
    </section>
  );
}
