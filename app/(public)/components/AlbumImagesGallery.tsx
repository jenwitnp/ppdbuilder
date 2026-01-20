"use client";

import { useState } from "react";
import { useAlbumImages } from "@/hooks/useAlbumImages";
import SmartImage from "@/app/(public)/components/SmartImage";
import ImageLightbox from "@/app/(public)/components/ImageLightbox";

interface AlbumImagesGalleryProps {
  albumId: string;
  albumTitle: string;
}

export default function AlbumImagesGallery({
  albumId,
  albumTitle,
}: AlbumImagesGalleryProps) {
  const { data: images = [], isLoading, error } = useAlbumImages(albumId);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
          เกิดข้อผิดพลาด
        </h3>
        <p className="text-red-500 mt-2">
          {error instanceof Error ? error.message : "ไม่สามารถโหลดรูปภาพ"}
        </p>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">ไม่มีรูปภาพ</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {albumTitle}
      </h3>

      {/* Masonry Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gridAutoRows: "250px",
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{
              gridRowEnd: index % 5 === 0 ? "span 2" : "span 1",
            }}
            onClick={() => setLightboxIndex(index)}
          >
            <SmartImage
              src={image.image_url}
              alt={image.caption || "Album image"}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              {image.caption && (
                <p className="text-white text-sm font-semibold">
                  {image.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
