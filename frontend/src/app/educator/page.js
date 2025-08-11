"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Home, Plus, BookOpen, Users, User, BookOpenCheck, DollarSign, X, Play, Clock, Link, Eye, ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [showLectureDialog, setShowLectureDialog] = useState(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(null);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    price: '',
    discount: '',
    thumbnail: ''
  });
  const [newLecture, setNewLecture] = useState({
    title: '',
    duration: '',
    url: '',
    isFree: false
  });
  const [chapterVisibility, setChapterVisibility] = useState({}); // Add this state in Dashboard
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Mock courses data - later replace with API calls
  const myCourses = [
    {
      id: 1,
      title: 'Introduction to JavaScript',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=200&fit=crop',
      earnings: 119,
      students: 3,
      publishedDate: '12/17/2024'
    },
    {
      id: 2,
      title: 'Advanced Python Programming',
      thumbnail: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=300&h=200&fit=crop',
      earnings: 135,
      students: 2,
      publishedDate: '12/17/2024'
    },
    {
      id: 3,
      title: 'Cybersecurity Basics',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&h=200&fit=crop',
      earnings: 118,
      students: 2,
      publishedDate: '12/27/2024'
    },
    {
      id: 4,
      title: 'Web Development Bootcamp',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
      earnings: 149,
      students: 2,
      publishedDate: '12/17/2024'
    },
    {
      id: 5,
      title: 'Cloud Computing Essentials',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop',
      earnings: 55,
      students: 1,
      publishedDate: '12/17/2024'
    },
    {
      id: 6,
      title: 'Data Science with Python',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop',
      earnings: 215,
      students: 3,
      publishedDate: '12/27/2024'
    },
    {
      id: 7,
      title: 'Data Science and Machine Learning',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
      earnings: 62,
      students: 1,
      publishedDate: '12/17/2024'
    },
    {
      id: 8,
      title: 'Introduction to Cybersecurity',
      thumbnail: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=300&h=200&fit=crop',
      earnings: 50,
      students: 1,
      publishedDate: '12/17/2024'
    }
  ];

  // Initialize courses with mock data
  React.useEffect(() => {
    setCourses(myCourses);
  }, []);

  useEffect(() => {
    if(!quillRef.current && editorRef.current) {
      // Simple text editor simulation without Quill
      editorRef.current.innerHTML = '<div contentEditable="true" style="min-height: 120px; padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; outline: none;" placeholder="Write course description here..."></div>';
    }
  }, []);

  const handleAddChapter = () => {
    const chapterName = prompt('Enter chapter name:');
    if (chapterName && chapterName.trim()) {
      const newChapter = {
        id: Date.now(),
        name: chapterName.trim(),
        lectures: []
      };
      setChapters(prevChapters => [...prevChapters, newChapter]);
      setChapterVisibility(prev => ({ ...prev, [newChapter.id]: true })); // Show lectures by default
    }
  };

  const handleAddLecture = (chapterIndex) => {
    setCurrentChapterIndex(chapterIndex);
    setShowLectureDialog(true);
  };

  const handleSaveLecture = () => {
    if (!newLecture.title.trim()) {
      alert('Please enter lecture title');
      return;
    }

    const lecture = {
      id: Date.now(),
      title: newLecture.title,
      duration: newLecture.duration,
      url: newLecture.url,
      isFree: newLecture.isFree
    };

    setChapters(prevChapters => 
      prevChapters.map((chapter, index) => 
        index === currentChapterIndex 
          ? { ...chapter, lectures: [...chapter.lectures, lecture] }
          : chapter
      )
    );

    // Reset form and close dialog
    setNewLecture({
      title: '',
      duration: '',
      url: '',
      isFree: false
    });
    setShowLectureDialog(false);
    setCurrentChapterIndex(null);
  };

  const handleCloseLectureDialog = () => {
    setShowLectureDialog(false);
    setCurrentChapterIndex(null);
    setNewLecture({
      title: '',
      duration: '',
      url: '',
      isFree: false
    });
  };

  const handleAddCourse = () => {
    if (!newCourse.title.trim()) {
      alert('Please enter course title');
      return;
    }

    const course = {
      id: Date.now(),
      title: newCourse.title,
      thumbnail: newCourse.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=200&fit=crop',
      earnings: 0,
      students: 0,
      publishedDate: new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
      }),
      chapters: [...chapters]
    };
    
    setCourses(prevCourses => [...prevCourses, course]);
    
    // Reset form
    setNewCourse({
      title: '',
      description: '',
      price: '',
      discount: '',
      thumbnail: ''
    });
    setChapters([]);
    
    alert('Course added successfully!');
    setActiveTab('my-courses');
  };

  // Mock data - later replace with API calls
  const dashboardStats = [
    {
      id: 1,
      title: 'Total Enrollments',
      value: '14',
      icon: User,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200'
    },
    {
      id: 2,
      title: 'Total Courses',
      value: '8',
      icon: BookOpenCheck,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200'
    },
    {
      id: 3,
      title: 'Total Earnings',
      value: '$245',
      icon: DollarSign,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200'
    }
  ];

  // Mock enrollment data - later replace with API calls
  const latestEnrollments = [
    {
      id: 1,
      studentName: 'Richard Sanford',
      courseTitle: 'Build Text To Image SaaS App in React JS',
      date: '22 Aug, 2024',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      studentName: 'Enrique Murphy',
      courseTitle: 'Build AI BG Removal SaaS App in React JS',
      date: '22 Aug, 2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      studentName: 'Alison Powell',
      courseTitle: 'React Router Complete Course in One Video',
      date: '25 Sep, 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0ca?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 4,
      studentName: 'Richard Sanford',
      courseTitle: 'Build Full Stack E-Commerce App in React JS',
      date: '15 Oct, 2024',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 5,
      studentName: 'Enrique Murphy',
      courseTitle: 'Build AI BG Removal SaaS App in React JS',
      date: '22 Aug, 2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 6,
      studentName: 'Alison Powell',
      courseTitle: 'React Router Complete Course in One Video',
      date: '25 Sep, 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0ca?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 7,
      studentName: 'Richard Sanford',
      courseTitle: 'Build Full Stack E-Commerce App in React JS',
      date: '15 Oct, 2024',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 8,
      studentName: 'Sarah Johnson',
      courseTitle: 'Advanced JavaScript Concepts',
      date: '10 Nov, 2024',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 9,
      studentName: 'Michael Chen',
      courseTitle: 'Python for Data Science',
      date: '15 Nov, 2024',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 10,
      studentName: 'Emily Rodriguez',
      courseTitle: 'Web Design Fundamentals',
      date: '20 Nov, 2024',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0ca?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const handleToggleChapter = (chapterId) => {
    setChapterVisibility(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleRemoveChapter = (chapterId) => {
    setChapters(prev => prev.filter(ch => ch.id !== chapterId));
  };

  const handleRemoveLecture = (chapterId, lectureId) => {
    setChapters(prev =>
      prev.map(ch =>
        ch.id === chapterId
          ? { ...ch, lectures: ch.lectures.filter(l => l.id !== lectureId) }
          : ch
      )
    );
  };

  // Lecture Dialog Component
  const LectureDialog = () => {
    if (!showLectureDialog) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Add New Lecture</h3>
            <button
              onClick={handleCloseLectureDialog}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Lecture Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Play className="w-4 h-4 inline mr-1" />
                Lecture Title
              </label>
              <input
                type="text"
                value={newLecture.title}
                onChange={(e) => setNewLecture({...newLecture, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter lecture title"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newLecture.duration}
                onChange={(e) => setNewLecture({...newLecture, duration: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 15"
              />
            </div>

            {/* Lecture URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Link className="w-4 h-4 inline mr-1" />
                Lecture URL
              </label>
              <input
                type="url"
                value={newLecture.url}
                onChange={(e) => setNewLecture({...newLecture, url: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/video"
              />
            </div>

            {/* Preview Free Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="previewFree"
                checked={newLecture.isFree}
                onChange={(e) => setNewLecture({...newLecture, isFree: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="previewFree" className="ml-2 text-sm text-gray-700 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                Is Preview Free?
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={handleSaveLecture}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium"
            >
              Add Lecture
            </button>
            <button
              onClick={handleCloseLectureDialog}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard content component
  const DashboardContent = () => (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`${stat.bgColor} ${stat.borderColor} border rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.iconColor} p-2 md:p-3 rounded-full bg-white`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest Enrollments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Latest Enrollments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {latestEnrollments.map((enrollment, index) => (
                <tr key={enrollment.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-500">{index + 1}</td>
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                        src={enrollment.avatar}
                        alt={enrollment.studentName}
                      />
                      <span className="text-sm font-medium text-gray-800 truncate">{enrollment.studentName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">
                    <div className="max-w-xs truncate">{enrollment.courseTitle}</div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-500">{enrollment.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Add Course content component
  const AddCourseContent = () => (
    <div className="p-4 md:p-8 bg-gray-100 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          
          {/* Course Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
            <input 
              type="text" 
              value={newCourse.title}
              onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type here"
            />
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Description</label>
            <div ref={editorRef}></div>
          </div>

          {/* Price and Discount Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Course Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input 
                  type="number" 
                  value={newCourse.price}
                  onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={newCourse.discount || ''}
                  onChange={(e) => setNewCourse({...newCourse, discount: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
            <div className="flex items-center space-x-4">
              <input 
                type="url" 
                value={newCourse.thumbnail}
                onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter image URL"
              />
              <button className="bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition duration-200 flex items-center">
                📁
              </button>
            </div>
          </div>

          {/* Chapters Section */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">Course Chapters</label>
            {chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className="mb-6 bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  {/* Dropdown Icon (left) */}
                  <button
                    onClick={() => handleToggleChapter(chapter.id)}
                    className="text-gray-400 hover:text-blue-600 mr-2"
                    title={chapterVisibility[chapter.id] ? "Hide Lectures" : "Show Lectures"}
                  >
                    {chapterVisibility[chapter.id] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <h4 className="font-medium text-gray-800 flex items-center flex-1">
                    <BookOpen className="w-4 h-4 mr-2" />
                    {chapter.name}
                  </h4>
                  <span className="text-sm text-gray-500 mr-2">
                    {chapter.lectures.length} lecture{chapter.lectures.length !== 1 ? 's' : ''}
                  </span>
                  {/* Remove Chapter Icon (right) */}
                  <button
                    onClick={() => handleRemoveChapter(chapter.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Remove Chapter"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lectures List */}
                {chapterVisibility[chapter.id] && chapter.lectures.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {chapter.lectures.map((lecture, lectureIndex) => (
                      <div key={lecture.id} className="bg-white rounded p-3 flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <Play className="w-4 h-4 text-blue-600 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{lecture.title}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Clock className="w-3 h-3 mr-1" />
                              {lecture.duration} min
                              {lecture.isFree && (
                                <>
                                  <span className="mx-2">•</span>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Free Preview
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {/* Remove Lecture Icon (right) */}
                        <button
                          onClick={() => handleRemoveLecture(chapter.id, lecture.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                          title="Remove Lecture"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Lecture Button */}
                {chapterVisibility[chapter.id] && (
                  <button
                    onClick={() => handleAddLecture(chapterIndex)}
                    className="w-full bg-blue-50 text-blue-600 border border-blue-200 rounded-md py-2 hover:bg-blue-100 transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Lecture</span>
                  </button>
                )}
              </div>
            ))}

            {/* Add Chapter Button */}
            <button
              onClick={handleAddChapter}
              className="w-full bg-blue-100 text-blue-600 border-2 border-dashed border-blue-300 rounded-lg py-6 hover:bg-blue-200 hover:border-blue-400 transition duration-200 flex items-center justify-center space-x-2"
            >
              <span className="text-2xl">+</span>
              <span className="font-medium">Add Chapter</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button 
              onClick={handleAddCourse}
              className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition duration-200 font-medium"
            >
              ADD COURSE
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 transition duration-200 font-medium">
              Cancel
            </button>
          </div>

        </div>
      </div>

      {/* Lecture Dialog */}
      <LectureDialog />
    </div>
  );

  const MyCoursesContent = () => (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">My Courses</h1>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">All Courses</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">All Courses</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Published On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center">
                      <div className="w-12 h-10 md:w-16 md:h-12 rounded-lg overflow-hidden mr-3 md:mr-4 flex-shrink-0">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 leading-5 truncate">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">
                    ${course.earnings}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">
                    {course.students}
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-500">
                    {course.publishedDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const StudentsContent = () => (
    <div className="p-4 md:p-8 bg-gray-50 min-h-full">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Students Enrolled</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="text-left py-3 px-4 md:px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Enrollment Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.from({length: 15}, (_, i) => i + 1).map((student) => (
                <tr key={student} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-500">{student}</td>
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center">
                      <img
                        className="w-8 h-8 rounded-full object-cover mr-3 flex-shrink-0"
                        src={`https://images.unsplash.com/photo-150300321116${student}-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`}
                        alt={`Student ${student}`}
                      />
                      <span className="text-sm font-medium text-gray-800 truncate">Student {student}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">
                    <div className="truncate">student{student}@example.com</div>
                  </td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-600">React Course</td>
                  <td className="py-4 px-4 md:px-6 text-sm text-gray-500">
                    {new Date(2025, 0, student).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Main render function for content switching
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'add-course':
        return <AddCourseContent />;
      case 'my-courses':
        return <MyCoursesContent />;
      case 'students':
        return <StudentsContent />;
      default:
        return <DashboardContent />;
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-course', label: 'Add Course', icon: Plus },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'students', label: 'Student Enrolled', icon: Users }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4">
        <h2 className="text-lg font-bold text-gray-800">Learning Portal</h2>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-sm border-r border-gray-200 md:min-h-screen">
        <div className="hidden md:block p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Learning Portal</h2>
        </div>
        <nav className="mt-2 md:mt-6">
          <div className="flex md:block overflow-x-auto md:overflow-visible">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-shrink-0 md:w-full flex items-center px-4 md:px-6 py-3 text-left transition duration-200 whitespace-nowrap ${
                    activeTab === item.id
                      ? 'bg-blue-50 border-r-4 md:border-r-4 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                  <span className="text-sm md:text-base">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;