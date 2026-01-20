"use client";

import { User, LogOut, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3  border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200 tracking-tight bg-linear-to-r from-primary to-secondary bg-clip-text sm:inline-block">
            AdminPanel
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}

          {/* User Profile */}
          <div
            className="relative flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700"
            ref={dropdownRef}
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold leading-none">
                {session?.user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {(session?.user as ExtendedUser)?.role || "User"}
              </p>
            </div>
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-linear-to-r from-blue-500 to-cyan-500 p-0.5]">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full bg-white dark:bg-slate-800"
                />
              </div>
              <div className="absolute w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full bottom-0 right-0" />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={() => {
                    router.push("/profile");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>โปรไฟล์</span>
                </button>
                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                <button
                  onClick={async () => {
                    setIsDropdownOpen(false);
                    await signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>ออกจากระบบ</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
