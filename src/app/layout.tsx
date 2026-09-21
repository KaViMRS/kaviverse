import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KaviVerse — Catat Keuangan • Kelola File • Hidup Teratur",
  description:
    "Asisten pintar di Telegram untuk mencatat keuangan dengan mudah dan mengelola file dengan rapi, aman, dan terorganisir.",
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} dark`}>
      <body className="min-h-screen font-sans bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
