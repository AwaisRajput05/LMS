"use client";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CourseListPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [keyword, setKeyword] = useState(query);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/all`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setKeyword(query);
  }, [query]);

  // Filter logic with null checks
  const filteredCourses = courses.filter(
    (course) =>
      (course.courseTitle && course.courseTitle.toLowerCase().includes(keyword)) ||
      (course.courseDescription && course.courseDescription.toLowerCase().includes(keyword))
  );

  // Slug banane ka function
  const generateSlug = (title) =>
    title ? title.toLowerCase().trim().replace(/\s+/g, "-") : "";

  if (loading) return <div>Loading...</div>;

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
            {filteredCourses.map((course) => {
              // Calculate rating from courseRatings array if not present
              let rating = 0;
              if (typeof course.averageRating === "number") {
                rating = course.averageRating;
              } else if (typeof course.rating === "number") {
                rating = course.rating;
              } else if (Array.isArray(course.courseRatings) && course.courseRatings.length > 0) {
                rating =
                  course.courseRatings.reduce((sum, r) => sum + (r.rating || 0), 0) /
                  course.courseRatings.length;
              }

              return (
                <Link
                  key={course._id}
                  href={`/courseList/${generateSlug(course.courseTitle)}`}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition block"
                >
                  <div className="relative w-full h-44">
                    <Image
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-base text-gray-800">
                      {course.courseTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {course.courseDescription
                        ? course.courseDescription.split(" ").slice(0, 6).join(" ") + "..."
                        : ""}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      {Array.from({ length: 5 }).map((_, i) => {
                        if (rating >= i + 1) {
                          return <FaStar key={i} className="text-yellow-400" />;
                        } else if (rating > i && rating < i + 1) {
                          return <FaStarHalfAlt key={i} className="text-yellow-400" />;
                        } else {
                          return <FaRegStar key={i} className="text-yellow-400" />;
                        }
                      })}
                      <span className="ml-2 text-xs text-gray-500">
                        {rating > 0 ? rating.toFixed(1) : "No rating"}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {course.educator?.name || "Educator"}
                    </p>
                    {/* Price */}
                    <div className="text-sm text-gray-800 mt-2 font-semibold">
                      ${course.coursePrice}
                    </div>
                  </div>
                </Link>
              );
            })}
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
