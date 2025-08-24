"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserCheck,
  Camera,
  CheckCircle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import type { Appointment } from "@/types";

type AppointmentStatus =
  | "staff_assignment"
  | "waiting_confirmation"
  | "confirmed"
  | "shooting"
  | "completed";

type StatusCfg = {
  label: string;
  color: string; // ví dụ: "bg-blue-100 text-blue-700 border-blue-200"
  icon: React.ComponentType<{ className?: string }>;
  description: string;
};

type StatusChangeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  newStatus: AppointmentStatus;
  onConfirm: (payload: {
    status: AppointmentStatus;
    statusData: any;
    timestamp: string;
  }) => void;
  getStatusConfig: (s: AppointmentStatus) => StatusCfg;
};

export default function StatusChangeDialog({
  isOpen,
  onClose,
  appointment,
  newStatus,
  onConfirm,
  getStatusConfig,
}: StatusChangeDialogProps) {
  // không render gì nếu chưa có dữ liệu

  const [formData, setFormData] = useState({
    // Staff assignment data
    photographer: appointment?.photographer || "",
    assistant: appointment?.assistant ? appointment?.assistant : "none",
    makeup: appointment?.makeup ? appointment?.makeup : "none",
    equipment: appointment?.equipment?.join(", ") || "",
    dressCode: appointment?.dressCode || "",
    notes: appointment?.notes || "",

    // Client confirmation data
    clientNotes: "",

    // Shooting completion data
    originalImagesUrl: "",
    shotCount: "",
    shootingNotes: "",
  });

  const titleId = useMemo(() => "status-change-title", []);
  const descId = useMemo(() => "status-change-desc", []);

  // ESC để đóng
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validate theo trạng thái
    if (newStatus === "waiting_confirmation") {
      if (!formData?.photographer) {
        // toast.error("Vui lòng chọn photographer chính");
        return;
      }
    } else if (newStatus === "completed") {
      if (!formData?.originalImagesUrl) {
        // toast.error("Vui lòng điền link folder ảnh gốc");
        return;
      }
    }

    onConfirm({
      status: newStatus,
      statusData: formData,
      timestamp: new Date().toISOString(),
    });
    onClose();
  };

  if (!appointment) return null;

  const statusConfig = getStatusConfig(newStatus);
  const currentStatusConfig = getStatusConfig(appointment.status);

  const renderStatusSpecificFields = () => {
    switch (newStatus) {
      case "waiting_confirmation":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="font-medium text-blue-900">
                  Xếp nhân sự và thiết bị
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                Hoàn tất xếp nhân sự để gửi xác nhận cho khách hàng.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Photographer chính <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.photographer}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      photographer: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="">Chọn photographer...</option>
                  <option value="Nguyễn Văn Photographer">
                    Nguyễn Văn Photographer
                  </option>
                  <option value="Trần Thị Photographer">
                    Trần Thị Photographer
                  </option>
                  <option value="Lê Văn Photographer">
                    Lê Văn Photographer
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Photographer phụ
                </label>
                <select
                  value={formData.assistant}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assistant:
                        e.target.value === "none" ? "" : e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="none">Không có</option>
                  <option value="Trần Thị Assistant">Trần Thị Assistant</option>
                  <option value="Phạm Văn Assistant">Phạm Văn Assistant</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Makeup Artist
              </label>
              <select
                value={formData.makeup}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    makeup: e.target.value === "none" ? "" : e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="none">Không có</option>
                <option value="Lê Thị Makeup">Lê Thị Makeup</option>
                <option value="Nguyễn Thị Makeup">Nguyễn Thị Makeup</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Thiết bị cần chuẩn bị
              </label>
              <input
                placeholder="VD: Camera Canon R5, Lens 85mm, Flash..."
                value={formData.equipment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    equipment: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Dress code
              </label>
              <input
                placeholder="VD: Formal, Casual, Vintage..."
                value={formData.dressCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dressCode: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ghi chú cho team
              </label>
              <textarea
                placeholder="Ghi chú về yêu cầu đặc biệt, concept chụp..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        );

      case "confirmed":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-emerald-600" />
                <h4 className="font-medium text-emerald-900">
                  Xác nhận từ khách hàng
                </h4>
              </div>
              <p className="text-sm text-emerald-700">
                Khách hàng đã xác nhận lịch chụp và sẵn sàng thực hiện.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ghi chú từ khách hàng
              </label>
              <textarea
                placeholder="Ghi chú thêm từ khách hàng (nếu có)..."
                value={formData.clientNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    clientNotes: e.target.value,
                  }))
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        );

      case "shooting":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Camera className="h-4 w-4 text-purple-600" />
                <h4 className="font-medium text-purple-900">
                  Bắt đầu buổi chụp
                </h4>
              </div>
              <p className="text-sm text-purple-700">
                Đánh dấu bắt đầu buổi chụp ảnh.
              </p>
            </div>
          </div>
        );

      case "completed":
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="font-medium text-green-900">
                  Hoàn thành buổi chụp
                </h4>
              </div>
              <p className="text-sm text-green-700">
                Buổi chụp đã hoàn thành. Hợp đồng sẽ tự động chuyển sang trạng
                thái Retouch.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Link folder ảnh gốc <span className="text-red-500">*</span>
              </label>
              <input
                placeholder="https://drive.google.com/drive/folders/..."
                value={formData.originalImagesUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalImagesUrl: e.target.value,
                  }))
                }
                type="url"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Số lượng ảnh chụp
              </label>
              <input
                placeholder="VD: 500"
                value={formData.shotCount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shotCount: e.target.value,
                  }))
                }
                type="number"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Ghi chú buổi chụp
              </label>
              <textarea
                placeholder="Ghi chú về buổi chụp, tình hình thực hiện..."
                value={formData.shootingNotes}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    shootingNotes: e.target.value,
                  }))
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          onClick={onClose} // click nền để đóng
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-[96vw] max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 420,
                damping: 34,
                mass: 0.8,
              },
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.98,
              transition: { duration: 0.1 },
            }}
            onClick={(e) => e.stopPropagation()} // chặn click xuyên panel
          >
            {/* Header */}
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <ArrowRight className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3
                  id={titleId}
                  className="text-base font-semibold text-slate-900"
                >
                  Chuyển trạng thái lịch hẹn
                </h3>
                <p id={descId} className="mt-0.5 text-sm text-slate-600">
                  {currentStatusConfig.label} → {statusConfig.label}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-transparent p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {/* Transition preview */}
            <div className="mb-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${currentStatusConfig.color}`}
                  >
                    {currentStatusConfig.label}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">Hiện tại</p>
                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

                <div className="text-center">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}
                  >
                    {statusConfig.label}
                  </span>
                  <p className="mt-1 text-xs text-slate-500">Chuyển tới</p>
                </div>
              </div>

              <div className="mt-3 text-center">
                <p className="text-sm text-slate-600">
                  {statusConfig.description}
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {renderStatusSpecificFields()}

              {/* Footer */}
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <statusConfig.icon className="mr-2 h-4 w-4" />
                  Chuyển trạng thái
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
