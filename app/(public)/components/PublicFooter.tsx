"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useLayoutEffect } from "react";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function PublicFooter() {
  const { theme } = useTheme();
  const { data: companyInfo } = useCompanyInfo();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const logoUrl =
    theme === "dark" ? companyInfo?.logo_url_dark : companyInfo?.logo_url;

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-2">
            {logoUrl ? (
              <div className="h-9 w-auto mb-4">
                <Image
                  src={logoUrl}
                  alt={companyInfo?.company_name || "Logo"}
                  height={64}
                  width={64}
                  className="h-9 w-auto object-contain"
                />
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <i className="fa-solid fa-helmet-safety text-amber-500"></i>
                <span>
                  {companyInfo?.company_name?.split(" ")[0] || "PPD"}
                  <span className="text-gray-700 dark:text-gray-400 text-base">
                    {companyInfo?.company_name?.split(" ").slice(1).join(" ") ||
                      "BUILDER"}
                  </span>
                </span>
              </span>
            )}
            {companyInfo?.slogan && (
              <p className="text-gray-700 dark:text-gray-400 text-sm mt-2">
                {companyInfo.slogan}
              </p>
            )}
            {companyInfo?.description && (
              <p className="text-gray-700 dark:text-gray-400 text-sm mt-2">
                {companyInfo.description}
              </p>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ติดต่อเรา
            </h3>
            <div className="space-y-3">
              {companyInfo?.phone && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  <i className="fa-solid fa-phone w-5"></i>
                  <a href={`tel:${companyInfo.phone}`}>{companyInfo.phone}</a>
                </div>
              )}
              {companyInfo?.email && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition">
                  <i className="fa-solid fa-envelope w-5"></i>
                  <a href={`mailto:${companyInfo.email}`}>
                    {companyInfo.email}
                  </a>
                </div>
              )}
              {companyInfo?.address && (
                <div className="flex items-start gap-2 text-gray-700 dark:text-gray-400">
                  <i className="fa-solid fa-map-pin w-5 mt-1 shrink-0"></i>
                  <span className="break-words">{companyInfo.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ติดตามเรา
            </h3>
            <div className="flex gap-4">
              {companyInfo?.facebook_url && (
                <a
                  href={companyInfo.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
                >
                  <i className="fa-brands fa-facebook text-2xl"></i>
                </a>
              )}
              {companyInfo?.line_url && (
                <a
                  href={companyInfo.line_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  <i className="fa-brands fa-line text-2xl"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-700 dark:text-gray-400 text-sm">
            © 2025 {companyInfo?.company_name || "PPD Builder"} Co., Ltd. All
            rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-700 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-700 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
