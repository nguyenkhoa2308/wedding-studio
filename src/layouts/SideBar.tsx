"use client";

import React from "react";
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
} from "lucide-react";

interface SideBarProps {
  isMobile: boolean;
  sidebarOpen: boolean;
}

const menuItems = [
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
  {
    name: "Thông tin Studio",
    key: "studio-info",
    icon: Info,
    path: "/info",
  },
  { name: "Cài đặt", key: "settings", icon: Settings, path: "/settings" },
];

// Hàm để lấy active key từ pathname
function getActiveKeyFromPath(pathname: string): string {
  const item = menuItems.find((item) => item.path === pathname);
  return item?.key || "dashboard";
}

// Sidebar mở rộng
function ExpandedSidebar() {
  const pathname = usePathname();
  const activeKey = getActiveKeyFromPath(pathname);

  return (
    <aside
      className="fixed top-14 left-0 bottom-0 z-40 w-64 border-r border-gray-200 bg-white p-2"
      aria-label="Sidebar"
    >
      <nav className="h-full overflow-y-auto py-2">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <li key={item.key}>
                <Link
                  href={item.path}
                  className="group w-full h-12 relative transition-colors focus:outline-none text-[#0f0f0f] hover:text-slate-900 cursor-pointer block"
                  aria-current={isActive ? "page" : undefined}
                >
                  <div
                    className={[
                      "absolute inset-y-0 left-3 right-3 rounded-xl transition-colors",
                      isActive
                        ? "bg-slate-200 group-hover:bg-slate-300"
                        : "group-hover:bg-slate-200",
                    ].join(" ")}
                  />
                  {/* Icon */}
                  <div className="absolute left-0 top-0 w-20 h-full flex items-center justify-center z-10">
                    <Icon className="w-7 h-7 shrink-0" />
                  </div>
                  {/* Text */}
                  <div className="ml-20 pr-3 h-full flex items-center z-10 relative">
                    <span className="text-base truncate">{item.name}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

// Sidebar thu gọn
function CollapsedSidebar() {
  const pathname = usePathname();
  const activeKey = getActiveKeyFromPath(pathname);

  return (
    <aside
      className="fixed top-14.5 left-[0.7px] bottom-0 z-40 w-24 border-r border-gray-200 bg-white p-2"
      aria-label="Sidebar"
    >
      <nav className="h-full py-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeKey === item.key;

            return (
              <li key={item.key}>
                <Link
                  href={item.path}
                  className="group relative w-full px-1 py-2 focus:outline-none cursor-pointer block"
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.name}
                  title={item.name}
                >
                  {/* NỀN: phủ toàn bộ nút */}
                  <div
                    className={[
                      "pointer-events-none absolute inset-0 rounded-2xl transition-colors",
                      isActive
                        ? "bg-slate-200 group-hover:bg-slate-300"
                        : "group-hover:bg-slate-200",
                    ].join(" ")}
                  />

                  {/* NỘI DUNG: icon + label xếp dọc, luôn nằm trên nền */}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <Icon className="w-7 h-7 transition-all" />
                    <span
                      className={[
                        "text-[11px] leading-tight truncate w-full text-center transition-colors",
                        isActive
                          ? "text-slate-900"
                          : "text-slate-600 group-hover:text-slate-900",
                      ].join(" ")}
                    >
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export function SideBar({ isMobile, sidebarOpen }: SideBarProps) {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-gray-50">
      {!isMobile && (sidebarOpen ? <ExpandedSidebar /> : <CollapsedSidebar />)}
    </div>
  );
}
