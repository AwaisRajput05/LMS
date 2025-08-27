// app/courseList/[slug]/page.js
"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaPlay,
  FaChevronDown,
  FaEye,
  FaTimes
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useUser, useAuth } from "@clerk/nextjs";

function slugify(text) {
  return text ? text.toLowerCase().trim().replace(/\s+/g, "-") : "";
}

function parseDuration(duration) {
  if (!duration) return 0;
  // If duration is number (from backend), just return it
  if (typeof duration === "number") return duration;
  const lower = duration.toLowerCase();
  let minutes = 0;
  if (lower.includes("h")) {
    const [h, rest] = lower.split("h");
    minutes += parseInt(h.trim()) * 60;
    if (rest.includes("min")) {
      minutes += parseInt(rest.replace("mins", "").trim() || 0);
    }
  } else if (lower.includes("min")) {
    minutes += parseInt(lower.replace("mins", "").trim() || 0);
  }
  return minutes;
}

function formatMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export default function CourseDetailPage({ params }) {
  const { slug } = React.use(params); // Unwrap params
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState([0]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    // Step 1: Get all courses, find course by slug, get its _id
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/all`)
      .then((res) => res.json())
      .then((data) => {
        const found = (data.courses || []).find(
          (c) => slugify(c.courseTitle) === slug
        );
        if (found && found._id) {
          // Step 2: Get course detail by ID
          fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/course/${found._id}`)
            .then((res) => res.json())
            .then((detail) => {
              setCourse(detail.courseData || null);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setCourse(null);
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !user.id || !course?._id) return;
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      const enrolled = (data.enrolledCourses || []).some(
        (c) => c._id === course._id
      );
      setIsEnrolled(enrolled);
    };
    checkEnrollment();
  }, [user, course, getToken]);

  const toggleSection = (idx) => {
    if (openSections.includes(idx)) {
      setOpenSections(openSections.filter((i) => i !== idx));
    } else {
      setOpenSections([...openSections, idx]);
    }
  };

  const handlePreview = (lectureUrl) => {
    setPreviewVideo(lectureUrl);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewVideo("");
  };

  const handleEnroll = async () => {
    if (!user || !user.id) {
      toast.error("Login to enroll");
      return;
    }
    if (isEnrolled) {
      toast.info("Already enrolled");
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ courseId: course._id }),
      });
      const data = await res.json();
      if (data.success && data.session_url) {
        // Redirect to Stripe checkout
        window.location.href = data.session_url;
      } else {
        toast.error(data.message || "Enrollment failed");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
  };

  // Rating stars logic
  const getStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push("full");
      else if (rating > i - 1) stars.push("half");
      else stars.push("empty");
    }
    return stars;
  };

  function getEmbedUrl(url) {
    if (!url) return "";
    // YouTube normal link to embed link
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]+)/);
    if (ytMatch) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    return url; // For other video links, return as is
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Course not found
      </div>
    );
  }

  // Calculate average rating from courseRatings array
  const ratingsArr = course.courseRatings || [];
  const averageRating =
    ratingsArr.length > 0
      ? (
          ratingsArr.reduce((acc, r) => acc + (r.rating || 0), 0) /
          ratingsArr.length
        ).toFixed(1)
      : 0;

  // Course sections/chapters from backend
  const sections = course.courseContent || [];

  // Total lectures and duration
  const totalLectures = sections.reduce(
    (acc, sec) => acc + (sec.chapterContent?.length || 0),
    0
  );
  const totalMinutes = sections.reduce(
    (acc, sec) =>
      acc +
      (sec.chapterContent || []).reduce(
        (lecAcc, lec) => lecAcc + parseDuration(lec.lectureDuration),
        0
      ),
    0
  );

  return (
    <section className="bg-[linear-gradient(to_bottom,_#e0f2fe_0%,_#f0f9ff_35%,_white_100%)] min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RIGHT SIDEBAR */}
        <div className="order-1 lg:order-2">
          {/* Video Preview or Course Image */}
          {showPreview ? (
            <div className="relative w-full h-56 rounded-lg overflow-hidden bg-black">
              <iframe
                src={getEmbedUrl(previewVideo)}
                title="Course Preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              <button
                onClick={closePreview}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="relative w-full h-56 rounded-lg overflow-hidden">
              <Image src={course.courseThumbnail} alt={course.courseTitle} fill className="object-cover" />
            </div>
          )}

          <p className="text-sm text-red-500 mt-4">5 days left at this price!</p>

          <div className="mt-1 flex items-center space-x-3">
            <span className="text-2xl font-bold text-indigo-600">${course.coursePrice}</span>
            {course.discount && (
              <>
                <span className="line-through text-gray-400">${(course.coursePrice / (1 - course.discount / 100)).toFixed(2)}</span>
                <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">{course.discount}% off</span>
              </>
            )}
          </div>

          <div className="flex items-center mt-3 text-sm text-gray-600 space-x-4">
            <div className="flex items-center text-yellow-400">
              {getStars(averageRating).map((type, i) => (
                <span key={i} className="text-xs">
                  {type === "full" && <FaStar />}
                  {type === "half" && <FaStarHalfAlt />}
                  {type === "empty" && <FaRegStar />}
                </span>
              ))}
              <span className="ml-1 text-gray-500">{averageRating}</span>
            </div>
            <span>{formatMinutes(totalMinutes)}</span>
            <span>{totalLectures} lectures</span>
          </div>

          <button 
            onClick={handleEnroll}
            disabled={isEnrolled}
            className={`w-full py-3 rounded-lg mt-4 transition-colors font-medium ${
              isEnrolled 
                ? 'bg-green-600 text-white cursor-default' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
            }`}
          >
            {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
          </button>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">What's in the course?</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Lifetime access with free updates.</li>
              <li>• Step-by-step, hands-on project guidance.</li>
              <li>• Downloadable resources and source code.</li>
              <li>• Quizzes to test your knowledge.</li>
              <li>• Certificate of completion.</li>
            </ul>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="text-sm text-gray-600 mb-6">
            <a href="/" className="text-indigo-600 font-semibold">Home</a> /{" "}
            <a href="/courseList" className="text-indigo-600 font-semibold">Course List</a> /{" "}
            <span className="font-semibold">{course.courseTitle}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">{course.courseTitle}</h1>
          <p className="text-gray-600 mt-2">
            {course.courseDescription
              ? course.courseDescription.split(" ").slice(0, 8).join(" ") + "..."
              : ""}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Course by{" "}
            <span className="text-indigo-600">
              {typeof course.educator === "object"
                ? course.educator.name
                : course.educator || "Educator"}
            </span>
          </p>

          <div className="flex items-center space-x-1 mt-3 text-yellow-400 text-sm">
            {getStars(averageRating).map((type, i) => (
              <span key={i}>
                {type === "full" && <FaStar />}
                {type === "half" && <FaStarHalfAlt />}
                {type === "empty" && <FaRegStar />}
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              {averageRating} ({ratingsArr.length} ratings)
            </span>
          </div>

          {/* Course Structure */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-1">Course Structure</h2>
            <p className="text-sm text-gray-500 mb-4">
              {sections.length} sections • {totalLectures} lectures • {formatMinutes(totalMinutes)} total duration
            </p>

            <div className="border rounded-lg overflow-hidden">
              {sections.map((section, idx) => {
                const totalSectionMinutes = (section.chapterContent || []).reduce(
                  (acc, lec) => acc + parseDuration(lec.lectureDuration),
                  0
                );
                const isOpen = openSections.includes(idx);
                return (
                  <div key={idx} className={idx < sections.length - 1 ? "border-b" : ""}>
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 font-medium cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      {/* LEFT SIDE → Icon + Title */}
                      <div className="flex items-center space-x-2">
                        <FaChevronDown
                          className={`transition-transform duration-300 text-gray-600 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                        <span>{section.chapterTitle}</span>
                      </div>

                      {/* RIGHT SIDE → Lectures + Time */}
                      <span className="text-sm text-gray-500">
                        {(section.chapterContent || []).length} lectures • {formatMinutes(totalSectionMinutes)}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="bg-white">
                        {(section.chapterContent || []).map((lec, lecIdx) => (
                          <div
                            key={lecIdx}
                            className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <FaPlay className="text-gray-600 text-xs ml-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-800 text-sm">{lec.lectureTitle}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lec.isPreviewFree && lec.lectureUrl && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(lec.lectureUrl);
                                  }}
                                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                                >
                                  <FaEye className="text-xs" />
                                  <span>Preview</span>
                                </button>
                              )}
                              <span className="text-sm text-gray-500">
                                {typeof lec.lectureDuration === "number"
                                  ? formatMinutes(lec.lectureDuration)
                                  : lec.lectureDuration}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Description */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Description</h2>
            <div className="text-gray-700 leading-relaxed">
              <p className="mb-3">{course.courseDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}