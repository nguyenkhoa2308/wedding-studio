"use client";

import { Plus, X } from "lucide-react";
import { DatePicker, TimePicker } from "antd";
import dayjs from "dayjs";
import CustomSelect from "@/components/CustomSelect";
import { getStaffByRole } from "@/data/staff";
import { useMemo, useState } from "react";

export type NewAppointmentForm = {
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
  // optional extra raw field for equipment input
  equipment?: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: NewAppointmentForm) => void;
}

export default function CreateAppointmentDialog({ isOpen, onClose, onSubmit }: Props) {
  const photographers = useMemo(() => getStaffByRole("photographer").map((s) => s.name), []);
  const makeupArtists = useMemo(() => getStaffByRole("makeup").map((s) => s.name), []);
  const locations = useMemo(
    () => [
      "Studio A",
      "Studio B",
      "Studio C",
      "Outdoor - Công viên Tao Đàn",
      "Outdoor - Hồ Gươm",
      "Outdoor - Cầu Long Biên",
    ],
    []
  );
  const packages = useMemo(
    () => ["Basic Wedding", "Classic Wedding", "Premium Wedding", "Luxury Wedding"],
    []
  );

  const [form, setForm] = useState<NewAppointmentForm>({
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
    equipment: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!form.couple.trim()) return alert("Vui lòng nhập tên cặp đôi");
    if (!form.shootDate || !form.time) return alert("Vui lòng chọn ngày và giờ chụp");
    onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Tạo lịch hẹn mới</h2>
              <p className="text-slate-600 mt-1">
                Vui lòng điền đầy đủ thông tin để tạo lịch hẹn mới.
              </p>
            </div>
            <button
              onClick={onClose}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên cặp đôi</label>
              <input
                type="text"
                placeholder="VD: Minh Anh & Tuấn Khang"
                value={form.couple}
                onChange={(e) => setForm((prev) => ({ ...prev, couple: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="couple@email.com"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày book</label>
              <DatePicker
                value={form.bookDate ? dayjs(form.bookDate) : undefined}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, bookDate: date ? date.format("YYYY-MM-DD") : "" }))
                }
                format="DD/MM/YYYY"
                className="w-full [&_.ant-picker-input>input]:!bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày chụp</label>
              <DatePicker
                value={form.shootDate ? dayjs(form.shootDate) : undefined}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, shootDate: date ? date.format("YYYY-MM-DD") : "" }))
                }
                format="DD/MM/YYYY"
                className="w-full [&_.ant-picker-input>input]:!bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ngày cưới (deadline)</label>
              <DatePicker
                value={form.weddingDate ? dayjs(form.weddingDate) : undefined}
                onChange={(date) =>
                  setForm((prev) => ({ ...prev, weddingDate: date ? date.format("YYYY-MM-DD") : "" }))
                }
                format="DD/MM/YYYY"
                className="w-full [&_.ant-picker-input>input]:!bg-transparent"
              />
            </div>
          </div>

          {/* Equipment */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Thiết bị (phân tách bởi dấu phẩy)
            </label>
            <input
              placeholder="Camera Canon R5, Lens 85mm, Flash Godox"
              value={form.equipment}
              onChange={(e) => setForm((prev) => ({ ...prev, equipment: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Giờ bắt đầu</label>
              <TimePicker
                value={form.time ? dayjs(form.time, "HH:mm") : undefined}
                onChange={(t) => setForm((prev) => ({ ...prev, time: t ? t.format("HH:mm") : "" }))}
                format="HH:mm"
                className="w-full [&_.ant-picker-input>input]:!bg-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Thời gian chụp</label>
              <CustomSelect
                value={form.duration}
                onChange={(value) => setForm((prev) => ({ ...prev, duration: value }))}
                options={[
                  { value: "", label: "Chọn thời gian" },
                  { value: "2 giờ", label: "2 giờ" },
                  { value: "3 giờ", label: "3 giờ" },
                  { value: "4 giờ", label: "4 giờ" },
                  { value: "5 giờ", label: "5 giờ" },
                  { value: "6 giờ", label: "6 giờ" },
                  { value: "8 giờ", label: "8 giờ" },
                ]}
                placeholder="Chọn thời gian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Địa điểm</label>
              <CustomSelect
                value={form.location}
                onChange={(value) => setForm((prev) => ({ ...prev, location: value }))}
                options={[{ value: "", label: "Chọn địa điểm" }, ...locations.map((l) => ({ value: l, label: l }))]}
                placeholder="Chọn địa điểm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chụp chính</label>
              <CustomSelect
                value={form.mainPhotographer}
                onChange={(value) => setForm((prev) => ({ ...prev, mainPhotographer: value }))}
                options={[{ value: "", label: "Chọn photographer chính" }, ...photographers.map((p) => ({ value: p, label: p }))]}
                placeholder="Chọn photographer chính"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Chụp phụ</label>
              <CustomSelect
                value={form.assistantPhotographer}
                onChange={(value) => setForm((prev) => ({ ...prev, assistantPhotographer: value }))}
                options={[
                  { value: "", label: "Chọn photographer phụ" },
                  { value: "none", label: "Không có" },
                  ...photographers
                    .filter((p) => p !== form.mainPhotographer)
                    .map((p) => ({ value: p, label: p })),
                ]}
                placeholder="Chọn photographer phụ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Makeup Artist</label>
              <CustomSelect
                value={form.makeupArtist}
                onChange={(value) => setForm((prev) => ({ ...prev, makeupArtist: value }))}
                options={[
                  { value: "", label: "Chọn makeup artist" },
                  { value: "none", label: "Không có" },
                  ...makeupArtists.map((artist) => ({ value: artist, label: artist })),
                ]}
                placeholder="Chọn makeup artist"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gói dịch vụ</label>
            <CustomSelect
              value={form.package}
              onChange={(value) => setForm((prev) => ({ ...prev, package: value }))}
              options={[{ value: "", label: "Chọn gói dịch vụ" }, ...packages.map((pkg) => ({ value: pkg, label: pkg }))]}
              placeholder="Chọn gói dịch vụ"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
            <textarea
              rows={3}
              placeholder="Ghi chú về yêu cầu đặc biệt, concept chụp..."
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Tạo lịch hẹn
          </button>
        </div>
      </div>
    </div>
  );
}
