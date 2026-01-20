"use client";

import Link from "next/link";
import { Album } from "@/types/album";
import SmartImage from "@/app/(public)/components/SmartImage";

interface GalleryLayoutProps {
  albums: Album[];
  showFeatured?: boolean;
}

export default function GalleryLayout({
  albums,
  showFeatured = false,
}: GalleryLayoutProps) {
  const selectedAlbum = albums[0];

  return (
    <div className="space-y-8">
      {/* Featured */}
      {showFeatured && (
        <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
          <div className="relative h-96 md:h-125 overflow-hidden group cursor-pointer">
            <SmartImage
              src={selectedAlbum.cover_image_url || "/placeholder.jpg"}
              alt={selectedAlbum.title}
              width={900}
              height={600}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
            <Link
              href={`/album/${selectedAlbum.id}`}
              className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center"
            >
              <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-6 py-3 bg-orange-500 hover:bg-orange-700 text-white rounded-lg font-semibold">
                <i className="fa-solid fa-expand mr-2"></i>
                View All Images
              </button>
            </Link>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {selectedAlbum.title}
              </h2>
              <p className="text-gray-200 text-lg">
                {selectedAlbum.description || "ไม่มีคำอธิบาย"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {albums.map((album) => (
          <Link
            key={album.id}
            href={`/album/${album.id}`}
            className={`relative group overflow-hidden rounded-lg h-52 transition-all duration-300 transform hover:scale-105 ${
              selectedAlbum.id === album.id
                ? "ring-4 ring-orange-500 scale-105"
                : "opacity-95 hover:opacity-100"
            }`}
          >
            <SmartImage
              src={album.cover_image_url || "/placeholder.jpg"}
              alt={album.title}
              width={200}
              height={200}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center">
              <span className="text-white text-xs font-semibold text-center px-2">
                {album.title}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
