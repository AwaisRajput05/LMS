"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const testimonials = [
  {
    name: "Saud Ijaz",
    role: "SWE1 @ Amazon",
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    avatar: "/images/profile_img_1.png",
    rating: 4,               // ← from array
  },
  {
    name: "Moeez Ali",
    role: "SWE2 @ Samsung",
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    avatar: "/images/profile_img_2.png",
    rating: 3,
  },
  {
    name: "James Washington",
    role: "SWE2 @ Google",
    text: "I've been using imagify for nearly two years, primarily for Instagram, and it has been incredibly user-friendly, making my work much easier.",
    avatar: "/images/profile_img_3.png",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
          Testimonials
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-gray-600">
          Hear from our learners as they share their journeys of transformation,
          success, and how our platform has made a difference in their lives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              {/* Avatar + Info */}
              <div className="flex items-center p-4">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={48}
                  height={48}
                  className="rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{t.name}</h3>
                  <p className="text-xs text-gray-600">{t.role}</p>
                </div>
              </div>

              {/* Rating (from array) */}
              <div className="px-4 pb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= t.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quote & CTA */}
              <div className="px-4 pb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{t.text}</p>
                <Link href="#" className="inline-block mt-4 text-sm text-indigo-600 font-semibold hover:underline">
                  Read more
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}