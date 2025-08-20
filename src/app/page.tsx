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
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
  const currentDate = new Date();
  const timeString = currentDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateString = currentDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <div className="mobile-padding mobile-spacing pt-4">
      {/* Creative Header */}
      <div className="relative mb-8">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-2xl"></div>

        {/* Decorative elements */}
        <div className="absolute top-6 right-6 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-xl blur-3xl"></div>
        <div className="absolute bottom-6 left-6 w-24 h-24 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-xl blur-2xl"></div>

        <div className="flex flex-col gap-6 relative border border-blue-200/30 shadow-xl bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="p-8">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-start justify-between mb-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="h-15 w-15 md:h-20 md:w-20 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-2xl ring-2 ring-blue-100">
                    <Image
                      width={100}
                      height={100}
                      src="/images/plannie-logo.jpg"
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Chào buổi sáng, Thu Hà!
                    </h1>
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                  </div>

                  <p className="text-gray-600 mb-4 max-w-md leading-relaxed">
                    Chào mừng bạn trở lại với{" "}
                    <span className="font-semibold text-blue-600">
                      Plannie Studio
                    </span>
                    . Hôm nay sẽ là một ngày tuyệt vời với nhiều cơ hội mới! ✨
                  </p>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-500 bg-white/50 px-3 py-2 rounded-full">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">{dateString}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/appointments">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group text-sm md:text-base">
                  <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  Tạo buổi chụp mới
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                  <p className="text-sm text-slate-600">Đơn đang thực hiện</p>
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
        <div className="lg:col-span-2 glass-card rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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
                  <div className="flex items-center justify-between p-3 md:p-4 rounded-lg glass border-slate-200/50 hover-lift hover-glow touch-manipulation cursor-pointer border bg-white/30 backdrop-blur-sm transition-all duration-200">
                    <div className="flex items-center space-x-2 md:space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center modern-shadow shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="">
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
                      className={`px-2 py-1 rounded-full text-xs font-medium text-center w-[70px] sm:w-auto ${
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
        <div className="glass-card rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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
      <div className="glass-card rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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
        <div className="glass-card rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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

        <div className="glass-card rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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
          <div className="glass-card touch-manipulation cursor-pointer rounded-lg border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-200">
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
