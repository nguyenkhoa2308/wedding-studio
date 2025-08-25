/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { User, X, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface EditCustomerInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  onCustomerInfoUpdated?: (contractId: number, updatedInfo: any) => void;
}

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-left text-slate-900 
                 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className={selectedOption ? "text-slate-900" : "text-slate-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-45 overflow-auto"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                className="w-full px-3 py-2.5 text-left text-slate-900 hover:bg-slate-50 
                         first:rounded-t-lg last:rounded-b-lg transition-colors
                         focus:outline-none focus:bg-slate-50"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const sourceOptions: Option[] = [
  { value: "", label: "Chọn nguồn khách hàng" },
  { value: "Facebook", label: "Facebook" },
  { value: "Google", label: "Google" },
  { value: "Website", label: "Website" },
  { value: "Giới thiệu", label: "Giới thiệu" },
  { value: "Tiktok", label: "Tiktok" },
  { value: "Instagram", label: "Instagram" },
  { value: "Khác", label: "Khác" },
];

const staffOptions: Option[] = [
  { value: "", label: "Chọn nhân viên" },
  { value: "Minh Anh", label: "Minh Anh" },
  { value: "Thủy Tiên", label: "Thủy Tiên" },
  { value: "Phúc Mèo", label: "Phúc Mèo" },
  { value: "Khách hàng tự liên hệ", label: "Khách hàng tự liên hệ" },
];

export function EditCustomerInfoDialog({
  isOpen,
  onClose,
  contract,
  onCustomerInfoUpdated,
}: EditCustomerInfoDialogProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: "",
    assignedTo: "",
    source: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  // Reset form data when dialog opens or contract changes
  useEffect(() => {
    if (isOpen && contract) {
      setFormData({
        customerName: contract.customerName || "",
        customerPhone: contract.customerPhone || "",
        customerEmail: contract.customerEmail || "",
        customerAddress: contract.customerAddress || "",
        assignedTo: contract.assignedTo || "",
        source: contract.source || "",
      });
    }
  }, [isOpen, contract]);

  // ESC + lock scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.customerName.trim()) {
      toast.error("Tên khách hàng không được để trống");
      return;
    }
    if (!formData.customerPhone.trim()) {
      toast.error("Số điện thoại không được để trống");
      return;
    }

    setIsLoading(true);
    try {
      // onCustomerInfoUpdated?.(contract?.id || 0, formData);
      toast.success("Đã cập nhật thông tin khách hàng thành công");
      onClose();
    } catch (error) {
      console.error("Error updating customer info:", error);
      toast.error("Không thể cập nhật thông tin khách hàng");
    } finally {
      setIsLoading(false);
    }
  };

  if (!contract) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-50 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Wrapper center */}
          <motion.div
            className="relative inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dialog container - made wider */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-customer-title"
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 300, damping: 25 },
              }}
              exit={{
                opacity: 0,
                y: 12,
                scale: 0.96,
                transition: { duration: 0.2 },
              }}
            >
              {/* Close button */}
              <button
                type="button"
                aria-label="Đóng"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="px-6 py-5 border border-gray-100">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-pink-100 rounded-xl">
                    <User className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      id="edit-customer-title"
                      className="text-lg font-semibold text-slate-900"
                    >
                      Sửa thông tin khách hàng
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Cập nhật thông tin chi tiết của khách hàng{" "}
                      <span className="font-medium text-slate-700">
                        {contract?.couple || contract?.customerName || ""}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto md:overflow-hidden px-6 py-8">
                <div className="space-y-5">
                  {/* Section title */}
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-medium">Thông tin cơ bản</h4>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    {/* Customer Name */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">
                        Tên khách hàng *
                      </label>
                      <input
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                 bg-white transition-colors"
                        value={formData.customerName}
                        onChange={(e) =>
                          handleInputChange("customerName", e.target.value)
                        }
                        placeholder="Nhập tên khách hàng"
                      />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                          Số điện thoại *
                        </label>
                        <input
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                   bg-white transition-colors"
                          value={formData.customerPhone}
                          onChange={(e) =>
                            handleInputChange("customerPhone", e.target.value)
                          }
                          placeholder="0945678901"
                          type="tel"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                          Email
                        </label>
                        <input
                          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                   bg-white transition-colors"
                          value={formData.customerEmail}
                          onChange={(e) =>
                            handleInputChange("customerEmail", e.target.value)
                          }
                          placeholder="hoaian@email.com"
                          type="email"
                        />
                      </div>
                    </div>

                    {/* Source & Staff - Custom Selects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                          Nguồn khách hàng
                        </label>
                        <CustomSelect
                          options={sourceOptions}
                          value={formData.source}
                          onChange={(value) =>
                            handleInputChange("source", value)
                          }
                          placeholder="Chọn nguồn khách hàng"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-sm font-medium text-slate-700">
                          Nhân viên phụ trách
                        </label>
                        <CustomSelect
                          options={staffOptions}
                          value={formData.assignedTo}
                          onChange={(value) =>
                            handleInputChange("assignedTo", value)
                          }
                          placeholder="Chọn nhân viên"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-slate-700">
                        Địa chỉ
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                 bg-white min-h-[80px] resize-none transition-colors"
                        value={formData.customerAddress}
                        onChange={(e) =>
                          handleInputChange("customerAddress", e.target.value)
                        }
                        placeholder="456 Đường Lê Lợi, Quận 3, TP.HCM"
                      />
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                    <p className="text-xs text-blue-700">
                      <strong>Lưu ý:</strong> Thông tin khách hàng được cập nhật
                      sẽ áp dụng cho hợp đồng này. Các trường có dấu (*) là bắt
                      buộc.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium
                             hover:bg-slate-50 transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium
                             hover:bg-blue-700 transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
