"use client";
import Image from "next/image";
import Link from "next/link";
import { courses } from "@/lib/coursesData";

// Slug banane ka helper
function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

export default function TopCourses() {
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
          {courses.slice(0, 4).map((course) => (
            <Link
              key={course.title}
              
              href={`/courseList/${slugify(course.title)}`} // Detail page link
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition block"
            >
              {/* Thumbnail */}
              <div className="relative w-full h-44">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-base text-gray-800 leading-tight">
                  {course.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{course.subtitle}</p>
                <p className="text-xs text-gray-500 mt-2">{course.instructor}</p>

                {/* Rating */}
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(course.rating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-500">
                    ({course.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-gray-800">
                    ${course.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
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
