"use client";

import HeroSection from "./sections/HeroSection";
import ServicesSection from "./sections/ServicesSection";
import PortfolioSection from "./sections/PortfolioSection";
import ContactSection from "./sections/ContactSection";

export default function Home() {
  return (
    <>
      {/* Hero Carousel Section */}
      <HeroSection />

      {/* Services Section */}
      <ServicesSection />

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* Stats Section */}
      <section className=" dark:bg-gray-900 overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-0 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6 text-center transform hover:scale-105 transition duration-300">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                โครงการที่สำเร็จ
              </dt>
              <dd className="mt-1 text-4xl font-semibold text-orange-500 dark:text-orange-400">
                150+
              </dd>
            </div>
            <div className="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6 text-center transform hover:scale-105 transition duration-300">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                ปีแห่งประสบการณ์
              </dt>
              <dd className="mt-1 text-4xl font-semibold text-orange-500 dark:text-orange-400">
                12
              </dd>
            </div>
            <div className="px-4 py-5 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6 text-center transform hover:scale-105 transition duration-300">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                ความพึงพอใจลูกค้า
              </dt>
              <dd className="mt-1 text-4xl font-semibold text-orange-500 dark:text-orange-400">
                100%
              </dd>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
