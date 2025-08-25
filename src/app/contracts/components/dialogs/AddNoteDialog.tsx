/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { StickyNote, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

interface AddNoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  onNoteAdded?: (note: any) => void;
}

export default function AddNoteDialog({
  isOpen,
  onClose,
  contract,
  onNoteAdded,
}: AddNoteDialogProps) {
  const [noteContent, setNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ESC để đóng
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
  }, [isOpen, onClose]); // handleClose đã capture onClose + reset

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!noteContent.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new note object (consistent with CRM)
      const newNote = {
        id: Date.now(),
        type: "note", // Default type, consistent with CRM
        content: noteContent.trim(),
        author: "Người dùng", // In real app, get from auth context
        timestamp: new Date().toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        date: new Date().toISOString(),
      };

      // Add note to contract
      //   onNoteAdded(newNote);

      // Show success message
      toast.success("Đã thêm ghi chú thành công");

      // Reset form and close dialog
      setNoteContent("");
      onClose();
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Có lỗi xảy ra khi thêm ghi chú");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setNoteContent("");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 z-50 bg-black/40"
            onClick={handleClose}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Wrapper canh giữa */}
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
              aria-labelledby="add-note-title"
              className="relative max-w-xl w-[95vw] bg-white rounded-2xl shadow-xl flex flex-col p-4 sm:p-6 lg:p-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 260, damping: 20 },
              }}
              exit={{
                opacity: 0,
                y: 10,
                scale: 0.98,
                transition: { duration: 0.15 },
              }}
            >
              {/* Nút đóng góc phải */}
              <button
                type="button"
                aria-label="Đóng"
                onClick={handleClose}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                ✕
              </button>

              {/* Header */}
              <motion.div
                className="mb-3"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
              >
                <div className="flex items-start gap-3">
                  <motion.div
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50"
                    initial={{ scale: 0.9, rotate: -4 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 14,
                      },
                    }}
                  >
                    <StickyNote className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h2
                      id="add-note-title"
                      className="text-slate-800 text-lg font-semibold"
                    >
                      Thêm ghi chú mới
                    </h2>
                    <p className="text-sm text-slate-600 mt-0.5">
                      Thêm ghi chú cho hợp đồng #{contract?.contractNumber} –{" "}
                      {contract?.couple}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.08 } }}
                className="space-y-4"
              >
                {/* Note Content */}
                <div>
                  <label
                    htmlFor="noteContent"
                    className="block text-base font-medium text-slate-700 mb-2"
                  >
                    Nội dung ghi chú *
                  </label>
                  <motion.textarea
                    id="noteContent"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Nhập nội dung ghi chú..."
                    disabled={isSubmitting}
                    className="w-full min-h-[120px] resize-none rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    whileFocus={{
                      boxShadow: "0 0 0 3px rgba(16,185,129,0.25)",
                    }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {noteContent.length}/500 ký tự
                  </div>
                </div>

                {/* Info */}
                <motion.div
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                >
                  <div className="flex items-start gap-2">
                    <StickyNote className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-slate-600">
                      <p className="font-medium mb-1">Lưu ý:</p>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • Ghi chú sẽ được lưu vào lịch sử với thời gian hiện
                          tại
                        </li>
                        <li>
                          • Tóm tắt AI sẽ được tự động cập nhật sau khi thêm
                        </li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Footer */}
              <motion.div
                className="mt-4 flex justify-end gap-3 border-t border-slate-200/60 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.12 } }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100/60 transition"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !noteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition inline-flex items-center"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    <>
                      <StickyNote className="w-4 h-4 mr-2" />
                      Thêm ghi chú
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
