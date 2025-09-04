"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Eye } from "lucide-react";

export function ViewServiceDialog({
  open,
  onOpenChange,
  service,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
}) {
  if (!open || !service) return null;

  const formatCurrency = (amount: string | number) => {
    const num =
      typeof amount === "string"
        ? parseInt(amount.replace(/\D/g, "") || "0", 10)
        : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(num || 0));
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40"
            onClick={() => onOpenChange(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div
              className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Chi tiết dịch vụ</h2>
                    <p className="text-sm text-slate-600">{service.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Giá</p>
                    <p className="font-semibold text-slate-900">
                      {formatCurrency(service.price)}
                      {service.originalPrice && (
                        <span className="text-sm text-slate-500 line-through ml-2">
                          {formatCurrency(service.originalPrice)}
                        </span>
                      )}
                    </p>
                  </div>
                  {service.duration && (
                    <div>
                      <p className="text-sm text-slate-600">Thời lượng</p>
                      <p className="font-medium text-slate-900">{service.duration}</p>
                    </div>
                  )}
                  {service.location && (
                    <div>
                      <p className="text-sm text-slate-600">Địa điểm</p>
                      <p className="font-medium text-slate-900">{service.location}</p>
                    </div>
                  )}
                </div>

                {service.description && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Mô tả</p>
                    <div className="p-3 border rounded-lg bg-slate-50 text-slate-800 text-sm">
                      {service.description}
                    </div>
                  </div>
                )}

                {!!service.features?.length && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Quyền lợi</p>
                    <div className="space-y-1 text-sm text-slate-800">
                      {service.features.map((f: string, i: number) => (
                        <div key={i}>• {f}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 text-right">
                <button
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

