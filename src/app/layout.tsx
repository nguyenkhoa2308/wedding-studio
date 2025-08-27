"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { SideBar } from "@/layouts/SideBar";
import { Header } from "@/layouts/Header";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  Home,
  Calendar,
  Calculator,
  Sparkles,
  Users,
  ChevronRight,
  UserCheck,
  DollarSign,
} from "lucide-react";
import { MenuItem } from "@/types";
import { AppointmentsProvider } from "@/contexts/AppointmentsContext";
import { ContractsProvider } from "@/contexts/ContractsContext";
import { PricingProvider } from "@/contexts/PricingContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import {
  PermissionProvider,
  usePermissions,
} from "@/contexts/PermissionContext";
// import PrivateRoute from "@/components/PrivateRoute";
// import LoginForm from "./login/page";

const inter = Inter({ subsets: ["latin"] });

const menuItems: MenuItem[] = [
  { name: "Dashboard", key: "dashboard", icon: Home, path: "/" },
  {
    name: "Lịch hẹn",
    key: "appointments",
    icon: Calendar,
    path: "/appointments",
  },
  // { name: "Lịch biểu", key: "schedule", icon: Clock, path: "/schedule" },
  { name: "Hợp đồng", key: "contracts", icon: FileText, path: "/contracts" },
  { name: "Kế toán", key: "accounting", icon: Calculator, path: "/accounting" },
  {
    name: "Bảng giá dịch vụ",
    key: "pricing",
    icon: DollarSign,
    path: "/pricing",
  },
  { name: "Retouch", key: "retouch", icon: Sparkles, path: "/retouch" },
  { name: "Nhân viên", key: "staff", icon: Users, path: "/staff" },
  { name: "CRM", key: "crm", icon: UserCheck, path: "/crm" },
  // {
  //   name: "Phân quyền",
  //   key: "permissions",
  //   icon: Shield,
  //   path: "/permissions",
  // },
  // { name: "Thông tin Studio", key: "studio-info", icon: Info, path: "/info" },
  // { name: "Cài đặt", key: "settings", icon: Settings, path: "/settings" },
];

const nakedRoutes = ["/login"];

// Auth wrapper component to handle login/register state
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { canAccessPage } = usePermissions();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<string>("dashboard");
  const [accessDeniedPage, setAccessDeniedPage] = useState<
    string | undefined
  >();
  const [showLoading, setShowLoading] = useState(true);

  const handlePageChange = (page: string) => {
    if (user && page !== "dashboard" && !canAccessPage(page)) {
      setAccessDeniedPage(page);
      setCurrentPage("not-found");
      return;
    }

    setCurrentPage(page);
    setAccessDeniedPage(undefined);
  };

  // Show login/register forms if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login"); // Redirect to login if user is not authenticated
    }
  }, [user, router]);

  // Loading state while checking authentication
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false); // Hide loading after 1 second
    }, 1000);

    return () => clearTimeout(timer); // Clear the timer on unmount
  }, []);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isNaked = nakedRoutes.some((r) => pathname?.startsWith(r));

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
        <AuthProvider>
          <PermissionProvider>
            <ContractsProvider>
              <AppointmentsProvider>
                <PricingProvider>
                  {/* <PrivateRoute> */}
                  <AuthWrapper>
                    {!isNaked && (
                      <Header
                        isMobile={isMobile}
                        mobileMenuOpen={mobileMenuOpen}
                        setMobileMenuOpen={setMobileMenuOpen}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                      />
                    )}
                    {!isNaked && pathname !== "/" && (
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
                              <span className="hidden sm:inline">
                                Dashboard
                              </span>
                            </Link>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900 dark:text-gray-100 font-medium">
                              {getPageTitle(pathname)}
                            </span>
                          </nav>
                        </div>
                      </div>
                    )}
                    {!isNaked && (
                      <SideBar
                        isMobile={isMobile}
                        sidebarOpen={sidebarOpen}
                        mobileMenuOpen={mobileMenuOpen}
                        menuItems={menuItems}
                      />
                    )}
                    <main
                      className={`${
                        !isNaked &&
                        `pt-16 ${
                          !isMobile ? (sidebarOpen ? "ml-64" : "ml-24") : ""
                        }`
                      }`}
                    >
                      {children}
                    </main>
                  </AuthWrapper>

                  {/* </PrivateRoute> */}
                </PricingProvider>
              </AppointmentsProvider>
            </ContractsProvider>
          </PermissionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
