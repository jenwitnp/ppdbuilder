"use client";

import { useState } from "react";
import Link from "next/link";
import { useAlbumsPaginated } from "@/hooks/useAlbumsPaginated";
import GalleryLayout from "@/app/(public)/sections/portfolio-layouts/GalleryLayout";

const ITEMS_PER_PAGE = 8;

export default function PortfolioPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useAlbumsPaginated(
    ITEMS_PER_PAGE,
    currentPage,
  );

  const albums = data?.data || [];
  const totalAlbums = data?.total || 0;
  const totalPages = Math.ceil(totalAlbums / ITEMS_PER_PAGE);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            เกิดข้อผิดพลาด
          </h2>
          <p className="text-red-500">
            {error instanceof Error ? error.message : "ไม่สามารถโหลดข้อมูลได้"}
          </p>
        </div>
      </main>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            ผลงาน
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            ไม่มีผลงานในขณะนี้
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 to-orange-700 dark:from-gray-800 dark:to-gray-900 text-white py-16">
        <div className="absolute inset-0 opacity-10">
          <i className="fa-solid fa-image text-9xl absolute -top-20 -right-20 text-white"></i>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-800 dark:text-orange-500 hover:text-white transition mb-6"
          >
            <i className="fa-solid fa-arrow-left"></i>
            กลับหน้าแรก
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">ผลงานของเรา</h1>
          <p className="text-lg text-gray-800 dark:text-orange-500 max-w-2xl">
            ชมการสะสมโครงการก่อสร้างที่มีคุณภาพ ออกแบบได้สวยงาม
            และบรรลุความพึงพอใจของลูกค้า
          </p>
        </div>
      </div>

      {/* Portfolio Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-2">
              {totalAlbums}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              โครงการทั้งหมด
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-2">
              {totalPages}
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">หน้า</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-2">
              100%
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              ความพึงพอใจลูกค้า
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <GalleryLayout albums={albums} showFeatured={false} />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-6">
            {/* Page Info */}
            <p className="text-gray-600 dark:text-gray-400">
              หน้าที่{" "}
              <span className="font-bold text-orange-600 dark:text-orange-500">
                {currentPage}
              </span>{" "}
              จาก{" "}
              <span className="font-bold text-orange-600 dark:text-orange-500">
                {totalPages}
              </span>
            </p>

            {/* Pagination Buttons */}
            <div className="flex flex-wrap justify-center gap-2">
              {/* Previous Button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium transition disabled:cursor-not-allowed"
              >
                <i className="fa-solid fa-chevron-left mr-2"></i>
                ก่อนหน้า
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      currentPage === page
                        ? "bg-orange-600 text-white dark:bg-orange-500"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium transition disabled:cursor-not-allowed"
              >
                ถัดไป
                <i className="fa-solid fa-chevron-right ml-2"></i>
              </button>
            </div>

            {/* Items Info */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              แสดง {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
              {Math.min(currentPage * ITEMS_PER_PAGE, totalAlbums)} จาก{" "}
              {totalAlbums} โครงการ
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            สนใจโครงการอื่นๆ?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            ติดต่อเรา
            เพื่อรู้ข้อมูลเพิ่มเติมเกี่ยวกับบริการของเราหรือปรึกษาโครงการของคุณ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/services"
              className="inline-block bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-500 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition border border-orange-600 dark:border-orange-500"
            >
              ดูบริการของเรา
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
