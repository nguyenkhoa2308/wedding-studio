"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Customer } from "@/types";

interface DeleteCustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onDeleteCustomer: (customer: Customer) => void;
}

export function DeleteCustomerDialog({
  customer,
  onClose,
  onDeleteCustomer,
}: DeleteCustomerDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (customer) {
      setIsVisible(true);
    }
  }, [customer]);

  if (!customer) return null;

  const handleDelete = async () => {
    if (!customer || confirmText !== "DELETE") return;
    setIsDeleting(true);
    try {
      onDeleteCustomer(customer);
      handleClose();
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      setConfirmText("");
      onClose();
    }, 200);
  };

  const isConfirmValid = confirmText === "DELETE";

  return (
    <AnimatePresence>
      {/* Overlay */}
      {isVisible && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <motion.div
            className="absolute inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="relative inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Dialog */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="note-log-title"
              className="relative max-w-3xl w-[95vw] max-h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col p-4 sm:p-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
              // hiệu ứng mở/đóng dialog
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
              <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div>
                    <h2
                      id="delete-title"
                      className="text-lg sm:text-xl font-semibold text-gray-900"
                    >
                      Xóa khách hàng
                    </h2>
                    <p className="text-xs sm:text-sm text-red-600 mt-1">
                      Hành động này không thể hoàn tác
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">
                        Bạn có chắc chắn muốn xóa khách hàng này?
                      </h4>
                      <p className="text-sm text-red-700">
                        Khách hàng <strong>{customer.name}</strong> và tất cả dữ
                        liệu liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="confirm-delete"
                    className="text-sm font-medium text-gray-700"
                  >
                    Để xác nhận, vui lòng nhập <strong>DELETE</strong> vào ô bên
                    dưới:
                  </label>
                  <input
                    id="confirm-delete"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="Nhập DELETE để xác nhận"
                    autoComplete="off"
                    className="w-full h-12 px-4 text-base sm:h-10 sm:px-3 sm:text-sm rounded-md border border-red-200 focus:border-red-300 focus:ring-2 focus:ring-red-200 outline-none"
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm text-gray-600">
                    <strong>Thông tin sẽ bị xóa:</strong>
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4 list-none">
                    <li>• Thông tin liên hệ và địa chỉ</li>
                    <li>
                      • Tất cả ghi chú và lịch sử tương tác (
                      {customer.notes?.length || 0} ghi chú)
                    </li>
                    <li>• Dữ liệu nguồn khách hàng và trạng thái</li>
                    {customer.contractValue && (
                      <li>• Thông tin hợp đồng liên quan</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-gray-50/50">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isDeleting}
                  className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Hủy bỏ
                </button>

                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={!isConfirmValid || isDeleting}
                  className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm rounded-md border border-red-200 bg-red-50 text-red-700 shadow-sm hover:bg-red-100 hover:shadow-md active:bg-red-200 transition-all inline-flex items-center justify-center gap-2 disabled:opacity-60"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ y: -1 }}
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-red-300/30 border-top-color border-t-red-700 rounded-full animate-spin" />
                      <span className="hidden sm:inline">Đang xóa...</span>
                      <span className="sm:hidden">Xóa...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span className="hidden sm:inline">Xóa khách hàng</span>
                      <span className="sm:hidden">Xóa</span>
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
