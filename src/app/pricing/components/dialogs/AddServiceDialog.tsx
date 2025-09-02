/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: string;
  onAdd: (service: any) => void;
}

export function AddServiceDialog({
  open,
  onOpenChange,
  onAdd,
}: AddServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
    image: "",
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState("");

  const titleId = "add-service-title";
  const descId = "add-service-desc";
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const formatPriceInput = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
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

    const newService = {
      id: `service-${Date.now()}`,
      name: formData.name.trim(),
      price: priceValue,
      location: formData.location.trim(),
      description: formData.description.trim(),
      image:
        formData.image.trim() ||
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      features: formData.features.filter((f) => f.trim()),
      stats: { active: 0, completed: 0, totalRevenue: 0 },
    };

    onAdd(newService);
    toast.success("Đã thêm dịch vụ mới thành công");
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      price: "",
      location: "",
      description: "",
      image: "",
      features: [],
    });
    setNewFeature("");
    onOpenChange(false);
  };

  const addFeature = () => {
    const f = newFeature.trim();
    if (f && !formData.features.includes(f)) {
      setFormData((s) => ({ ...s, features: [...s.features, f] }));
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setFormData((s) => ({
      ...s,
      features: s.features.filter((_, i) => i !== idx),
    }));
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 z-50 bg-black/40"
          onClick={handleClose}
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        {/* Dialog container - made wider */}
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
            aria-labelledby={titleId}
            aria-describedby={descId}
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
                    Thêm dịch vụ mới
                  </h2>
                  <p id={descId} className="text-sm text-slate-600">
                    Thêm dịch vụ mới vào danh mục
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

            {/* Content */}
            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-6">
              {/* Thông tin cơ bản */}
              <section className="space-y-4">
                <h3 className="font-medium text-slate-900">Thông tin cơ bản</h3>

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
                      setFormData((s) => ({ ...s, location: e.target.value }))
                    }
                    placeholder="VD: Studio, Nội thành"
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </section>

              {/* Mô tả */}
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

              {/* Hình ảnh */}
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

              {/* Tính năng */}
              <section className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Tính năng dịch vụ
                </label>

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
                    title="Thêm"
                    type="button"
                    onClick={addFeature}
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
                  <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                  Thêm dịch vụ
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
