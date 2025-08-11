"use client"
import React from 'react'
import Navbar from '../../components/student/nav'
import Hero from '../../components/student/hero'
import TrustedBy from '../../components/student/companies'
import TopCourses from '../../components/student/couses'
import Testimonials from '../../components/student/testimonial'
import LearnAnywhere from '../../components/student/CallToAction'
import "quill/dist/quill.snow.css";
import Footer from '../../components/student/footer'

function page() {
  return (
    <div>
      
      <hr></hr>
      <Hero />
      <TrustedBy />
      <TopCourses />
      <Testimonials />
      <LearnAnywhere />
      
      
    </div>
  )
}

export default page