// EditCustomerDialog.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, User, Phone, Mail, MapPin, X } from "lucide-react";
import { getStatusInfo } from "../../utils/helper";
import type { Customer } from "@/types";
import CustomSelect from "@/components/CustomSelect";

interface EditCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onSave: (updatedCustomer: Customer) => void;
  statusOptions: Array<{ id: string; label: string; color: string }>;
}
const customerSources = [
  { value: "", label: "Chọn nguồn khách hàng" },
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Website", label: "Website" },
  { value: "Google", label: "Google" },
  { value: "Zalo", label: "Zalo" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
  { value: "Referral", label: "Giới thiệu" },
  { value: "Event", label: "Sự kiện" },
  { value: "Walk-in", label: "Walk-in" },
  { value: "Phone", label: "Điện thoại" },
  { value: "Other", label: "Khác" },
];

export function EditCustomerDialog({
  customer,
  onClose,
  onSave,
  statusOptions,
}: EditCustomerDialogProps) {
  const [formData, setFormData] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const nameInputRef = useRef<HTMLInputElement | null>(null);

  // Init form + open animation
  useEffect(() => {
    if (customer) {
      setFormData({ ...customer });
      setIsVisible(true);
      // focus vào ô tên
      setTimeout(() => nameInputRef.current?.focus(), 60);
    }
  }, [customer]);

  // Đóng bằng phím Escape
  useEffect(() => {
    if (!isVisible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeWithAnimation();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible]);

  const handleInputChange = useCallback(
    (field: keyof Customer, value: string) => {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    []
  );

  const closeWithAnimation = useCallback(() => {
    setIsVisible(false);
    // đợi animation rồi mới thật sự onClose để không bị unmount sớm
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  const handleSave = useCallback(async () => {
    if (!formData) return;
    setIsSaving(true);
    try {
      const updatedCustomer: Customer = {
        ...formData,
        lastContact: new Date().toISOString().split("T")[0],
      };
      onSave(updatedCustomer);
      closeWithAnimation();
    } catch (e) {
      console.error("Error saving customer:", e);
    } finally {
      setIsSaving(false);
    }
  }, [formData, onSave, closeWithAnimation]);

  // Options cho CustomSelect (useMemo để tránh re-render không cần thiết)
  const statusSelectOptions = useMemo(
    () => statusOptions.map(({ id, label }) => ({ value: id, label })),
    [statusOptions]
  );

  if (!customer || !formData) return null;

  const statusInfo = getStatusInfo(formData.status);

  const disableSave = isSaving || !formData.name.trim();

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeWithAnimation}
          />

          {/* Dialog Wrapper */}
          <motion.div
            className="relative inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dialog Card */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-customer-title"
              className="relative max-w-2xl w-[95vw] bg-white rounded-2xl shadow-xl flex flex-col p-4 sm:p-6 lg:p-8 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 22 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.98,
                transition: { duration: 0.15 },
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                  </div>
                  <div>
                    <h2
                      id="edit-customer-title"
                      className="text-lg sm:text-xl font-semibold text-gray-900"
                    >
                      Chỉnh sửa khách hàng
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Cập nhật thông tin chi tiết của khách hàng {formData.name}
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  type="button"
                  onClick={closeWithAnimation}
                  className="p-2 rounded-lg hover:bg-gray-50 transition-colors outline-none focus:ring-2 focus:ring-blue-200"
                  aria-label="Đóng"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex justify-end pt-3">
                <span
                  className={`px-2 sm:px-3 py-1 text-xs rounded-full font-medium ${statusInfo.color}`}
                >
                  {statusInfo.label}
                </span>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 px-1 sm:px-2 overscroll-contain">
                <div className="space-y-6 sm:space-y-8 py-4 sm:py-2">
                  {/* Basic Information */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <User className="w-4 h-4 text-gray-600" />
                      <h3 className="font-medium text-gray-900">
                        Thông tin cơ bản
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium text-gray-700"
                        >
                          Tên khách hàng <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          ref={nameInputRef}
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="Nhập tên khách hàng"
                          required
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Phone className="w-3 h-3" />
                          Số điện thoại
                        </label>
                        <input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="0xxx xxx xxx"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full h-10 rounded-md border border-gray-200 px-3 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Address */}
                  <section className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <h3 className="font-medium text-gray-900">
                        Địa chỉ liên hệ
                      </h3>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className="w-full min-h-[100px] rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
                        placeholder="Nhập địa chỉ đầy đủ của khách hàng..."
                      />
                    </div>
                  </section>

                  {/* CRM Info */}
                  <section className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Status */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Trạng thái
                        </label>
                        <CustomSelect
                          options={statusSelectOptions}
                          value={formData.status}
                          onChange={(val) => handleInputChange("status", val)}
                          placeholder="Chọn trạng thái"
                        />
                      </div>

                      {/* Source */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Nguồn khách hàng
                        </label>
                        <CustomSelect
                          options={customerSources}
                          value={formData.source}
                          onChange={(val) => handleInputChange("source", val)}
                          placeholder="Chọn nguồn"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Contract info (optional) */}
                  {formData.contractValue && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-emerald-100">
                        <div className="w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-sm flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <h3 className="font-medium text-emerald-800">
                          Thông tin hợp đồng
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                        <div className="space-y-2">
                          <label
                            htmlFor="contractValue"
                            className="text-sm font-medium text-emerald-700"
                          >
                            Giá trị hợp đồng (VNĐ)
                          </label>
                          <input
                            id="contractValue"
                            type="text"
                            value={formData.contractValue || ""}
                            onChange={(e) =>
                              handleInputChange("contractValue", e.target.value)
                            }
                            className="w-full h-10 rounded-md border border-emerald-200 px-3 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 outline-none bg-white"
                            placeholder="0"
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="contractDate"
                            className="text-sm font-medium text-emerald-700"
                          >
                            Ngày ký hợp đồng
                          </label>
                          <input
                            id="contractDate"
                            type="date"
                            value={formData.contractDate || ""}
                            onChange={(e) =>
                              handleInputChange("contractDate", e.target.value)
                            }
                            className="w-full h-10 rounded-md border border-emerald-200 px-3 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-200 outline-none bg-white"
                          />
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Extra space on mobile */}
                  <div className="h-4 sm:h-0" />
                </div>
              </div>

              {/* Footer actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4 mt-2 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="button"
                  onClick={closeWithAnimation}
                  disabled={isSaving}
                  className="flex-1 h-10 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Hủy bỏ
                </button>

                <motion.button
                  type="button"
                  onClick={handleSave}
                  disabled={disableSave}
                  className="flex-1 h-10 rounded-md border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:bg-blue-100 hover:shadow-md active:bg-blue-200 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                >
                  {isSaving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-blue-300/30 border-t-blue-700 rounded-full animate-spin" />
                      <span className="hidden sm:inline">Đang lưu...</span>
                      <span className="sm:hidden">Lưu...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Save className="w-4 h-4 text-blue-600" />
                      <span className="hidden sm:inline">Lưu thay đổi</span>
                      <span className="sm:hidden">Lưu</span>
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
