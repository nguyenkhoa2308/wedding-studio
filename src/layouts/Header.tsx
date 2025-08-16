"use client";

import { Menu, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

interface HeaderProps {
  isMobile: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

export function Header({
  isMobile,
  setMobileMenuOpen,
  sidebarOpen,
  setSidebarOpen,
}: HeaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng khi click ra ngoài hoặc nhấn Esc
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="fixed top-0 left-2 right-0 z-50 bg-white border-b border-gray-200 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section - Logo + Hamburger */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={() => {
              if (isMobile) {
                setMobileMenuOpen(true);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full touch-manipulation cursor-pointer"
            title="Mở sidebar"
          >
            <Menu className="w-7 h-7" />
          </button>

          <Link
            href="/"
            className="flex items-center space-x-2 select-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                width={500}
                height={500}
                src="/images/plannie-logo.jpg"
                alt="Plannie Studio"
                className="w-10 h-10 object-cover rounded-lg"
              />
            </div>
            <span className="font-semibold text-xl text-gray-900 hidden sm:block">
              Plannie Studio
            </span>
          </Link>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-6 flex-shrink-0">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-full touch-manipulation">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 p-0 text-sm bg-red-500 text-white rounded-full">
              3
            </span>
          </button>

          {/* User Menu - giữ nguyên code cũ */}
          <div className="relative" ref={ref}>
            <button
              type="button"
              title="Mở menu người dùng"
              onClick={() => setOpen((v) => !v)}
              className="relative p-1 hover:bg-gray-100 rounded-full touch-manipulation focus:outline-none cursor-pointer"
            >
              <span className="sr-only">Mở menu người dùng</span>
              <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200">
                <Image
                  width={100}
                  height={100}
                  src="/images/plannie-logo.jpg"
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            </button>

            {open && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
              >
                {/* User menu content giữ nguyên */}
                <div className="flex items-center justify-start gap-2 p-3">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      width={100}
                      height={100}
                      src="/images/plannie-logo.jpg"
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nguyễn Minh Anh
                    </p>
                    <p className="text-xs leading-none text-gray-600">
                      admin@weddingstudio.com
                    </p>
                  </div>
                </div>

                <div className="h-px bg-gray-200" />

                <Link
                  href="/profile"
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20 21a8 8 0 10-16 0M12 11a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>
                  <span>Hồ sơ</span>
                </Link>

                <Link
                  href="/settings"
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                  onClick={() => setOpen(false)}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.983 13.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
                    />
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.5 0 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 000-1.5 1.65 1.65 0 000-1.5 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001.5 0 1.65 1.65 0 001.5 0 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 000 1.5 1.65 1.65 0 000 1.5z"
                    />
                  </svg>
                  <span>Cài đặt</span>
                </Link>

                <div className="h-px bg-gray-200" />

                <button
                  role="menuitem"
                  className="touch-manipulation w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 3h4a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                    />
                  </svg>
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
