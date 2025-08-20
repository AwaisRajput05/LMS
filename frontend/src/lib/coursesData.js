// src/lib/coursesData.js
export const courses = [
  {
    title: "Javascript Course",
    slug: "javascript-course", // ✅ Unique slug
    subtitle: "Build Full-Stack SaaS App",
    instructor: "Richard James",
    rating: 5,
    reviews: 12,
    price: 10.99,
    image: "/images/course_1.png",
    description:
      "Learn JavaScript from scratch and build real-world full-stack SaaS applications."
  },
  {
    title: "Database Course",
    slug: "database-course",
    subtitle: "Build AI BG Removal SaaS",
    instructor: "Richard James",
    rating: 3.4,
    reviews: 22,
    price: 13.45,
    image: "/images/course_2.png",
    description:
      "Master database design, SQL, and NoSQL concepts to power your backend systems."
  },
  {
    title: "React Router",
    slug: "react-router",
    subtitle: "Build Full-Stack E-Commerce",
    instructor: "Richard James",
    rating: 3.9,
    reviews: 14,
    price: 14.19,
    image: "/images/course_3.png",
    description:
      "Learn advanced routing techniques in React for building dynamic web applications."
  },
  {
    title: "MERN Stack",
    slug: "mern-stack",
    subtitle: "App in React JS in One Video",
    instructor: "Richard James",
    rating: 4.8,
    reviews: 19,
    price: 18.99,
    image: "/images/course_4.png",
    description:
      "Build complete full-stack applications using MongoDB, Express, React, and Node.js."
  },
  {
    title: "WordPress Course",
    slug: "wordpress-course",
    subtitle: "Build Full-Stack SaaS App",
    instructor: "Richard James",
    rating: 4.5,
    reviews: 21,
    price: 16.39,
    image: "/images/course_5.jpg",
    description:
      "Learn to create, customize, and manage websites using WordPress like a pro."
  },
  {
    title: "Mobile App Development",
    slug: "mobile-app-development",
    subtitle: "Build AI BG Removal SaaS",
    instructor: "Richard James",
    rating: 3.5,
    reviews: 122,
    price: 11.99,
    image: "/images/course_6.jpg",
    description:
      "Develop mobile applications for Android and iOS using modern frameworks."
  },
  {
    title: "Artificial Intelligence",
    slug: "artificial-intelligence",
    subtitle: "Build Full-Stack E-Commerce",
    instructor: "Richard James",
    rating: 4.5,
    reviews: 122,
    price: 17.99,
    image: "/images/course_7.jpg",
    description:
      "Understand AI fundamentals and build intelligent applications with hands-on projects."
  }
];

// ⭐ Rating stars helper
export function getStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push("full");
    } else if (i === fullStars && hasHalfStar) {
      stars.push("half");
    } else {
      stars.push("empty");
    }
  }

  return stars;
}

