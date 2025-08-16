"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SideBar } from "@/layouts/SideBar";
import { Header } from "@/layouts/Header";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <html lang="vi">
      <body
        className={`${inter.className} [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:bg-[#00e5a1]`}
      >
        <Header
          isMobile={isMobile}
          setMobileMenuOpen={setMobileMenuOpen}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <SideBar isMobile={isMobile} sidebarOpen={sidebarOpen} />

        <main
          className={`pt-16 ${
            !isMobile ? (sidebarOpen ? "ml-64" : "ml-24") : ""
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
