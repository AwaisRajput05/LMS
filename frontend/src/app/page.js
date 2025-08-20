"use client"
import React, { useEffect } from 'react'
import Navbar from '../../components/student/nav'
import Hero from '../../components/student/hero'
import TrustedBy from '../../components/student/companies'
import TopCourses from '../../components/student/couses'
import Testimonials from '../../components/student/testimonial'
import LearnAnywhere from '../../components/student/CallToAction'
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles
import Footer from '../../components/student/footer'
import { useAuth, useUser } from "@clerk/nextjs";

function page() {
  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const logToken = async () => {
      console.log(await getToken());
    };
    if (user) {
      logToken();
    }
  }, [user, getToken]);

  //
    useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once
      anchorPlacement: 'top-bottom', // Defines which position of the element should be animated
    });
  }, []);


  return (
    <div>
      <hr />
      <Hero />
      <TrustedBy />
      <TopCourses />
      <Testimonials />
      <LearnAnywhere />
    </div>
  )
}

export default page