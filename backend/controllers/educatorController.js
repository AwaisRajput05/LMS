import{clerkClient} from"@clerk/express"
import Course from "../models/course.js";
import{v2 as cloudinary}from"cloudinary"


//update role to educator
export const updateRoleToEducator = async (req, res) => {
    try{
        const userId = req.auth.userId;

        await clerkClient.users.updateUserMetadata(userId,{
            publicMetadata: {
                role: "educator",
            }
        })

        res.json({success: true,message: "you can published a course now"})
    }
    
    catch(error){
        console.error("Error updating user role:", error);
        res.json({success: false, message: error.message});
    }
}

//add course
export const addCourse = async (req,res) => {
    try{
        const {courseData}= req.body
        const imageFile = req.file
        const educatorId = req.auth.userId

        if(!imageFile){
            return res.json({success: false, message: "Image file is required"})
        }

        const parsedCourseData = await JSON.parse(courseData)
        parsedCourseData.educator = educatorId
        const newCourse = await Course.create(parsedCourseData)
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        newCourse.courseThumbnail = imageUpload.secure_url
        await newCourse.save()

        res.json({success: true, message: "Course added successfully"})

    }catch (error){
        res.json({success: false, message: error.message})
    }
}

//get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const educatorId = req.auth.userId;
        const courses = await Course.find({ educator: educatorId});
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// get educator dashboard data ( total earning, enrolled students, no of courses)
export const getEducatorDashboardData = async (req, res) => {
    try {
        const educator= req.auth.userId;
        const courses = await Course.find({ educator });
        const totalcourses = courses.length;

        const courseIds = courses.map(course => course._id);

        //calculate total earning from purchases
        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' });

        const totalEarnings = await purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        //collect unique enrolled student ids with their course titles
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

        const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        const enrolledStudentsData = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));
        
        res.json({ success: true, enrolledStudentsData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    } 
        
}