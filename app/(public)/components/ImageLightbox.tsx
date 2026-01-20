"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import SmartImage from "./SmartImage";
import type { AlbumImage } from "@/types/album-image";

interface ImageLightboxProps {
  images: AlbumImage[];
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Content */}
      <div
        className="relative flex h-full w-full items-center justify-center px-4 py-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-all hover:bg-white/20 sm:right-8 sm:top-8"
          aria-label="Close"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Main Image */}
        <div className="relative h-full w-full max-h-[85vh] max-w-4xl">
          <SmartImage
            src={currentImage.image_url}
            alt={currentImage.caption || "Album image"}
            width={1200}
            height={800}
            className="h-full w-full object-contain"
            priority
          />

          {/* Image Info */}
          {currentImage.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-4">
              <p className="text-sm text-white sm:text-base">
                {currentImage.caption}
              </p>
            </div>
          )}
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6 text-white sm:h-8 sm:w-8" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 transition-all hover:bg-white/20"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6 text-white sm:h-8 sm:w-8" />
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
