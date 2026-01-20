"use client";

import Navbar from "@/app/admin/components/AdminNavbar";
import Providers from "@/app/admin/components/AdminProviders";
import { ThemeProvider } from "next-themes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey="admin-theme"
    >
      <Providers>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          {children}
        </main>
      </Providers>
    </ThemeProvider>
  );
}
