"use client";

import { useAlbums } from "@/hooks/useAlbums";
import GalleryLayout from "./portfolio-layouts/GalleryLayout";

export default function PortfolioSection() {
  const { data: albums = [], isLoading, error } = useAlbums(10);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">
              เกิดข้อผิดพลาด
            </h2>
            <p className="mt-2 text-red-500">
              {error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูล"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Portfolio
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              ไม่มีผลงาน
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="portfolio"
      className="py-2 pb-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-orange-600 dark:text-orange-400 font-semibold tracking-wide uppercase">
            Our Works
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            โครงการเด่น
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            ผลงานก่อสร้างที่แสดงถึงความเชี่ยวชาญและความยึดมั่นในคุณภาพ
          </p>
        </div>

        {/* Gallery Layout */}
        <GalleryLayout albums={albums} />
      </div>
    </section>
  );
}
