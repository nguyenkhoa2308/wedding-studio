"use client";

import { useEffect, useRef } from "react";
import {
  MessageSquare,
  FileText,
  CheckCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface NoteHistoryItem {
  id: number;
  content: string;
  author: string;
  timestamp: string;
  type: "note" | "action" | "contract";
  source: "crm" | "contract";
}

interface NoteLogDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteHistory?: NoteHistoryItem[];
  contractNumber?: string;
  coupleName?: string;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "note":
      return MessageSquare;
    case "action":
      return CheckCircle;
    case "contract":
      return FileText;
    default:
      return MessageSquare;
  }
};

export function NoteLogDialog({
  isOpen,
  onClose,
  noteHistory = [],
  contractNumber,
  coupleName,
}: NoteLogDialogProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // ESC to close + lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // focus close button for accessibility
    closeBtnRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const sortedNotes = [...noteHistory].sort(
    (a, b) =>
      new Date(
        b.timestamp.replace(
          /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/,
          "$1/$2/$3 $4:$5"
        )
      ).getTime() -
      new Date(
        a.timestamp.replace(
          /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})/,
          "$1/$2/$3 $4:$5"
        )
      ).getTime()
  );

  console.log("..", sortedNotes);

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

          {/* Wrapper để canh giữa */}
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
              className="relative max-w-4xl w-[95vw] h-[80vh] bg-white rounded-2xl shadow-xl flex flex-col p-4 sm:p-6 lg:p-8"
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
              <div className="mb-2">
                <h2
                  id="note-log-title"
                  className="flex items-center gap-2 text-slate-800 text-lg font-semibold"
                >
                  <MessageSquare className="w-5 h-5" />
                  Log Ghi chú - {contractNumber}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Lịch sử ghi chú cho hợp đồng:{" "}
                  <span className="font-medium">{coupleName}</span>
                </p>

                {/* Close (X) top-right */}
                <button
                  ref={closeBtnRef}
                  type="button"
                  aria-label="Đóng"
                  onClick={onClose}
                  className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none hover:ring-2 hover:ring-blue-500"
                >
                  ✕
                </button>
              </div>

              {/* Body (scrollable) */}
              <div className="flex-1 overflow-y-auto pr-4">
                {/* Stagger list */}
                <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                  {sortedNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-500 text-base">
                        Chưa có ghi chú nào cho hợp đồng này
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {sortedNotes.map((note) => {
                        const TypeIcon = getTypeIcon(note.type);
                        return (
                          <div
                            key={note.id}
                            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0">
                                <TypeIcon className="w-5 h-5 text-gray-500 mt-0.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-base text-gray-900 mb-1 leading-relaxed">
                                  {note.content}
                                </p>
                                <div className="text-sm text-gray-500">
                                  {note.author} • {note.timestamp}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100/60 transition touch-manipulation"
                >
                  Đóng
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
