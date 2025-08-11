"use client";
import Image from "next/image";

const logos = [
  { src: "/images/microsoft_logo.svg", alt: "Microsoft" },
   { src: "/images/walmart_logo.svg", alt: "Walmart" },
    { src: "/images/accenture_logo.svg", alt: "Accenture" },
  { src: "/images/adobe_logo.svg",  alt: "Adobe"   },
 
 
  { src: "/images/paypal_logo.svg", alt: "PayPal" },
 
];

export default function TrustedBy() {
  return (
    <section className="bg-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500">
          Trusted by learners from
        </h2>

        {/* Logo strip */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-x-10 gap-y-6 sm:gap-x-16">
          {logos.map((logo) => (
           <Image
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            width={120}
            height={40}
            className="h-8 w-auto object-contain opacity-80" // ⬅ removed grayscale
/>

          ))}
        </div>
      </div>
    </section>
  );
}