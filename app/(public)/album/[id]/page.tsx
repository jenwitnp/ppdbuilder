"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useAlbums } from "@/hooks/useAlbums";
import AlbumImagesGallery from "@/app/(public)/components/AlbumImagesGallery";

export default function AlbumPage() {
  const params = useParams();
  const albumId = params.id as string;
  const { data: albums = [] } = useAlbums();

  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Album not found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The album you're looking for doesn't exist.
            </p>
            <Link
              href="/#portfolio"
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-700 transition"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-12">
          <Link
            href="/#portfolio"
            className="inline-flex items-center px-4 py-2 text-orange-500 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition mb-6"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Back to Portfolio
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {/* Album Images Gallery */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <AlbumImagesGallery albumId={album.id} albumTitle={album.title} />
        </div>
      </div>
    </div>
  );
}
