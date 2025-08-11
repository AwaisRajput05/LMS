"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FaPlay, FaCheckCircle, FaChevronDown, FaTimes } from "react-icons/fa";

// Multiple courses data
const courses = {
  1: {
    title: "Getting Started with JavaScript",
    image: "/images/course_1.png",
    sections: [
      {
        title: "Getting Started with JavaScript",
        lectures: [
          { id: 1, title: "What is JavaScript?", duration: "20 minutes", video: "https://www.youtube.com/embed/W6NZfCO5SIk" },
          { id: 2, title: "Setting Up Your Environment", duration: "19 minutes", video: "https://www.youtube.com/embed/fBNz5xF-Kx4" },
        ],
      },
      {
        title: "Variables and Data Types",
        lectures: [
          { id: 3, title: "Understanding Variables", duration: "35 minutes", video: "https://www.youtube.com/embed/Bv_5Zv5c-Ts" },
          { id: 4, title: "Data Types in JavaScript", duration: "10 minutes", video: "https://www.youtube.com/embed/1i04A4k_8lE" },
        ],
      },
    ],
  },
  2: {
    title: "Advanced Python Programming",
    image: "/images/course_2.png",
    sections: [
      {
        title: "Introduction to Python",
        lectures: [
          { id: 5, title: "Python Basics", duration: "25 minutes", video: "https://www.youtube.com/embed/_uQrJ0TkZlc" },
          { id: 6, title: "Python Data Types", duration: "30 minutes", video: "https://www.youtube.com/embed/kqtD5dpn9C8" },
        ],
      },
      {
        title: "Object-Oriented Python",
        lectures: [
          { id: 7, title: "Classes and Objects", duration: "20 minutes", video: "https://www.youtube.com/embed/ZDa-Z5JzLYM" },
          { id: 8, title: "Inheritance", duration: "15 minutes", video: "https://www.youtube.com/embed/RSl87lqOXDE" },
        ],
      },
    ],
  },
  3: {
    title: "Cybersecurity Basics",
    image: "/images/course_3.png",
    sections: [
      {
        title: "Understanding Cybersecurity",
        lectures: [
          { id: 9, title: "What is Cybersecurity?", duration: "18 minutes", video: "https://www.youtube.com/embed/inWWhr5tnEA" },
          { id: 10, title: "Common Threats", duration: "22 minutes", video: "https://www.youtube.com/embed/uvj1l4vD5fI" },
        ],
      },
      {
        title: "Protecting Yourself Online",
        lectures: [
          { id: 11, title: "Password Security", duration: "12 minutes", video: "https://www.youtube.com/embed/a7pZBq2LmT4" },
          { id: 12, title: "Two-Factor Authentication", duration: "8 minutes", video: "https://www.youtube.com/embed/6GbbZbJvQHE" },
        ],
      },
    ],
  },
  4: {
    title: "Web Development Bootcamp",
    image: "/images/course_4.png",
    sections: [
      {
        title: "Introduction to web development",
        lectures: [
          { id: 13, title: "HTML Basics", duration: "25 minutes", video: "https://www.youtube.com/embed/_uQrJ0TkZlc" },
          { id: 14, title: "CSS Advance", duration: "30 minutes", video: "https://www.youtube.com/embed/kqtD5dpn9C8" },
        ],
      },
      {
        title: "Backend Development with Node.js",
        lectures: [
          { id: 15, title: "Node.js Basics", duration: "40 minutes", video: "https://www.youtube.com/embed/ZDa-Z5JzLYM" },
          { id: 16, title: "Database", duration: "15 minutes", video: "https://www.youtube.com/embed/RSl87lqOXDE" },
        ],
      },
    ],
  },
};

// Helper: Convert "X hours, Y minutes" → minutes
const parseDuration = (str) => {
  let total = 0;
  const hourMatch = str.match(/(\d+)\s*hour/);
  const minuteMatch = str.match(/(\d+)\s*minute/);
  if (hourMatch) total += parseInt(hourMatch[1]) * 60;
  if (minuteMatch) total += parseInt(minuteMatch[1]);
  return total;
};

// Format minutes back into "X hours Y minutes"
const formatDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hour${h > 1 ? "s" : ""}, ${m} minutes`;
  if (h) return `${h} hour${h > 1 ? "s" : ""}`;
  return `${m} minutes`;
};

export default function CourseStructure() {
  const { id } = useParams();
  const courseId = Number(id);

  const courseData = courses[courseId] || courses[1]; // fallback

  const [openSections, setOpenSections] = useState([0]);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState("");
  const [completedLectures, setCompletedLectures] = useState(new Set());

  // Calculate totals
  const totalMinutes = courseData.sections
    .flatMap((sec) => sec.lectures)
    .reduce((sum, lec) => sum + parseDuration(lec.duration), 0);

  const totalLectures = courseData.sections.reduce((sum, sec) => sum + sec.lectures.length, 0);

  // Load progress
  useEffect(() => {
    const savedProgress = JSON.parse(localStorage.getItem("courseProgress") || "{}");
    if (savedProgress[courseId] && Array.isArray(savedProgress[courseId].completed)) {
      setCompletedLectures(new Set(savedProgress[courseId].completed));
    } else {
      setCompletedLectures(new Set());
    }
  }, [courseId]);

  // Save progress
  const saveProgress = (updatedSet) => {
    const progressData = JSON.parse(localStorage.getItem("courseProgress") || "{}");
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
    }
    setCompletedLectures(updated);
    saveProgress(updated);
  };

  const toggleAllComplete = () => {
    const allLectureIds = courseData.sections.flatMap((sec) => sec.lectures.map((lec) => lec.id));
    const allCompleted = allLectureIds.every((id) => completedLectures.has(id));

    const updated = allCompleted ? new Set() : new Set(allLectureIds);
    setCompletedLectures(updated);
    saveProgress(updated);
  };

  const isAllCompleted = totalLectures > 0 && completedLectures.size === totalLectures;

  return (
    <main className="bg-white min-h-screen px-6 py-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RIGHT SIDEBAR */}
        <div className="order-1 lg:order-2 mt-[3.2rem] lg:col-span-1 w-full">
          {showVideo ? (
            <div className="relative w-full h-80 rounded-lg overflow-hidden bg-black">
              <iframe
                src={selectedVideo}
                title="Lecture Video"
                frameBorder="0"
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
              <Image src={courseData.image} alt={courseData.title} fill className="object-cover" />
            </div>
          )}
        </div>

        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{courseData.title}</h1>

          {/* Sections */}
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {courseData.sections.map((section, idx) => {
              const isOpen = openSections.includes(idx);
              return (
                <div key={idx} className={idx < courseData.sections.length - 1 ? "border-b border-gray-100" : ""}>
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex justify-between items-center bg-gray-100 px-4 py-3 font-medium"
                  >
                    <div className="flex items-center space-x-2">
                      <FaChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      <span>{section.title}</span>
                    </div>
                    <span className="text-sm text-gray-500">{section.lectures.length} lectures</span>
                  </button>

                  {isOpen && (
                    <div className="bg-white">
                      {section.lectures.map((lec) => (
                        <div
                          key={lec.id}
                          className="flex items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {completedLectures.has(lec.id) ? (
                              <FaCheckCircle className="text-green-600" />
                            ) : (
                              <FaPlay className="text-gray-600 text-xs" />
                            )}
                          </div>

                          <div className="flex-1">
                            <span className="text-gray-800 text-sm">{lec.title}</span>
                            <p className="text-xs text-gray-500">{lec.duration}</p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleWatch(lec.video)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              Watch
                            </button>
                            <button
                              onClick={() => toggleComplete(lec.id)}
                              className={`text-xs font-semibold px-3 py-1 rounded ${
                                completedLectures.has(lec.id)
                                  ? "bg-green-100 text-green-700"
                                  : "bg-indigo-100 text-indigo-700"
                              }`}
                            >
                              {completedLectures.has(lec.id) ? "Completed" : "Mark Complete"}
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
                isAllCompleted ? "bg-green-600 text-white" : "bg-indigo-600 text-white"
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
