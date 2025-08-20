"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SideBar } from "@/layouts/SideBar";
import { Header } from "@/layouts/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  FileText,
  Home,
  Calendar,
  Calculator,
  Sparkles,
  Users,
  MessageCircle,
  Info,
  Clock,
  ChevronRight,
} from "lucide-react";
import { MenuItem } from "@/types";

const inter = Inter({ subsets: ["latin"] });

const menuItems: MenuItem[] = [
  { name: "Dashboard", key: "dashboard", icon: Home, path: "/" },
  {
    name: "Lịch hẹn",
    key: "appointments",
    icon: Calendar,
    path: "/appointments",
  },
  { name: "Lịch biểu", key: "schedule", icon: Clock, path: "/schedule" },
  { name: "Hợp đồng", key: "contracts", icon: FileText, path: "/contracts" },
  { name: "Kế toán", key: "accounting", icon: Calculator, path: "/accounting" },
  { name: "Retouch", key: "retouch", icon: Sparkles, path: "/retouch" },
  { name: "Nhân viên", key: "staff", icon: Users, path: "/staff" },
  { name: "CRM", key: "crm", icon: MessageCircle, path: "/crm" },
  { name: "Thông tin Studio", key: "studio-info", icon: Info, path: "/info" },
  { name: "Cài đặt", key: "settings", icon: Settings, path: "/settings" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

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

  const getPageTitle = (pathname: string) => {
    const page = menuItems.find((item) => item.path === pathname);
    return page ? page.name : pathname;
  };

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
        {pathname !== "/" && (
          <div
            className={`fixed top-16 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 transition-all duration-300 ${
              !isMobile ? (sidebarOpen ? "ml-64" : "ml-24") : ""
            }`}
          >
            <div className="px-4 py-3">
              <nav className="flex items-center space-x-2 text-sm">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-2 py-1 h-auto text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {getPageTitle(pathname)}
                </span>
              </nav>
            </div>
          </div>
        )}
        <SideBar
          isMobile={isMobile}
          sidebarOpen={sidebarOpen}
          menuItems={menuItems}
        />

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
