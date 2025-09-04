"use client";

import { Appointment } from "@/types";
import {
  Calendar,
  Camera,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onEdit?: (a: Appointment) => void;
}

export default function AppointmentDetailDialog({
  isOpen,
  appointment,
  onClose,
  onEdit,
}: Props) {
  if (!isOpen || !appointment) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <motion.div
          className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl mx-4 overflow-hidden"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Chi tiết lịch hẹn
              </h3>
              <p className="text-slate-600 text-sm">
                #{appointment.contractNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-6">
            {/* Basic info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Ngày giờ chụp</p>
                  <p className="font-medium">
                    {appointment.date} {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Thời lượng</p>
                  <p className="font-medium">
                    {appointment.duration
                      ? typeof appointment.duration === "number"
                        ? `${appointment.duration} giờ`
                        : String(appointment.duration).includes("giờ")
                        ? String(appointment.duration)
                        : `${appointment.duration} giờ`
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Địa điểm</p>
                  <p className="font-medium">{appointment.location ?? "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Camera className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Gói dịch vụ</p>
                  <p className="font-medium">{appointment.package ?? "—"}</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Cặp đôi</p>
                  <p className="font-medium">{appointment.couple}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Điện thoại</p>
                  <p className="font-medium">
                    {appointment.customerPhone ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="font-medium">
                    {appointment.customerEmail ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Team */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoBox
                icon={<Camera className="w-4 h-4 text-blue-600" />}
                title="Chụp chính"
                value={appointment.photographer ?? "—"}
              />
              <InfoBox
                icon={<Camera className="w-4 h-4 text-slate-600" />}
                title="Chụp phụ"
                value={appointment.assistant ?? "—"}
              />
              <InfoBox
                icon={<Users className="w-4 h-4 text-pink-600" />}
                title="Makeup"
                value={appointment.makeup ?? "—"}
              />
            </div>

            {appointment.notes && (
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Ghi chú</h4>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-slate-700">
                  {appointment.notes}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(appointment)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Chỉnh sửa
                </button>
              )}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function InfoBox({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="p-3 border border-slate-200 rounded-lg bg-white">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-sm text-slate-600">{title}</span>
      </div>
      <div className="font-medium text-slate-900">{value}</div>
    </div>
  );
}
