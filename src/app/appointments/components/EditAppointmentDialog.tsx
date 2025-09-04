"use client";

import { Appointment } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { getStaffByRole } from "@/data/staff";
import CustomSelect from "@/components/CustomSelect";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";

interface Props {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onSave: (id: number, updates: Partial<Appointment>) => void;
}

export default function EditAppointmentDialog({
  isOpen,
  appointment,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<Partial<Appointment>>({});
  const photographers = useMemo(
    () => getStaffByRole("photographer").map((s) => s.name),
    []
  );

  useEffect(() => {
    if (appointment) {
      setForm({
        date: appointment.date,
        time: appointment.time,
        location: appointment.location,
        photographer: appointment.photographer,
        assistant: appointment.assistant,
        makeup: appointment.makeup,
        notes: appointment.notes,
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSave = () => {
    onSave(appointment.id, form);
  };

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
          className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl mx-4 overflow-hidden"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Chỉnh sửa lịch hẹn
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-600">Ngày</label>
                <DatePicker
                  value={form.date ? dayjs(form.date) : undefined}
                  onChange={(d) =>
                    setForm((f) => ({
                      ...f,
                      date: d ? d.format("YYYY-MM-DD") : "",
                    }))
                  }
                  format="DD/MM/YYYY"
                  className="w-full [&_.ant-picker-input>input]:!bg-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Giờ</label>
                <TimePicker
                  value={form.time ? dayjs(form.time, "HH:mm") : undefined}
                  onChange={(t) =>
                    setForm((f) => ({ ...f, time: t ? t.format("HH:mm") : "" }))
                  }
                  format="HH:mm"
                  className="w-full [&_.ant-picker-input>input]:!bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Địa điểm</label>
              <input
                value={form.location || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, location: e.target.value }))
                }
                title="Nhập địa điểm"
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-slate-600">Chụp chính</label>
                <CustomSelect
                  value={form.photographer || ""}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, photographer: value }))
                  }
                  options={[
                    { value: "", label: "Chọn photographer" },
                    ...photographers.map((p) => ({ value: p, label: p })),
                  ]}
                  placeholder="Chọn photographer"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Chụp phụ</label>
                <CustomSelect
                  value={form.assistant || ""}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, assistant: value }))
                  }
                  options={[
                    { value: "", label: "Chọn photographer phụ" },
                    { value: "none", label: "Không có" },
                    ...photographers
                      .filter((p) => p !== form.photographer)
                      .map((p) => ({ value: p, label: p })),
                  ]}
                  placeholder="Chọn photographer phụ"
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Makeup</label>
                <CustomSelect
                  value={form.makeup || ""}
                  onChange={(value) =>
                    setForm((f) => ({ ...f, makeup: value }))
                  }
                  options={[
                    { value: "", label: "Chọn makeup" },
                    ...getStaffByRole("makeup")
                      .map((s) => s.name)
                      .map((m) => ({ value: m, label: m })),
                  ]}
                  placeholder="Chọn makeup"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-600">Ghi chú</label>
              <textarea
                value={form.notes || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                title="Nhập ghi chú"
                className="w-full border border-slate-300 rounded-lg px-3 py-2 min-h-[80px]"
              />
            </div>

            <div>
              <label className="text-sm text-slate-600">
                Thiết bị (phân tách bởi dấu phẩy)
              </label>
              <input
                value={form.equipment?.join?.(", ") || ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    equipment: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                title="Nhập thiết bị"
                className="w-full border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Lưu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
