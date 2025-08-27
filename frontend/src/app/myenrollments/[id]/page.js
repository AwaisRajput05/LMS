"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaPlay, FaCheckCircle, FaChevronDown, FaTimes, FaStar } from "react-icons/fa";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-toastify";

export default function CourseStructure() {
  const { id } = useParams();
  const courseId = id;

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState([0]);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();

  // Fetch enrolled courses from API and find by id
  useEffect(() => {
    const fetchCourses = async () => {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/enrolled-courses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      const data = await res.json();
      const found = (data.enrolledCourses || []).find((c) => c._id === courseId);
      setCourseData(found || null);

      // Set user's existing rating if available
      if (
        found &&
        found.courseRatings &&
        found.courseRatings.length > 0 &&
        user?.id
      ) {
        const myRatingObj = found.courseRatings.find(
          (r) => r.userId === user.id
        );
        if (myRatingObj) {
          setRating(myRatingObj.rating);
        }
      }
    };
    fetchCourses();
  }, [courseId, getToken, user?.id]);

  // Helper functions for duration
  const parseDuration = (num) => (typeof num === "number" ? num : 0);
  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h && m) return `${h} hour${h > 1 ? "s" : ""}, ${m} minutes`;
    if (h) return `${h} hour${h > 1 ? "s" : ""}`;
    return `${m} minutes`;
  };

  // Calculate totals
  const totalMinutes = courseData
    ? (courseData.courseContent || [])
        .flatMap((sec) => sec.chapterContent || [])
        .reduce((sum, lec) => sum + parseDuration(lec.lectureDuration), 0)
    : 0;

  const totalLectures = courseData
    ? (courseData.courseContent || []).reduce(
        (sum, sec) => sum + (sec.chapterContent?.length || 0),
        0
      )
    : 0;

  // Load progress
  useEffect(() => {
    if (!courseId) return;
    const savedProgress = JSON.parse(
      localStorage.getItem("courseProgress") || "{}"
    );
    if (
      savedProgress[courseId] &&
      Array.isArray(savedProgress[courseId].completed)
    ) {
      setCompletedLectures(new Set(savedProgress[courseId].completed));
    } else {
      setCompletedLectures(new Set());
    }
  }, [courseId, courseData]);

  // Save progress
  const saveProgress = (updatedSet) => {
    const progressData = JSON.parse(
      localStorage.getItem("courseProgress") || "{}"
    );
    progressData[courseId] = {
      completed: Array.from(updatedSet),
      total: totalLectures,
      duration: formatDuration(totalMinutes),
    };
    localStorage.setItem("courseProgress", JSON.stringify(progressData));
  };

  const toggleSection = (idx) => {
    setOpenSections((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleWatch = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowVideo(true);
  };

  const closeVideo = () => {
    setShowVideo(false);
    setSelectedVideo("");
  };

  const toggleComplete = (lectureId) => {
    const updated = new Set(completedLectures);
    if (updated.has(lectureId)) {
      updated.delete(lectureId);
    } else {
      updated.add(lectureId);
      toast.success("You successfully complete this lecture");
    }
    setCompletedLectures(updated);
    saveProgress(updated);
  };

  const toggleAllComplete = () => {
    const allLectureIds = courseData
      ? (courseData.courseContent || []).flatMap((sec) =>
          (sec.chapterContent || []).map((lec) => lec.lectureId)
        )
      : [];
    const allCompleted = allLectureIds.every((id) => completedLectures.has(id));
    const updated = allCompleted ? new Set() : new Set(allLectureIds);
    setCompletedLectures(updated);
    saveProgress(updated);
  };

  const isAllCompleted =
    totalLectures > 0 && completedLectures.size === totalLectures;

  // Rating submit function (auto submit on star click)
  const handleStarClick = async (star) => {
    setRating(star);
    setSubmitting(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/add-rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({ courseId: courseId, rating: star }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Your rating added successfully!");
      } else {
        toast.error(data.message || "Failed to submit rating");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    }
    setSubmitting(false);
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

  if (!courseData) {
    return (
      <main className="bg-white min-h-screen px-6 py-12 flex items-center justify-center">
        <div className="text-lg text-gray-500">Course not found or not enrolled.</div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RIGHT SIDEBAR */}
        <div className="order-1 lg:order-2 mt-[3.2rem] lg:col-span-1 w-full">
          {showVideo ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden bg-black">
              <iframe
                src={getEmbedUrl(selectedVideo)}
                title="Lecture Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
              <button
                onClick={closeVideo}
                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                <FaTimes size={14} />
              </button>
            </div>
          ) : (
            <div className="relative w-full h-80 rounded-lg overflow-hidden">
              <Image
                src={courseData.courseThumbnail}
                alt={courseData.courseTitle}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Rating Section: Just below video */}
          <div className="mt-6 flex flex-col items-center">
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className="focus:outline-none"
                  disabled={submitting}
                >
                  <FaStar
                    size={32}
                    className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-700 text-base font-medium">
                {rating ? `${rating} Star${rating > 1 ? "s" : ""}` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {courseData.courseTitle}
          </h1>

          {/* Sections */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {(courseData.courseContent || []).map((section, idx) => {
              const isOpen = openSections.includes(idx);
              return (
                <div
                  key={idx}
                  className={
                    idx < (courseData.courseContent || []).length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }
                >
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <FaChevronDown
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                      <span>{section.chapterTitle}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {(section.chapterContent || []).length} lectures
                    </span>
                  </button>

                  {isOpen && (
                    <div className="bg-white">
                      {(section.chapterContent || []).map((lec) => (
                        <div
                          key={lec.lectureId}
                          className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {completedLectures.has(lec.lectureId) ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : (
                              <FaPlay className="text-gray-600 text-xs" />
                            )}
                          </div>

                          <div className="flex-1">
                            <span className="text-gray-800 text-sm">
                              {lec.lectureTitle}
                            </span>
                            <p className="text-xs text-gray-500">
                              {lec.lectureDuration} min
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            {lec.lectureUrl && (
                              <button
                                onClick={() => handleWatch(lec.lectureUrl)}
                                className="text-indigo-600 hover:text-indigo-800 text-sm"
                              >
                                Watch
                              </button>
                            )}
                            <button
                              onClick={() => toggleComplete(lec.lectureId)}
                              className={`text-xs font-semibold px-3 py-1 rounded ${
                                completedLectures.has(lec.lectureId)
                                  ? "bg-green-100 text-green-700"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {completedLectures.has(lec.lectureId)
                                ? "Completed"
                                : "Mark Complete"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Actions */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={toggleAllComplete}
              className={`px-4 py-2 rounded text-sm font-semibold ${
                isAllCompleted
                  ? "bg-green-600 text-white"
                  : "bg-indigo-600 text-white"
              }`}
            >
              {isAllCompleted ? "Completed" : "Mark Complete"}
            </button>
            <button
              onClick={() => {
                setCompletedLectures(new Set());
                saveProgress(new Set());
              }}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
