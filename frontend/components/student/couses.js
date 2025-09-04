"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function slugify(text) {
  return text ? text.toLowerCase().trim().replace(/\s+/g, "-") : "";
}

export default function TopCourses() {
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

  if (loading) return <div>Loading...</div>;

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">
          Learn from the <span className="text-indigo-600">best</span>
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-gray-600">
          Discover our top-rated courses across various categories. From coding and
          design to business and wellness, our courses are crafted to deliver results.
        </p>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {courses.slice(0, 4).map((course, idx) => {
            // Calculate rating from courseRatings array if averageRating missing
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
                href={`/courseList/${slugify(course.courseTitle)}`}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition block"
                data-aos="fade-right"
                data-aos-delay={1000 * (idx + 1)} // 1s, 2s, 3s, 4s
              >
                {/* Thumbnail */}
                <div className="relative w-full h-44">
                  <Image
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-base text-gray-800 leading-tight">
                    {course.courseTitle}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.courseDescription
                      ? course.courseDescription.split(" ").slice(0, 6).join(" ") + "..."
                      : ""}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">{course.educator?.name || "Educator"}</p>
                  
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

                  {/* Price */}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold text-gray-800">
                      ${course.coursePrice}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Show All Button */}
        <div data-aos="fade-up" className="text-center mt-10">
          <Link
            href="/courseList"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Show all courses
          </Link>
        </div>
      </div>
    </section>
  );
}
