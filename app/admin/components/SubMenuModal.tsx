"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import * as Icons from "lucide-react";
import { MenuItem } from "@/types/menu";

interface SubMenuModalProps {
  item: MenuItem;
  onClose: () => void;
}

export default function SubMenuModal({ item, onClose }: SubMenuModalProps) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Content */}
      <div
        className={`absolute bottom-0 left-0 right-0 md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[400px] bg-white dark:bg-slate-800 rounded-t-2xl md:rounded-2xl shadow-2xl transform transition-transform duration-300 ${
          isVisible
            ? "translate-y-0 md:translate-y-0 scale-100"
            : "translate-y-full md:translate-y-10 scale-95"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {item.title}
            </h3>
            <button
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {item.submenu?.map((sub, index) => {
              const IconComponent = Icons[
                sub.icon as keyof typeof Icons
              ] as any;

              return (
                <div
                  key={index}
                  onClick={() => {
                    if (sub.path) {
                      router.push(sub.path);
                      handleClose();
                    }
                  }}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-12 h-12 ${
                      sub.color || "bg-gray-400"
                    } rounded-xl flex items-center justify-center text-white shadow-md mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {sub.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Handle for mobile drag (visual only) */}
        <div className="md:hidden flex justify-center pb-2">
          <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
