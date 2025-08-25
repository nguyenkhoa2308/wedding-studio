/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Plus, X, Save } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: any;
  onEdit: (service: any) => void;
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
  onEdit,
}: EditServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    duration: "",
    location: "",
    description: "",
    popular: false,
    image: "",
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState("");

  const titleId = "edit-service-title";
  const descId = "edit-service-desc";
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Hydrate when open
  useEffect(() => {
    if (service && open) {
      setFormData({
        name: service.name || "",
        price: formatPriceInput(service.price?.toString() || "0"),
        originalPrice: service.originalPrice
          ? formatPriceInput(service.originalPrice.toString())
          : "",
        duration: service.duration || "",
        location: service.location || "",
        description: service.description || "",
        popular: !!service.popular,
        image: service.image || "",
        features: service.features || [],
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
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatCurrency = (amount: string | number) => {
    const num =
      typeof amount === "string"
        ? parseInt(amount.replace(/\D/g, ""), 10)
        : amount;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(num || 0));
  };

  const addFeature = () => {
    const f = newFeature.trim();
    if (f && !formData.features.includes(f)) {
      setFormData((s) => ({ ...s, features: [...s.features, f] }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((s) => ({
      ...s,
      features: s.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!formData.name.trim() || !formData.price.trim()) {
      toast.error("Vui lòng nhập đầy đủ tên dịch vụ và giá");
      return;
    }
    const priceValue = formData.price.replace(/\D/g, "");
    if (!priceValue || isNaN(Number(priceValue))) {
      toast.error("Vui lòng nhập giá hợp lệ");
      return;
    }

    const updatedService = {
      ...service,
      name: formData.name.trim(),
      price: priceValue,
      originalPrice: formData.originalPrice.replace(/\D/g, "") || null,
      duration: formData.duration.trim(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      popular: formData.popular,
      image: (formData.image || service.image || "").trim(),
      features: formData.features.filter((f) => f.trim()),
    };

    onEdit(updatedService);
    toast.success("Đã cập nhật dịch vụ thành công");
    handleClose();
  };

  const hasStats = !!service.stats;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[100] bg-black/40"
            aria-hidden="true"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
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
              className="w-full max-w-2xl rounded-2xl bg-white shadow-xl border border-slate-200"
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
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="px-5 py-4">
                <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                  {/* Stats */}
                  {hasStats && (
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-medium text-slate-900 mb-3">
                        Thống kê dịch vụ
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">
                            {service.stats.active}
                          </div>
                          <div className="text-xs text-slate-500">Đang làm</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">
                            {service.stats.completed}
                          </div>
                          <div className="text-xs text-slate-500">
                            Hoàn thành
                          </div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-emerald-600">
                            {formatCurrency(service.stats.totalRevenue)}
                          </div>
                          <div className="text-xs text-slate-500">
                            Doanh thu
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Basic Information */}
                  <section className="space-y-4">
                    <h4 className="font-medium text-slate-900">
                      Thông tin cơ bản
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          placeholder="Nhập tên dịch vụ"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Giá dịch vụ (VND) *
                        </label>
                        <input
                          id="price"
                          required
                          inputMode="numeric"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              price: formatPriceInput(e.target.value),
                            }))
                          }
                          placeholder="0"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="originalPrice"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Giá gốc (VND)
                        </label>
                        <input
                          id="originalPrice"
                          inputMode="numeric"
                          value={formData.originalPrice}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              originalPrice: formatPriceInput(e.target.value),
                            }))
                          }
                          placeholder="0"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="duration"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Thời gian thực hiện
                        </label>
                        <input
                          id="duration"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData((s) => ({
                              ...s,
                              duration: e.target.value,
                            }))
                          }
                          placeholder="VD: 1 ngày, 4 tiếng"
                          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="location"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Địa điểm
                      </label>
                      <input
                        id="location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData((s) => ({
                            ...s,
                            location: e.target.value,
                          }))
                        }
                        placeholder="VD: Studio, Nội thành"
                        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </section>

                  {/* Description */}
                  <section>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Mô tả dịch vụ
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
                  </section>

                  {/* Image URL */}
                  <section>
                    <label
                      htmlFor="image"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Hình ảnh (URL)
                    </label>
                    <input
                      id="image"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData((s) => ({ ...s, image: e.target.value }))
                      }
                      placeholder="https://example.com/image.jpg"
                      className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </section>

                  {/* Features */}
                  <section className="space-y-3">
                    <span className="block text-sm font-medium text-slate-700">
                      Tính năng dịch vụ
                    </span>

                    <div className="flex gap-2">
                      <input
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addFeature();
                          }
                        }}
                        placeholder="Nhập tính năng mới..."
                        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Tính năng mới"
                      />
                      <button
                        type="button"
                        onClick={addFeature}
                        title="Thêm"
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>

                    {formData.features.length > 0 && (
                      <div className="space-y-2">
                        {formData.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                          >
                            <span className="text-sm text-slate-900">
                              {feature}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFeature(index)}
                              aria-label={`Xóa tính năng: ${feature}`}
                              title="Xóa tính năng"
                              className="inline-flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  {/* Popular switch */}
                  <section className="flex items-center justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                    <div>
                      <span className="block text-sm font-medium text-slate-900">
                        Đánh dấu phổ biến
                      </span>
                      <p className="text-xs text-slate-500 mt-1">
                        Dịch vụ này sẽ được đánh dấu là “Phổ biến nhất”
                      </p>
                    </div>

                    {/* Custom toggle (checkbox) */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={formData.popular}
                        onChange={(e) =>
                          setFormData((s) => ({
                            ...s,
                            popular: e.target.checked,
                          }))
                        }
                        aria-label="Đánh dấu dịch vụ phổ biến"
                      />
                      <div className="w-11 h-6 bg-slate-300 rounded-full transition peer-checked:bg-blue-600" />
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition peer-checked:translate-x-5" />
                    </label>
                  </section>
                </div>
              </form>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 p-6 pt-4 border border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 px-4 py-2 text-sm hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  onClick={() => handleSubmit()}
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700"
                >
                  <Save className="w-4 h-4 mr-2" aria-hidden="true" />
                  Lưu thay đổi
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
