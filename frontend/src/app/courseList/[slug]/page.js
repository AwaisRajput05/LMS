// app/courseList/[slug]/page.js
"use client";
import { courses, getStars } from "@/lib/coursesData";
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
import { useState, use } from "react";

function slugify(text) {
  return text.toLowerCase().trim().replace(/\s+/g, "-");
}

function parseDuration(duration) {
  if (!duration) return 0;
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

export default function CourseDetailPage(props) {
  const { slug } = use(props.params); // 👈 params ko unwrap karo

  const course = courses.find((c) => slugify(c.title) === slug);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Course not found
      </div>
    );
  }

  const sections = [
    {
      title: "Project Introduction",
      lectures: [
        ["App Overview - Build Text-to-Image SaaS", "10 mins", true], // true = has preview
        ["Tech Stack - React.js, MongoDB, Node.js", "15 mins", false],
        ["Core Features - Authentication, payment, deployment", "25 mins", false],
      ],
    },
    {
      title: "Project Setup and Configuration",
      lectures: [
        ["Environment Setup - Install Node.js, VS Code", "10 mins", true],
        ["Repository Setup - Setup github repository", "10 mins", false],
        ["Install Dependencies - Set up npm packages", "10 mins", false],
        ["Initial Configuration - Set up basic files and folders", "15 mins", false],
      ],
    },
  ];

  const [openSections, setOpenSections] = useState([0]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState("");
  
  // Check if user is already enrolled (you can get this from your auth context or API)
  const [isEnrolled, setIsEnrolled] = useState(false); // This should come from your user data

  const toggleSection = (idx) => {
    if (openSections.includes(idx)) {
      setOpenSections(openSections.filter((i) => i !== idx));
    } else {
      setOpenSections([...openSections, idx]);
    }
  };

  const handlePreview = (lectureTitle) => {
    // Different preview videos based on lecture content
    let videoUrl = "";
    
    if (lectureTitle.includes("App Overview") || lectureTitle.includes("Text-to-Image")) {
      videoUrl = "https://www.youtube.com/embed/VoKFyB1q4fc"; // Text to Image SaaS
    } else if (lectureTitle.includes("Environment Setup") || lectureTitle.includes("Node.js")) {
      videoUrl = "https://www.youtube.com/embed/fBNz5xF-Kx4"; // Node.js Setup
    } else if (lectureTitle.includes("React") || lectureTitle.includes("Frontend")) {
      videoUrl = "https://www.youtube.com/embed/bMknfKXIFA8"; // React Tutorial
    } else if (lectureTitle.includes("MongoDB") || lectureTitle.includes("Database")) {
      videoUrl = "https://www.youtube.com/embed/-56x56UppqQ"; // MongoDB Tutorial
    } else if (lectureTitle.includes("Authentication") || lectureTitle.includes("Login")) {
      videoUrl = "https://www.youtube.com/embed/rltfdjcXjmk"; // Authentication Tutorial
    } else if (lectureTitle.includes("Payment") || lectureTitle.includes("Stripe")) {
      videoUrl = "https://www.youtube.com/embed/1r-F3FIONl8"; // Stripe Payment
    } else if (lectureTitle.includes("Deployment") || lectureTitle.includes("Deploy")) {
      videoUrl = "https://www.youtube.com/embed/l134cBAJCuc"; // Deployment Tutorial
    } else {
      // Default fallback video
      videoUrl = "https://www.youtube.com/embed/VoKFyB1q4fc";
    }
    
    setPreviewVideo(videoUrl);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewVideo("");
  };

  const handleEnroll = () => {
    if (!isEnrolled) {
      // Handle enrollment logic here
      setIsEnrolled(true);
      alert("Successfully enrolled!");
    }
  };

  return (
    <section className="bg-[linear-gradient(to_bottom,_#e0f2fe_0%,_#f0f9ff_35%,_white_100%)] min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* RIGHT SIDEBAR */}
        <div className="order-1 lg:order-2">
          {/* Video Preview or Course Image */}
          {showPreview ? (
            <div className="relative w-full h-56 rounded-lg overflow-hidden bg-black">
              <iframe
                src={previewVideo}
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
              <Image src={course.image} alt={course.title} fill className="object-cover" />
            </div>
          )}

          <p className="text-sm text-red-500 mt-4">5 days left at this price!</p>

          <div className="mt-1 flex items-center space-x-3">
            <span className="text-2xl font-bold text-indigo-600">${course.price}</span>
            <span className="line-through text-gray-400">$19.99</span>
            <span className="text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">50% off</span>
          </div>

          <div className="flex items-center mt-3 text-sm text-gray-600 space-x-4">
            <div className="flex items-center text-yellow-400">
              {getStars(course.rating).map((type, i) => (
                <span key={i} className="text-xs">
                  {type === "full" && <FaStar />}
                  {type === "half" && <FaStarHalfAlt />}
                  {type === "empty" && <FaRegStar />}
                </span>
              ))}
              <span className="ml-1 text-gray-500">{course.rating}</span>
            </div>
            <span>{course.totalDuration || "7h 25m"}</span>
            <span>{course.totalLectures || "54 lectures"}</span>
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
            <span className="font-semibold">{course.title}</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-800">{course.title}</h1>
          <p className="text-gray-600 mt-2">{course.subtitle}</p>
          <p className="text-sm text-gray-500 mt-1">
            Course by <span className="text-indigo-600">{course.instructor}</span>
          </p>

          <div className="flex items-center space-x-1 mt-3 text-yellow-400 text-sm">
            {getStars(course.rating).map((type, i) => (
              <span key={i}>
                {type === "full" && <FaStar />}
                {type === "half" && <FaStarHalfAlt />}
                {type === "empty" && <FaRegStar />}
              </span>
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({course.reviews} ratings) 21 students
            </span>
          </div>

          {/* Course Structure */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-1">Course Structure</h2>
            <p className="text-sm text-gray-500 mb-4">
              {sections.length} sections •{" "}
              {sections.reduce((acc, sec) => acc + sec.lectures.length, 0)} lectures •{" "}
              {formatMinutes(
                sections.reduce(
                  (acc, sec) =>
                    acc +
                    sec.lectures.reduce((lecAcc, lec) => lecAcc + parseDuration(lec[1]), 0),
                  0
                )
              )} total duration
            </p>

            <div className="border rounded-lg overflow-hidden">
              {sections.map((section, idx) => {
                const totalSectionMinutes = section.lectures.reduce(
                  (acc, lec) => acc + parseDuration(lec[1]),
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
                        <span>{section.title}</span>
                      </div>

                      {/* RIGHT SIDE → Lectures + Time */}
                      <span className="text-sm text-gray-500">
                        {section.lectures.length} lectures • {formatMinutes(totalSectionMinutes)}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="bg-white">
                        {section.lectures.map(([title, time, hasPreview], lecIdx) => (
                          <div
                            key={lecIdx}
                            className="flex items-center px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                              <FaPlay className="text-gray-600 text-xs ml-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-gray-800 text-sm">{title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {hasPreview && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePreview(title);
                                  }}
                                  className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
                                >
                                  <FaEye className="text-xs" />
                                  <span>Preview</span>
                                </button>
                              )}
                              <span className="text-sm text-gray-500">{time}</span>
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
              <p className="mb-3">
                {course.description || 
                "Master the MERN Stack by building a complete AI-powered Text to Image SaaS application. This comprehensive course covers React.js, Node.js, MongoDB, Express.js, and integrates cutting-edge AI technology for image generation."}
              </p>
              <p className="mb-3">
                {"Learn to implement user authentication, payment processing with Stripe, and deploy your application to production. Perfect for developers who want to build modern SaaS applications with AI integration."}
              </p>
              <p>
                {"By the end of this course, you'll have a fully functional SaaS platform that you can use as a portfolio project or launch as your own business."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}