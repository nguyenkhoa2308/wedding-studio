"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Save } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface EditAdditionalServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: {
    id: string;
    name: string;
    price: string;
    description?: string;
  } | null;
  onEdit: (service: {
    id: string;
    name: string;
    price: string;
    description?: string;
  }) => void;
}

export function EditAdditionalServiceDialog({
  open,
  onOpenChange,
  service,
  onEdit,
}: EditAdditionalServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });
  const titleId = "edit-additional-service-title";
  const descId = "edit-additional-service-desc";
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Hydrate form when opening
  useEffect(() => {
    if (service && open) {
      setFormData({
        name: service.name || "",
        price: service.price || "",
        description: service.description || "",
      });
    }
  }, [service, open]);

  // ESC to close + lock body scroll + focus close btn
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onOpenChange]);

  if (!service) return null;

  const handleClose = () => onOpenChange(false);

  const formatPriceInput = (value: string) => {
    // Cho phép dạng đặc biệt như "50% giá gói", "1.000.000/thợ", "200.000/tờ"
    if (/[/%]|gói|thợ|tờ/.test(value)) return value;
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên dịch vụ và giá");
      return;
    }

    const updatedService = {
      id: service.id,
      name: formData.name.trim(),
      price: formData.price.trim(),
      description: formData.description.trim() || undefined,
    };

    onEdit(updatedService);
    toast.success("Đã cập nhật dịch vụ thành công");
    handleClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
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
            {/* Panel content */}
            <div
              className="w-full max-w-xl rounded-2xl bg-white shadow-xl border border-slate-200"
              onClick={(e) => e.stopPropagation()} // chặn propagation
            >
              {/* Header */}
              <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Pencil
                      className="w-5 h-5 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2
                      id={titleId}
                      className="text-lg font-semibold text-slate-900"
                    >
                      Chỉnh sửa dịch vụ
                    </h2>
                    <p id={descId} className="text-sm text-slate-600">
                      Cập nhật thông tin cho dịch vụ &quot;{service.name}&quot;
                    </p>
                  </div>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={handleClose}
                  aria-label="Đóng hộp thoại"
                  title="Đóng"
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Tên dịch vụ *
                  </label>
                  <input
                    id="name"
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
                    htmlFor="price"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Giá dịch vụ *
                  </label>
                  <input
                    id="price"
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
                    htmlFor="description"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mô tả (tùy chọn)
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((s) => ({
                        ...s,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Mô tả chi tiết về dịch vụ..."
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 pt-2">
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
                    <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
