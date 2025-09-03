"use client";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Clock,
  Users,
  Camera,
  X,
  Search,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Appointment, AppointmentStatus } from "@/types";
import { useAppointments } from "@/contexts/AppointmentsContext";
import AppointmentCard from "./components/AppoinmentCard";

// interface Appointment {
//   id: number;
//   couple: string;
//   phone: string;
//   email: string;
//   bookDate: string;
//   shootDate: string;
//   weddingDate: string;
//   time: string;
//   duration: string;
//   location: string;
//   mainPhotographer: string;
//   assistantPhotographer: string;
//   makeupArtist: string;
//   status: "confirmed" | "pending" | "cancelled";
//   package: string;
//   notes: string;
// }

// const mockAppointments: Appointment[] = [
//   {
//     id: 1,
//     couple: "Minh Anh & Tuấn Khang",
//     phone: "0901234567",
//     email: "minhanh@email.com",
//     bookDate: "2025-01-10",
//     shootDate: "2025-01-15",
//     weddingDate: "2025-03-15",
//     time: "09:00",
//     duration: "4 giờ",
//     location: "Studio A",
//     mainPhotographer: "Nguyễn Văn A",
//     assistantPhotographer: "Trần Minh B",
//     makeupArtist: "Lê Thị Hoa",
//     status: "confirmed",
//     package: "Premium Wedding",
//     notes: "Cặp đôi muốn chụp concept vintage",
//   },
//   {
//     id: 2,
//     couple: "Thu Hà & Đức Nam",
//     phone: "0912345678",
//     email: "thuha@email.com",
//     bookDate: "2025-01-12",
//     shootDate: "2025-01-15",
//     weddingDate: "2025-02-28",
//     time: "14:00",
//     duration: "3 giờ",
//     location: "Studio B",
//     mainPhotographer: "Trần Thị B",
//     assistantPhotographer: "Nguyễn Văn C",
//     makeupArtist: "Phạm Thị Mai",
//     status: "pending",
//     package: "Classic Wedding",
//     notes: "Chụp ảnh cưới truyền thống",
//   },
//   {
//     id: 3,
//     couple: "Lan Phương & Việt Anh",
//     phone: "0923456789",
//     email: "lanphuong@email.com",
//     bookDate: "2025-01-08",
//     shootDate: "2025-01-16",
//     weddingDate: "2025-04-20",
//     time: "10:30",
//     duration: "5 giờ",
//     location: "Outdoor - Công viên Tao Đàn",
//     mainPhotographer: "Lê Văn C",
//     assistantPhotographer: "Hoàng Minh D",
//     makeupArtist: "Vũ Thị Lan",
//     status: "confirmed",
//     package: "Luxury Wedding",
//     notes: "Chụp ngoại cảnh, cần chuẩn bị trang phục thay đổi",
//   },
//   {
//     id: 4,
//     couple: "Hoài Thu & Minh Đức",
//     phone: "0934567890",
//     email: "hoaithu@email.com",
//     bookDate: "2025-01-05",
//     shootDate: "2025-01-17",
//     weddingDate: "2025-03-10",
//     time: "08:00",
//     duration: "6 giờ",
//     location: "Studio A + Outdoor",
//     mainPhotographer: "Nguyễn Văn A",
//     assistantPhotographer: "Trần Minh B",
//     makeupArtist: "Đặng Thị Hương",
//     status: "confirmed",
//     package: "Premium Wedding",
//     notes: "Chụp studio buổi sáng, ngoại cảnh buổi chiều",
//   },
// ];

const photographers = [
  "Nguyễn Văn A",
  "Trần Thị B",
  "Lê Văn C",
  "Phạm Văn D",
  "Trần Minh B",
  "Nguyễn Văn C",
  "Hoàng Minh D",
];
const makeupArtists = [
  "Lê Thị Hoa",
  "Phạm Thị Mai",
  "Vũ Thị Lan",
  "Đặng Thị Hương",
  "Trần Thị Kim",
];
const locations = [
  "Studio A",
  "Studio B",
  "Studio C",
  "Outdoor - Công viên Tao Đàn",
  "Outdoor - Hồ Gươm",
  "Outdoor - Cầu Long Biên",
];
const packages = [
  "Basic Wedding",
  "Classic Wedding",
  "Premium Wedding",
  "Luxury Wedding",
];

interface NewAppointment {
  couple: string;
  phone: string;
  email: string;
  bookDate: string;
  shootDate: string;
  weddingDate: string;
  time: string;
  duration: string;
  location: string;
  mainPhotographer: string;
  assistantPhotographer: string;
  makeupArtist: string;
  package: string;
  notes: string;
}
export default function AppointmentsPage() {
  const { appointments } = useAppointments();
  // Status change dialog states
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [selectedAppointmentForStatus, setSelectedAppointmentForStatus] =
    useState<Appointment | null>(null);
  const [targetStatus, setTargetStatus] =
    useState<AppointmentStatus>("staff_assignment");
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    couple: "",
    phone: "",
    email: "",
    bookDate: "",
    shootDate: "",
    weddingDate: "",
    time: "",
    duration: "",
    location: "",
    mainPhotographer: "",
    assistantPhotographer: "",
    makeupArtist: "",
    package: "",
    notes: "",
  });

  const getStatusConfig = (status: AppointmentStatus) => {
    switch (status) {
      case "staff_assignment":
        return {
          label: "Xếp nhân sự",
          color: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Users,
          description: "Đang xếp nhân sự và thiết bị cho buổi chụp",
        };
      case "waiting_confirmation":
        return {
          label: "Chờ xác nhận",
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Clock,
          description: "Chờ khách hàng xác nhận lịch chụp",
        };
      case "confirmed":
        return {
          label: "Đã xác nhận",
          color: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle,
          description: "Khách hàng đã xác nhận, sẵn sàng chụp",
        };
      case "shooting":
        return {
          label: "Đang chụp",
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Camera,
          description: "Đang trong quá trình chụp ảnh",
        };
      case "completed":
        return {
          label: "Hoàn thành",
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          description: "Đã hoàn thành buổi chụp",
        };
      default:
        return {
          label: "Không xác định",
          color: "bg-slate-100 text-slate-800 border-slate-200",
          icon: AlertTriangle,
          description: "Trạng thái không xác định",
        };
    }
  };

  const normalize = (s?: string) =>
    (s ?? "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""); // bỏ dấu (vi)

  // Filter appointments based on selected filter type
  const getFilteredAppointments = () => {
    const hasStart = startDate !== "";
    const hasEnd = endDate !== "";

    // nếu không chọn ngày nào -> hiển thị tất cả (vẫn có thể lọc theo search bên dưới)
    const start = hasStart
      ? dayjs(startDate).startOf("day")
      : dayjs("1970-01-01").startOf("day");
    const end = hasEnd ? dayjs(endDate).endOf("day") : dayjs();

    // 1) Lọc theo ngày
    const byDate = appointments.filter((appointment: Appointment) => {
      const d = dayjs(appointment.date);
      return d.valueOf() >= start.valueOf() && d.valueOf() <= end.valueOf();
    });

    // 2) Nếu không nhập search -> trả về theo ngày
    const qRaw = searchTerm.trim();
    if (!qRaw) return byDate;

    // 3) Lọc theo từ khóa (tên/email/điện thoại)
    const q = normalize(qRaw);

    return byDate.filter((a: Appointment) => {
      // gom các field text để tìm theo từ khóa (không phân biệt dấu)
      const textFields = [a.couple, a.contractNumber].filter(
        Boolean
      ) as string[];

      const textMatch = textFields
        .map((t) => normalize(t))
        .some((t) => t.includes(q));

      // so khớp theo chữ số của phone (bỏ dấu cách, dấu chấm, +84,...)

      return textMatch;
    });
  };

  const filteredAppointments = getFilteredAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getAvailableTransitions = (
    currentStatus: AppointmentStatus
  ): AppointmentStatus[] => {
    switch (currentStatus) {
      case "staff_assignment":
        return ["waiting_confirmation"];
      case "waiting_confirmation":
        return ["confirmed"];
      case "confirmed":
        // Auto transition to shooting on shoot date will be handled by system
        return ["shooting"]; // Manual override if needed
      case "shooting":
        return ["completed"];
      case "completed":
        return []; // Final state
      default:
        return [];
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // const openDetailModal = (appointment: Appointment) => {
  //   setSelectedAppointment(appointment);
  //   setIsDetailModalOpen(true);
  // };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAppointment(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setNewAppointment({
      couple: "",
      phone: "",
      email: "",
      bookDate: "",
      shootDate: "",
      weddingDate: "",
      time: "",
      duration: "",
      location: "",
      mainPhotographer: "",
      assistantPhotographer: "",
      makeupArtist: "",
      package: "",
      notes: "",
    });
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusChange = (
    appointment: Appointment,
    newStatus: AppointmentStatus
  ) => {
    setSelectedAppointmentForStatus(appointment);
    setTargetStatus(newStatus);
    setIsStatusChangeOpen(true);
  };

  const handleCreateAppointment = () => {
    // Logic tạo lịch hẹn mới
    console.log("Creating appointment:", newAppointment);
    closeCreateModal();
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Quản lý lịch hẹn
          </h1>
          <p className="text-slate-600 mt-1">
            Theo dõi và quản lý lịch chụp ảnh của khách hàng
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 group text-sm md:text-base cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tạo lịch hẹn mới
        </button>
      </div>

      <div className="grid mobile-grid gap-4">
        <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-amber-200/30 touch-manipulation">
          <div className="px-6 [&:last-child]:pb-6 mobile-card">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    appointments.filter((a) => a.status === "staff_assignment")
                      .length
                  }
                </p>
                <p className="text-sm text-slate-600">Xếp nhân sự</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-amber-200/30 touch-manipulation">
          <div className="px-6 [&:last-child]:pb-6 mobile-card">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {
                    appointments.filter(
                      (a) => a.status === "waiting_confirmation"
                    ).length
                  }
                </p>
                <p className="text-sm text-slate-600">Chờ xác nhận</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-amber-200/30 touch-manipulation">
          <div className="px-6 [&:last-child]:pb-6 mobile-card">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {appointments.filter((a) => a.status === "confirmed").length}
                </p>
                <p className="text-sm text-slate-600">Đã xác nhận</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-purple-200/30 touch-manipulation">
          <div className="px-6 [&:last-child]:pb-6 mobile-card">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {appointments.filter((a) => a.status === "shooting").length}
                </p>
                <p className="text-sm text-slate-600">Đang chụp</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl hover:bg-white/90">
        <div></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-2 min-w-[150px]">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94a3b8] group-focus:text-black" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, số điện thoại..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 px-10 py-5.5 text-md placeholder:text-[#94a3b8] outline-none bg-transparent hover:border-slate-400 focus:border-slate-400 transition-colors"
            />
          </div>

          {/* Date Filtered */}
          <div className="relative flex-1">
            <DatePicker.RangePicker
              value={
                startDate && endDate
                  ? [dayjs(startDate), dayjs(endDate)]
                  : undefined
              }
              onChange={(dates) => {
                if (dates) {
                  setStartDate(dates[0]?.format("YYYY-MM-DD") || "");
                  setEndDate(dates[1]?.format("YYYY-MM-DD") || "");
                } else {
                  setStartDate("");
                  setEndDate("");
                }
              }}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
              allowEmpty={[true, true]}
              classNames={{
                popup: {
                  root: [
                    "!bg-white !text-slate-800 [&_.ant-picker-panel]:!bg-white",
                    "[&_.ant-picker-header]:!border-b-slate-200",
                    "[&_.ant-picker-header button]:!text-slate-700",
                    "[&_.ant-picker-content>thead>tr>th]:!text-slate-500",
                    "[&_.ant-picker-cell]:!text-slate-700",
                    "[&_.ant-picker-cell-in-view_.ant-picker-cell-inner]:!text-slate-900",
                    "[&_.ant-picker-cell:hover_.ant-picker-cell-inner]:!bg-slate-100",
                    "[&_.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-slate-200",
                    "[&_.ant-picker-cell-in-range_.ant-picker-cell-inner]:!bg-slate-100",

                    // DARK
                    "dark:!bg-slate-900 dark:!text-slate-100 dark:[&_.ant-picker-panel]:!bg-slate-900",
                    "dark:[&_.ant-picker-header]:!border-b-slate-700",
                    "dark:[&_.ant-picker-header_button]:!text-slate-100",
                    "dark:[&_.ant-picker-content>thead>tr>th]:!text-slate-300",
                    "dark:[&_.ant-picker-cell]:!text-slate-200",
                    "dark:[&_.ant-picker-cell:hover_.ant-picker-cell-inner]:!bg-slate-700",
                    "dark:[&_.ant-picker-cell-selected_.ant-picker-cell-inner]:!bg-slate-700",
                    "dark:[&_.ant-picker-cell-in-range_.ant-picker-cell-inner]:!bg-slate-800",
                  ].join(" "),
                },
              }}
              className={[
                // LIGHT
                "w-full",
                "[&.ant-picker]:!bg-white [&.ant-picker]:!py-2.5",
                "[&.ant-picker]:!border-slate-300 hover:[&.ant-picker]:!border-slate-400",
                "[&_.ant-picker-input>input]:!bg-transparent",
                "[&_.ant-picker-input>input]:!text-slate-900",
                "[&_.ant-picker-input>input::placeholder]:!text-slate-400",
                "[&_.ant-picker-separator]:!text-slate-400",
                "[&_.ant-picker-suffix]:!text-slate-500",
                "[&.ant-picker-focused]:!border-sky-300",
                "[&.ant-picker-focused]:!shadow-[0_0_0_2px_rgba(56,189,248,0.30)]",

                // DARK
                "dark:[&.ant-picker]:!bg-slate-900",
                "dark:[&.ant-picker]:!border-slate-700 dark:hover:[&.ant-picker]:!border-slate-500",
                "dark:[&_.ant-picker-input>input]:!text-white",
                "dark:[&_.ant-picker-input>input::placeholder]:!text-slate-400",
                "dark:[&_.ant-picker-separator]:!text-slate-400",
                "dark:[&_.ant-picker-suffix]:!text-slate-400",
                "dark:[&.ant-picker-focused]:!border-teal-400",
                "dark:[&.ant-picker-focused]:!shadow-[0_0_0_2px_rgba(13,148,136,0.30)]",
              ].join(" ")}
            />
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            getStatusConfig={getStatusConfig}
            getAvailableTransitions={getAvailableTransitions}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-lg p-12 text-center transition-all duration-200 hover:shadow-xl hover:bg-white/90">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            Không có lịch hẹn
          </h3>
          <p className="text-slate-500">
            Chưa có lịch hẹn nào cho thời gian này
          </p>
        </div>
      )}

      {/* Create Appointment Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Tạo lịch hẹn mới
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Vui lòng điền đầy đủ thông tin để tạo lịch hẹn mới.
                  </p>
                </div>
                <button
                  onClick={closeCreateModal}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Đóng modal tạo lịch hẹn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tên cặp đôi
                  </label>
                  <input
                    type="text"
                    placeholder="VD: Minh Anh & Tuấn Khang"
                    value={newAppointment.couple}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        couple: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    placeholder="0901234567"
                    value={newAppointment.phone}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="couple@email.com"
                  value={newAppointment.email}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày book
                  </label>
                  <input
                    type="date"
                    value={newAppointment.bookDate}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        bookDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Nhập ngày book"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày chụp
                  </label>
                  <input
                    type="date"
                    value={newAppointment.shootDate}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        shootDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn ngày chụp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ngày cưới (deadline)
                  </label>
                  <input
                    type="date"
                    value={newAppointment.weddingDate}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        weddingDate: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn ngày chụp"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Giờ bắt đầu
                  </label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        time: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn giờ bất đầu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Thời gian chụp
                  </label>
                  <select
                    value={newAppointment.duration}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn thời gian chụp"
                  >
                    <option value="">Chọn thời gian</option>
                    <option value="2 giờ">2 giờ</option>
                    <option value="3 giờ">3 giờ</option>
                    <option value="4 giờ">4 giờ</option>
                    <option value="5 giờ">5 giờ</option>
                    <option value="6 giờ">6 giờ</option>
                    <option value="8 giờ">8 giờ</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Địa điểm
                  </label>
                  <select
                    value={newAppointment.location}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn địa điểm chụp"
                  >
                    <option value="">Chọn địa điểm</option>
                    {locations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Chụp chính
                  </label>
                  <select
                    value={newAppointment.mainPhotographer}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        mainPhotographer: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn thợ chụp"
                  >
                    <option value="">Chọn photographer chính</option>
                    {photographers.map((photographer) => (
                      <option key={photographer} value={photographer}>
                        {photographer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Chụp phụ
                  </label>
                  <select
                    value={newAppointment.assistantPhotographer}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        assistantPhotographer: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn thợ chụp phụ"
                  >
                    <option value="">Chọn photographer phụ</option>
                    <option value="none">Không có</option>
                    {photographers.map((photographer) => (
                      <option key={photographer} value={photographer}>
                        {photographer}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Makeup Artist
                  </label>
                  <select
                    value={newAppointment.makeupArtist}
                    onChange={(e) =>
                      setNewAppointment((prev) => ({
                        ...prev,
                        makeupArtist: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    title="Chọn người makeup"
                  >
                    <option value="">Chọn makeup artist</option>
                    <option value="none">Không có</option>
                    {makeupArtists.map((artist) => (
                      <option key={artist} value={artist}>
                        {artist}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Gói dịch vụ
                </label>
                <select
                  value={newAppointment.package}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      package: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  title="Chọn gói dịch vụ"
                >
                  <option value="">Chọn gói dịch vụ</option>
                  {packages.map((pkg) => (
                    <option key={pkg} value={pkg}>
                      {pkg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={3}
                  placeholder="Ghi chú về yêu cầu đặc biệt, concept chụp..."
                  value={newAppointment.notes}
                  onChange={(e) =>
                    setNewAppointment((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 p-6 border-t border-slate-200">
              <button
                onClick={closeCreateModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAppointment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tạo lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {/* {isDetailModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto mx-4 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Chi tiết lịch hẹn
                    </h2>
                    <p className="text-slate-600">
                      {selectedAppointment.couple}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(
                      selectedAppointment.status
                    )}`}
                  >
                    {getStatusText(selectedAppointment.status)}
                  </span>
                  <button
                    title="Đóng cửa sổ chi tiết"
                    onClick={closeDetailModal}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-slate-900">
                      Tên cặp đôi
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-slate-800">
                    {selectedAppointment.couple}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Camera className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-slate-900">
                      Gói dịch vụ
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-slate-800">
                    {selectedAppointment.package}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Timeline dự án
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-slate-900">Ngày book</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatDate(selectedAppointment.bookDate)}
                    </p>
                    <p className="text-sm text-slate-500">Ngày đặt lịch</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-slate-900">Ngày chụp</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatDate(selectedAppointment.shootDate)}
                    </p>
                    <p className="text-sm text-slate-500">Ngày thực hiện</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      <h4 className="font-medium text-slate-900">Ngày cưới</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {formatDate(selectedAppointment.weddingDate)}
                    </p>
                    <p className="text-sm text-slate-500">Deadline</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-purple-600" />
                  Thông tin buổi chụp
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Thời gian & Địa điểm
                    </h4>
                    <div className="space-y-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Giờ bắt đầu</p>
                          <p className="font-medium">
                            {selectedAppointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">
                            Thời gian chụp
                          </p>
                          <p className="font-medium">
                            {selectedAppointment.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Địa điểm</p>
                          <p className="font-medium">
                            {selectedAppointment.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-green-600" />
                      Thông tin liên hệ
                    </h4>
                    <div className="space-y-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Điện thoại</p>
                          <p className="font-medium">
                            {selectedAppointment.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-500" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="font-medium">
                            {selectedAppointment.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Đội ngũ thực hiện
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-slate-900">Chụp chính</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {selectedAppointment.mainPhotographer}
                    </p>
                    <p className="text-sm text-slate-500">Photographer chính</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Camera className="w-4 h-4 text-gray-600" />
                      <h4 className="font-medium text-slate-900">Chụp phụ</h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {selectedAppointment.assistantPhotographer || "Không có"}
                    </p>
                    <p className="text-sm text-slate-500">Photographer phụ</p>
                  </div>
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      <h4 className="font-medium text-slate-900">
                        Makeup Artist
                      </h4>
                    </div>
                    <p className="text-lg font-semibold text-slate-800">
                      {selectedAppointment.makeupArtist || "Không có"}
                    </p>
                    <p className="text-sm text-slate-500">Makeup Artist</p>
                  </div>
                </div>
              </div>

              {selectedAppointment.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-amber-600" />
                    Ghi chú đặc biệt
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Edit className="w-4 h-4 text-amber-600" />
                      <h4 className="font-medium text-slate-900">
                        Yêu cầu & Ghi chú
                      </h4>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 p-6 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => {
                  console.log("Edit appointment:", selectedAppointment.id);
                  closeDetailModal();
                }}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  console.log("Confirm appointment:", selectedAppointment.id);
                  closeDetailModal();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Xác nhận lịch hẹn
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
