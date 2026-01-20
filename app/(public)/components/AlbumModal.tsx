"use client";

import { useEffect } from "react";
import { Album } from "@/types/album";
import AlbumImagesGallery from "./AlbumImagesGallery";

interface AlbumModalProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlbumModal({
  album,
  isOpen,
  onClose,
}: AlbumModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !album) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                {album.title}
              </h2>
              {album.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {album.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark text-2xl"></i>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <AlbumImagesGallery albumId={album.id} albumTitle={album.title} />
          </div>
        </div>
      </div>
    </>
  );
}
