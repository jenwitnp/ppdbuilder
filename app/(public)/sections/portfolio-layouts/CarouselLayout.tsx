"use client";

import { useState } from "react";
import { Album } from "@/types/album";
import SmartImage from "@/app/(public)/components/SmartImage";

export default function CarouselLayout({ albums }: { albums: Album[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % albums.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + albums.length) % albums.length);
  };

  const currentAlbum = albums[activeIndex];

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Side */}
        <div className="relative h-96 md:h-auto md:min-h-[500px] overflow-hidden">
          <SmartImage
            src={currentAlbum.cover_image_url || "/placeholder.jpg"}
            alt={currentAlbum.title}
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30"></div>
        </div>

        {/* Content Side */}
        <div className="flex flex-col justify-center p-8 md:p-12">
          <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2">
            Project {activeIndex + 1} of {albums.length}
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {currentAlbum.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {currentAlbum.description || "ไม่มีคำอธิบาย"}
          </p>
          <button className="w-fit px-6 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
            View Details
          </button>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-sky-600 dark:hover:bg-sky-600 hover:text-white transition"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div className="flex-1 flex gap-2">
              {albums.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-sky-600 w-8"
                      : "bg-gray-300 dark:bg-gray-600 w-2"
                  }`}
                ></button>
              ))}
            </div>
            <button
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-sky-600 dark:hover:bg-sky-600 hover:text-white transition"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
