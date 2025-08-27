import { clerkClient } from "@clerk/express";
import Course from "../models/course.js";
import { Purchase }  from "../models/purchase.js";
import User from "../models/user.js"; // <-- Add this line

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    try {
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: "educator",
            }
        })

        res.json({ success: true, message: "you can published a course now" })
    }

    catch (error) {
        console.error("Error updating user role:", error);
        res.json({ success: false, message: error.message });
    }
}

// add course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" })
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({ success: true, message: "Course added successfully" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId });

        // For each course, calculate total earnings
        const coursesWithEarnings = await Promise.all(
            courses.map(async (course) => {
                // Find all completed purchases for this course
                const purchases = await Purchase.find({ courseId: course._id, status: 'completed' });
                const totalEarnings = purchases.reduce((sum, p) => sum + (p.amount || 0), 0);

                // Return course object with totalEarnings field
                return {
                    ...course.toObject(),
                    totalEarnings
                };
            })
        );

        res.json({ success: true, courses: coursesWithEarnings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get educator dashboard data ( total earning, enrolled students, no of courses)
export const getEducatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const totalcourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // calculate total earning from purchases
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' });

        const totalEarnings = await purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // collect unique enrolled student ids with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');
            students.forEach(student => {
                enrolledStudentsData.push({ courseTitle: course.courseTitle, student });
            });

        }
        res.json({ success: true, dashboardData: { totalcourses, totalEarnings, enrolledStudentsData } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get enrolled Students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;
        const courses = await Course.find({ educator });
        const courseIds = courses.map(course => course._id);

        // Populate courseId for courseTitle
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
            .populate('courseId', 'courseTitle');

        const enrolledStudentsData = [];
        for (const purchase of purchases) {
            let studentInfo = {
                name: "Unknown",
                imageUrl: "",
                _id: purchase.userId
            };
            try {
                const clerkUser = await clerkClient.users.getUser(purchase.userId);
                studentInfo.name = clerkUser.firstName + " " + (clerkUser.lastName || "");
                studentInfo.imageUrl = clerkUser.imageUrl || "";
            } catch (err) {
                // Clerk user not found, keep default
            }
            enrolledStudentsData.push({
                student: studentInfo,
                courseTitle: purchase.courseId ? purchase.courseId.courseTitle : "",
                purchaseDate: purchase.createdAt
            });
        }

        res.json({ success: true, enrolledStudentsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};