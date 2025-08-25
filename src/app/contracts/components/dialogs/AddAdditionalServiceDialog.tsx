"use client";

import { useState, useEffect } from "react";
import { Plus, Package, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { Contract } from "@/types";

interface AdditionalService {
  id: number;
  name: string;
  description?: string;
  price: number;
  addedDate: string;
}

interface AddAdditionalServiceDialogProps {
  isOpen: boolean;
  contract: Contract | null;
  onClose: () => void;
  onServiceAdded?: (service: AdditionalService) => void;
}

export function AddAdditionalServiceDialog({
  isOpen,
  contract,
  onClose,
  onServiceAdded,
}: AddAdditionalServiceDialogProps) {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ESC key handler and body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setServiceName("");
      setServiceDescription("");
      setServicePrice("");
    }
  }, [isOpen]);

  const formatCurrency = (amount: string) => {
    const num = amount.replace(/\D/g, "");
    return new Intl.NumberFormat("vi-VN").format(parseInt(num) || 0);
  };

  const handlePriceChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setServicePrice(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceName.trim()) {
      toast.error("Vui lòng nhập tên dịch vụ");
      return;
    }

    if (!servicePrice.trim()) {
      toast.error("Vui lòng nhập giá dịch vụ");
      return;
    }

    setIsLoading(true);

    try {
      const newService: AdditionalService = {
        id: Date.now(),
        name: serviceName.trim(),
        description: serviceDescription.trim() || undefined,
        price: parseInt(servicePrice),
        addedDate: new Date().toISOString().split("T")[0],
      };

      // onServiceAdded?.(newService);

      toast.success("Đã thêm dịch vụ bổ sung thành công", {
        description: `${serviceName} - ${formatCurrency(servicePrice)} VND`,
      });

      onClose();
    } catch (error) {
      console.error("Error adding additional service:", error);
      toast.error("Có lỗi xảy ra khi thêm dịch vụ");
    } finally {
      setIsLoading(false);
    }
  };

  if (!contract) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Animated Backdrop */}
          <motion.div
            className="absolute inset-0 min-h-screen z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => onClose()}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog Container */}
          <motion.div
            className="relative z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Dialog Content */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-service-title"
              className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200/60 flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  duration: 0.4,
                },
              }}
              exit={{
                opacity: 0,
                y: 16,
                scale: 0.96,
                transition: { duration: 0.2 },
              }}
            >
              {/* Close Button */}
              <motion.button
                type="button"
                aria-label="Đóng"
                onClick={onClose}
                className="absolute right-4 top-4 z-10 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Header */}
              <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-start gap-3 pr-10">
                  <div className="p-2 bg-green-100 rounded-xl">
                    <Plus className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2
                      id="add-service-title"
                      className="text-lg font-semibold text-slate-900"
                    >
                      Thêm dịch vụ bổ sung
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                      Thêm dịch vụ bổ sung cho hợp đồng #
                      {contract?.contractNumber || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Service Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="serviceName"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Tên dịch vụ *
                    </label>
                    <input
                      id="serviceName"
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="VD: Chụp thêm 50 ảnh, Makeup cô dâu..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                               bg-white transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Service Price */}
                  <div className="space-y-2">
                    <label
                      htmlFor="servicePrice"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Giá dịch vụ (VND) *
                    </label>
                    <div className="relative">
                      <input
                        id="servicePrice"
                        type="text"
                        value={formatCurrency(servicePrice)}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        placeholder="0"
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 pr-12 text-slate-900 placeholder-slate-400 
                                 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                                 bg-white transition-all duration-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm">
                        VND
                      </div>
                    </div>
                  </div>

                  {/* Service Description */}
                  <div className="space-y-2">
                    <label
                      htmlFor="serviceDescription"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Mô tả dịch vụ
                    </label>
                    <textarea
                      id="serviceDescription"
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Mô tả chi tiết về dịch vụ bổ sung (tùy chọn)..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 placeholder-slate-400 
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 
                               bg-white min-h-[100px] resize-none transition-all duration-200"
                      rows={4}
                    />
                  </div>

                  {/* Contract Info */}
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div>
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        Thông tin hợp đồng
                      </span>
                    </div>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div>
                        Khách hàng:{" "}
                        <span className="font-medium">
                          {contract?.couple || "N/A"}
                        </span>
                      </div>
                      <div>
                        Gói hiện tại:{" "}
                        <span className="font-medium">
                          {contract?.package || "N/A"}
                        </span>
                      </div>
                      <div>
                        Tổng giá trị:{" "}
                        <span className="font-medium">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(contract?.totalAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                <div className="flex justify-end gap-3">
                  <motion.button
                    onClick={onClose}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium
                             hover:bg-white hover:border-slate-400 transition-colors duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Hủy
                  </motion.button>
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium
                             hover:from-green-700 hover:to-emerald-700 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg hover:shadow-xl"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Đang thêm...
                      </motion.div>
                    ) : (
                      "Thêm dịch vụ"
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
