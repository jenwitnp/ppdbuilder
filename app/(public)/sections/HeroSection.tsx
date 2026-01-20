"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { useSlides } from "@/hooks/useSlides";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

export default function HeroSection() {
  const { data: slides = [], isLoading, error } = useSlides();

  if (isLoading) {
    return (
      <section className="relative h-[600px] bg-gray-200 dark:bg-gray-800 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative h-[600px] bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-red-800 dark:text-red-400 mb-4">
              เกิดข้อผิดพลาด
            </h2>
            <p className="text-lg text-red-600 dark:text-red-300">
              {error instanceof Error
                ? error.message
                : "ไม่สามารถโหลดข้อมูลสไลด์"}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!slides || slides.length === 0) {
    return (
      <section className="relative h-[600px] bg-gradient-to-br from-orange-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              ยินดีต้อนรับสู่ PPD Builder
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              ไม่มีสไลด์แสดงในขณะนี้
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        loop={slides.length > 1}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full flex items-center justify-center bg-gray-900">
              <img
                src={slide.image_url}
                alt={slide.title || "Slide"}
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Content - Hidden on mobile, visible on md and up */}
              {(slide.title || slide.link_url) && (
                <div className="hidden md:block absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16">
                  <div className="max-w-7xl mx-auto">
                    {slide.title && (
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.link_url && (
                      <a
                        href={slide.link_url}
                        className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-orange-600 transition-all duration-300 transform hover:scale-105"
                      >
                        เรียนรู้เพิ่มเติม
                        <svg
                          className="ml-2 w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom styles for Swiper navigation and pagination */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: white !important;
          background: rgba(0, 0, 0, 0.3);
          width: 50px !important;
          height: 50px !important;
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.5);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px !important;
        }

        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 12px !important;
          height: 12px !important;
        }

        .swiper-pagination-bullet-active {
          opacity: 1 !important;
          background: #ff8904 !important;
        }

        @media (max-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 40px !important;
            height: 40px !important;
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
