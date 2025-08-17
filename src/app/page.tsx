"use client";

import { useState } from "react";
import {
  Calendar,
  Camera,
  Users,
  DollarSign,
  Clock,
  Heart,
  MapPin,
  HardDrive,
  Cpu,
  Building2,
  Plus,
} from "lucide-react";
import Link from "next/link";

const mockAppointments = [
  {
    id: 1,
    couple: "Minh Anh & Tuấn Khang",
    date: "2025-01-15",
    time: "09:00",
    status: "confirmed",
    location: "Studio A",
  },
  {
    id: 2,
    couple: "Thu Hà & Đức Nam",
    date: "2025-01-15",
    time: "14:00",
    status: "pending",
    location: "Studio B",
  },
  {
    id: 3,
    couple: "Lan Phương & Việt Anh",
    date: "2025-01-16",
    time: "10:30",
    status: "confirmed",
    location: "Outdoor",
  },
];

const mockNotifications = [
  {
    id: 1,
    message: "Cặp đôi Minh Anh & Tuấn Khang đã xác nhận lịch hẹn",
    time: "10 phút trước",
    type: "info",
  },
  {
    id: 2,
    message: "Album ảnh cưới của Hoài Thu & Minh Đức đã sẵn sàng",
    time: "1 giờ trước",
    type: "success",
  },
  {
    id: 3,
    message: "Thanh toán từ Yến Nhi & Thanh Sơn đã được xử lý",
    time: "2 giờ trước",
    type: "success",
  },
];

const mockQuickActions = [
  {
    id: 1,
    title: "Tạo hợp đồng mới",
    description: "Bắt đầu hợp đồng cho cặp đôi mới",
    icon: Plus,
    href: "/contracts",
  },
  {
    id: 2,
    title: "Quản lý nhân viên",
    description: "Xem lịch làm việc và phân công",
    icon: Users,
    href: "/staff",
  },
  {
    id: 3,
    title: "Backup dữ liệu",
    description: "Sao lưu ảnh và file quan trọng",
    icon: HardDrive,
    href: "/retouch",
  },
];

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  return (
    <div className="mobile-padding mobile-spacing pt-4">
      {/* Creative Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100/50 mb-8">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative z-10 p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-0">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✨</span>
                  <span className="px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-blue-700 border border-blue-200/50">
                    Chào buổi sáng!
                  </span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Studio của bạn hôm nay
              </h1>

              <p className="text-slate-600 text-lg font-medium max-w-lg leading-relaxed">
                Sẵn sàng tạo ra những khoảnh khắc kỳ diệu cho các cặp đôi
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 font-medium">
                    Studio sẵn sàng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-600 font-medium">
                    Thời tiết đẹp ☀️
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-600 font-medium">
                    Thiết bị hoạt động tốt
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link href="/appointments">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
                  <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  Tạo buổi chụp mới
                </button>
              </Link>

              <Link href="/dashboard/analytics">
                <button className="bg-white/70 backdrop-blur-sm border border-white/80 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-white/90 transition-all duration-200 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  Xem báo cáo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid mobile-grid gap-4">
        <Link href="/appointments">
          <div className="glass-card border-blue-200/30 hover-lift hover-glow touch-manipulation cursor-pointer rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
            <div className="mobile-card p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">12</p>
                  <p className="text-sm text-slate-600">Lịch hẹn tuần này</p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/contracts">
          <div className="glass-card border-emerald-200/30 hover-lift hover-glow touch-manipulation cursor-pointer rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
            <div className="mobile-card p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">8</p>
                  <p className="text-sm text-slate-600">
                    Đơn hàng đang thực hiện
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/accounting">
          <div className="glass-card border-violet-200/30 hover-lift hover-glow touch-manipulation cursor-pointer rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
            <div className="mobile-card p-6">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-8 w-8 text-violet-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">285M</p>
                  <p className="text-sm text-slate-600">Doanh thu tháng này</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2 glass-card hover-lift hover-glow rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
          <div className="flex flex-row items-center justify-between p-6 pb-0">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Clock className="w-5 h-5 text-blue-600" />
              Lịch hẹn hôm nay
            </h3>
            <Link href="/appointments">
              <button className="glass touch-manipulation border border-slate-200 bg-white/50 text-slate-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-white/70 transition-colors">
                Xem tất cả
              </button>
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockAppointments.map((appointment) => (
                <Link
                  key={appointment.id}
                  href={`/appointments?id=${appointment.id}`}
                  className="block"
                >
                  <div className="flex items-center justify-between p-4 rounded-lg glass border-slate-200/50 hover-lift hover-glow touch-manipulation cursor-pointer border bg-white/30 backdrop-blur-sm transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center modern-shadow shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {appointment.couple}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {appointment.location} • {appointment.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {appointment.status === "confirmed"
                        ? "Đã xác nhận"
                        : "Chờ xác nhận"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="glass-card hover-lift hover-glow rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
          <div className="p-6 pb-0">
            <h3 className="text-lg font-semibold text-slate-800">
              Thông báo gần đây
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50/50 hover-lift transition-colors touch-manipulation"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.type === "success"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-slate-800">
                      {notification.message}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card hover-lift hover-glow rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
        <div className="p-6 pb-0">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Building2 className="w-5 h-5 text-blue-600" />
            Thao tác nhanh
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockQuickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.id} href={action.href}>
                  <div className="p-4 rounded-lg glass border-slate-200/50 hover-lift hover-glow touch-manipulation cursor-pointer transition-all border bg-white/30 backdrop-blur-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">
                          {action.title}
                        </p>
                        <p className="text-xs text-slate-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Studio Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card hover-lift hover-glow rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
          <div className="mobile-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Cpu className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-slate-800">Thiết bị</p>
                  <p className="text-sm text-slate-600">5/7 đang sử dụng</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">71%</p>
                <p className="text-xs text-slate-500">Sử dụng</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: "71%" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="glass-card hover-lift hover-glow rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
          <div className="mobile-card p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <HardDrive className="w-8 h-8 text-emerald-600" />
                <div>
                  <p className="font-medium text-slate-800">Lưu trữ</p>
                  <p className="text-sm text-slate-600">1.2TB / 2TB</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-slate-900">60%</p>
                <p className="text-xs text-slate-500">Đã dùng</p>
              </div>
            </div>
            <div className="mt-3 w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>

        <Link href="/staff">
          <div className="glass-card hover-lift hover-glow touch-manipulation cursor-pointer rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
            <div className="mobile-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-violet-600" />
                  <div>
                    <p className="font-medium text-slate-800">Nhân viên</p>
                    <p className="text-sm text-slate-600">8 người làm việc</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">8</p>
                  <p className="text-xs text-slate-500">Hoạt động</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
  // <main>{renderPage()}</main>;
}
