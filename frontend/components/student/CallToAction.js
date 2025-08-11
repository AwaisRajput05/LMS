// components/LearnAnywhere.jsx
"use client";
import Link from "next/link";

export default function LearnAnywhere() {
  return (
    <section className="bg-white py-20 px-6">

      <div className="max-w-3xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
          Learn anything, <span className="text-indigo-600">anytime, anywhere</span>
        </h2>

        {/* Sub-copy */}
        <p className="mt-6 text-lg text-gray-600 max-w-xl mx-auto">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam
          aliqua proident excepteur commodo do ea.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/signup"
            className="bg-indigo-600 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Get started
          </Link>

          <Link
            href="/about"
            className="flex items-center text-indigo-600 font-semibold text-lg hover:underline"
          >
            Learn more <span className="ml-1">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}