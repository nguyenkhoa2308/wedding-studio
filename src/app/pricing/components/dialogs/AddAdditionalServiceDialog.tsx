"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface AddAdditionalServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (service: {
    id: string;
    name: string;
    price: string;
    description?: string;
  }) => void;
}

export function AddAdditionalServiceDialog({
  open,
  onOpenChange,
  onAdd,
}: AddAdditionalServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const titleId = "add-additional-service-title";
  const descId = "add-additional-service-desc";
  const panelRef = useRef<HTMLDivElement>(null);

  // ESC để đóng
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên dịch vụ và giá");
      return;
    }

    const priceValue = formData.price.trim(); // cho phép "50% giá gói", "1.000.000/thợ", ...
    if (!priceValue) {
      toast.error("Vui lòng nhập giá dịch vụ");
      return;
    }

    const newService = {
      id: `additional-${Date.now()}`,
      name: formData.name.trim(),
      price: priceValue,
      description: formData.description.trim() || undefined,
    };

    onAdd(newService);
    toast.success("Đã thêm dịch vụ mới thành công");
    handleClose();
  };

  const handleClose = () => {
    setFormData({ name: "", price: "", description: "" });
    onOpenChange(false);
  };

  // Format giá — giữ nguyên nếu có ký tự đặc biệt
  const formatPriceInput = (value: string) => {
    if (
      value.includes("%") ||
      value.includes("/") ||
      value.includes("gói") ||
      value.includes("thợ") ||
      value.includes("tờ")
    ) {
      return value;
    }
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[999] bg-black/40"
        aria-hidden="true"
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
      />

      {/* Panel wrapper */}
      <motion.div
        key="panel"
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={handleClose} // click ra ngoài để đóng
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
          transition: { duration: 0.18 },
        }}
      >
        <div className="w-full max-w-xl rounded-xl bg-white shadow-xl border border-slate-200">
          {/* Header */}
          <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-slate-900"
                >
                  Thêm dịch vụ bổ sung
                </h2>
                <p id={descId} className="text-sm text-slate-600">
                  Thêm dịch vụ bổ sung mới vào danh sách
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Đóng hộp thoại"
              title="Đóng"
              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-5">
            <div>
              <label
                htmlFor="aas-name"
                className="block text-sm font-medium text-slate-700"
              >
                Tên dịch vụ *
              </label>
              <input
                id="aas-name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, name: e.target.value }))
                }
                placeholder="Nhập tên dịch vụ bổ sung"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="aas-price"
                className="block text-sm font-medium text-slate-700"
              >
                Giá dịch vụ *
              </label>
              <input
                id="aas-price"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData((s) => ({
                    ...s,
                    price: formatPriceInput(e.target.value),
                  }))
                }
                placeholder="VD: 200.000, 50% giá gói, 1.000.000/thợ"
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Có thể nhập giá cố định hoặc công thức (%, /tờ, /thợ, v.v.)
              </p>
            </div>

            <div>
              <label
                htmlFor="aas-description"
                className="block text-sm font-medium text-slate-700"
              >
                Mô tả (tùy chọn)
              </label>
              <textarea
                id="aas-description"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData((s) => ({ ...s, description: e.target.value }))
                }
                placeholder="Mô tả chi tiết về dịch vụ..."
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Thêm dịch vụ
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
