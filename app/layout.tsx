import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  weight: ["300", "400", "600", "700"],
  subsets: ["thai"],
  variable: "--font-kanit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PPD Builder | รับเหมาก่อสร้างและให้คำปรึกษาครบวงจร",
  description:
    "บริการรับเหมาก่อสร้างและให้คำปรึกษาโดยทีมงานมืออาชีพ ออกแบบ ก่อสร้าง ต่อเติม ครบวงจร",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`scroll-smooth ${kanit.variable}`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body
        className={`${kanit.className} min-h-screen transition-colors duration-300 bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
