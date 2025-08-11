"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MyEnrollments() {
  // Static course info
  const courseList = [
    { id: 1, title: "Introduction to JavaScript", image: "/images/course_1.png" },
    { id: 2, title: "Advanced Python Programming", image: "/images/course_2.png" },
    { id: 3, title: "Cybersecurity Basics", image: "/images/course_3.png" },
    { id: 4, title: "Web Development Bootcamp", image: "/images/course_4.png" },
  ];

  const [progressData, setProgressData] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("courseProgress") || "{}");
    setProgressData(stored);
  }, []);

  const calculateProgress = (completedArr, total) => {
    if (!total) return 0;
    return Math.round((completedArr.length / total) * 100);
  };

  const getStatus = (completedArr, total) => {
    if (completedArr.length === total && total > 0) return "Completed";
    if (completedArr.length > 0) return "On Going";
    return "Not Started";
  };

  return (
    <section className="p-12 mx-4 lg:mx-8">
      <h1 className="text-2xl font-bold mb-6">My Enrollments</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 border-b border-gray-100">
              <th className="p-4">Course</th>
              <th className="p-4">Duration</th>
              <th className="p-4">Completed</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {courseList.map((course) => {
              const stored = progressData[course.id] || { completed: [], total: 0, duration: "—" };
              const progress = calculateProgress(stored.completed, stored.total);
              const status = getStatus(stored.completed, stored.total);

              return (
                <tr
                  key={course.id}
                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {/* Course Column */}
                  <td className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-12 flex-shrink-0">
                        <Image src={course.image} alt={course.title} fill className="object-cover rounded" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{course.title}</p>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress === 100
                                ? "bg-green-500"
                                : progress > 0
                                ? "bg-blue-500"
                                : "bg-gray-300"
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{progress}% completed</p>
                      </div>
                    </div>
                  </td>

                  {/* Duration */}
                  <td className="p-4 text-gray-700">{stored.duration}</td>

                  {/* Completed */}
                  <td className="p-4 text-gray-700">
                    {stored.completed.length} / {stored.total}{" "}
                    <span className="text-sm text-gray-500">Lectures</span>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <Link href={`/myenrollments/${course.id}`}>
                      <span
                        className={`inline-block w-24 px-3 py-2 rounded text-white text-sm font-medium text-center cursor-pointer ${
                          status === "Completed"
                            ? "bg-green-600"
                            : status === "On Going"
                            ? "bg-blue-600"
                            : "bg-gray-500"
                        }`}
                      >
                        {status}
                      </span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
