/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface DeleteServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  onDelete: (serviceId: string) => void;
}

export function DeleteServiceDialog({
  open,
  onOpenChange,
  service,
  onDelete,
}: DeleteServiceDialogProps) {
  const titleId = "delete-service-title";
  const descId = "delete-service-desc";
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => onOpenChange(false);

  const handleDelete = () => {
    if (!service) return;
    onDelete(service.id);
    toast.success("Đã xóa dịch vụ thành công");
    handleClose();
  };

  // Khóa scroll + ESC để đóng + focus nút đóng khi mở
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && handleClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const formatCurrency = (amount: string | number) => {
    const num =
      typeof amount === "string"
        ? parseInt(amount.replace(/\D/g, ""), 10)
        : amount;
    if (isNaN(Number(num))) return String(amount);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(num));
  };

  if (!service) return null;

  const hasActiveContracts = service.stats?.active > 0;
  const hasCompletedContracts = service.stats?.completed > 0;

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
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                    <AlertTriangle
                      className="w-5 h-5 text-red-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h2
                      id={titleId}
                      className="text-lg font-semibold text-slate-900"
                    >
                      Xác nhận xóa dịch vụ
                    </h2>
                    <p id={descId} className="text-sm text-slate-600">
                      Bạn có chắc chắn muốn xóa dịch vụ này không?
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
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-4 space-y-4">
                {/* Service Info */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-1">
                    {service.name}
                  </h4>
                  {service.description && (
                    <p className="text-sm text-slate-600 mb-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(service.price)}
                    </span>
                    {service.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatCurrency(service.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Warning based on stats */}
                {(hasActiveContracts || hasCompletedContracts) && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h5 className="font-medium text-red-900 mb-2">
                          Cảnh báo!
                        </h5>
                        <div className="space-y-2 text-sm text-red-800">
                          {hasActiveContracts && (
                            <p>
                              • Dịch vụ này đang có{" "}
                              <strong>
                                {service.stats.active} hợp đồng đang thực hiện
                              </strong>
                            </p>
                          )}
                          {hasCompletedContracts && (
                            <p>
                              • Dịch vụ này đã có{" "}
                              <strong>
                                {service.stats.completed} hợp đồng hoàn thành
                              </strong>
                            </p>
                          )}
                          <p>
                            • Tổng doanh thu:{" "}
                            <strong>
                              {formatCurrency(service.stats?.totalRevenue || 0)}
                            </strong>
                          </p>
                        </div>
                        <p className="text-sm text-red-700 mt-3 font-medium">
                          Việc xóa dịch vụ có thể ảnh hưởng đến dữ liệu báo cáo
                          và lịch sử hợp đồng.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action confirmation */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-900">
                    <strong>Lưu ý:</strong> Hành động này không thể hoàn tác.
                    Dịch vụ sẽ bị xóa vĩnh viễn khỏi hệ thống.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 px-5 pb-5">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  <X className="w-4 h-4 mr-2" aria-hidden="true" />
                  Xóa dịch vụ
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
