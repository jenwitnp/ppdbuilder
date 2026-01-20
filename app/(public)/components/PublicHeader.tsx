"use client";

import { useState, useLayoutEffect, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { services } from "@/lib/services";
import Image from "next/image";

export default function PublicHeader() {
  const { theme, setTheme } = useTheme();
  const { data: companyInfo } = useCompanyInfo();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);

  // Use useLayoutEffect to prevent hydration mismatch
  // This runs synchronously before browser paint
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Handle scroll
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Get logo based on current theme
  const logoUrl =
    theme === "dark" ? companyInfo?.logo_url_dark : companyInfo?.logo_url;

  return (
    <header
      className={`sticky w-full top-0 z-50 transition-all duration-300 glass ${
        isScrolled
          ? "shadow-md bg-white/80 dark:bg-gray-900/80"
          : "bg-white/70 dark:bg-gray-900/70"
      } backdrop-blur-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {logoUrl ? (
                <div className="h-12 w-auto">
                  <Image
                    src={logoUrl}
                    alt={companyInfo?.company_name || "Logo"}
                    height={56}
                    width={56}
                    className="h-12 w-auto object-contain"
                  />
                </div>
              ) : (
                <div className="text-2xl font-bold text-brand-700 dark:text-brand-500 flex items-center gap-2">
                  <i className="fa-solid fa-helmet-safety text-accent-500"></i>
                  <span>
                    PPD
                    <span className="text-gray-600 dark:text-gray-300">
                      BUILDER
                    </span>
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition"
            >
              หน้าแรก
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition flex items-center gap-1"
              >
                บริการของเรา
                <i className="fa-solid fa-chevron-down text-xs group-hover:rotate-180 transition"></i>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-gray-200 dark:border-gray-700">
                <div className="py-2">
                  <Link
                    href="/services"
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition font-semibold border-b border-gray-200 dark:border-gray-700"
                  >
                    <i className="fa-solid fa-list mr-2"></i>
                    ดูบริการทั้งหมด
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400 transition border-l-4 border-transparent hover:border-orange-600"
                    >
                      <div className="flex items-center gap-3">
                        <i className={`fa-solid ${service.icon}`}></i>
                        <div className="text-left">
                          <p className="font-medium">{service.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/portfolio"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition"
            >
              ผลงาน
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 font-medium transition"
            >
              เกี่ยวกับเรา
            </Link>
            <a
              href="#contact"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-full font-medium transition shadow-lg shadow-orange-500/30"
            >
              ติดต่อเรา
            </a>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none"
              aria-label="Toggle theme"
            >
              <i
                className={`fas ${
                  theme === "dark"
                    ? "fa-sun text-orange-400"
                    : "fa-moon text-gray-600"
                } text-xl`}
              ></i>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition focus:outline-none"
              aria-label="Toggle theme"
            >
              <i
                className={`fas ${
                  theme === "dark"
                    ? "fa-sun text-yellow-400"
                    : "fa-moon text-gray-600"
                } text-xl`}
              ></i>
            </button>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-200 hover:text-orange-600 focus:outline-none"
            >
              <i
                className={`fas ${
                  isMobileMenuOpen ? "fa-times" : "fa-bars"
                } text-2xl`}
              ></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="#home"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              หน้าแรก
            </a>

            {/* Mobile Services Dropdown */}
            <div>
              <button
                onClick={() =>
                  setIsServicesDropdownOpen(!isServicesDropdownOpen)
                }
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between"
              >
                บริการของเรา
                <i
                  className={`fa-solid fa-chevron-down text-xs transition-transform ${
                    isServicesDropdownOpen ? "rotate-180" : ""
                  }`}
                ></i>
              </button>
              {isServicesDropdownOpen && (
                <div className="bg-gray-100 dark:bg-gray-800 rounded-md mt-1">
                  <Link
                    href="/services"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsServicesDropdownOpen(false);
                    }}
                    className="block px-6 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 border-b border-gray-200 dark:border-gray-700"
                  >
                    <i className="fa-solid fa-list mr-2"></i>
                    ดูบริการทั้งหมด
                  </Link>
                  {services.map((service) => (
                    <Link
                      key={service.id}
                      href={`/services/${service.slug}`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsServicesDropdownOpen(false);
                      }}
                      className="block px-6 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-50 dark:hover:bg-gray-700 border-l-4 border-transparent hover:border-orange-600"
                    >
                      <div className="flex items-center gap-2">
                        <i className={`fa-solid ${service.icon}`}></i>
                        <span className="font-medium">{service.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/portfolio"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ผลงาน
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              เกี่ยวกับเรา
            </Link>
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-orange-600 dark:text-orange-400 font-bold"
            >
              ติดต่อเรา
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
