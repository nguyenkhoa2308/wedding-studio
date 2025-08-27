/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Clock,
  Webhook,
  User,
  FileText,
  Brain,
  RefreshCw,
  X,
  MessageSquare,
} from "lucide-react";
import { Customer } from "@/types";
import { getStatusInfo } from "../../utils/helper";

interface CustomerDialogProps {
  customer: Customer | null;
  onClose: () => void;
  onAddNote: (note: { content: string; type: string }) => void;
  onCreateContract?: (customer: Customer) => void;
}

const formatCurrency = (value: string) => {
  const num = parseFloat(value);
  if (isNaN(num)) return value;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

const getNoteTypeIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    note: MessageSquare,
    call: Phone,
    email: Mail,
    meeting: Calendar,
  };
  return iconMap[type] || MessageSquare;
};

export default function CustomerDialog({
  customer,
  onClose,
  onAddNote,
  onCreateContract,
}: CustomerDialogProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [notesSummary, setNotesSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [expandedFields, setExpandedFields] = useState<{
    [key: string]: boolean;
  }>({});
  const [activeTab, setActiveTab] = useState("info");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isNoteDialogVisible, setIsNoteDialogVisible] = useState(false);

  // Animation control
  useEffect(() => {
    if (customer) {
      setIsDialogVisible(true);
    } else {
      setIsDialogVisible(false);
    }
  }, [customer]);

  useEffect(() => {
    if (isNoteDialogOpen) {
      setIsNoteDialogVisible(true);
    } else {
      setIsNoteDialogVisible(false);
    }
  }, [isNoteDialogOpen]);

  // Toggle expanded state for a field (mobile only)
  const toggleFieldExpansion = (fieldKey: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  };

  useEffect(() => {
    if (customer) {
      setNotesSummary(customer.notesSummary || "");
      // Generate summary if customer has notes but no summary yet
      if (customer.notes.length > 0 && !customer.notesSummary) {
        generateNotesSummary();
      }
    }
  }, [customer]);

  const generateNotesSummary = async (notesToSummarize?: any[]) => {
    if (!customer) return;

    // Use provided notes or fallback to customer.notes
    const notes = notesToSummarize || customer.notes;
    if (notes.length === 0) return;

    setIsGeneratingSummary(true);
    try {
      const notesText = notes
        .map(
          (note) =>
            `[${note.type}] ${note.content} - ${note.author} (${note.timestamp})`
        )
        .join("\n");

      console.log(
        `Sending ${notes.length} notes to webhook for customer ${customer.name}:`,
        notes
      );
      console.log("Notes text being sent:", notesText);

      const response = await fetch(
        "https://n8n.phucmeo.id.vn/webhook/summary-note",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId: customer.id,
            customerName: customer.name,
            notes: notesText,
          }),
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          let summary = "Không thể tạo tóm tắt";

          if (
            Array.isArray(data) &&
            data.length > 0 &&
            data[0].output &&
            data[0].output.summary
          ) {
            summary = data[0].output.summary;
          } else if (data.summary) {
            summary = data.summary;
          } else if (data.message) {
            summary = data.message;
          }

          console.log("Received summary from webhook:", summary);
          setNotesSummary(summary);

          if (customer) {
            customer.notesSummary = summary;
          }
        } else {
          console.error(
            "API returned non-JSON response:",
            await response.text()
          );
          setNotesSummary("API endpoint không khả dụng. Vui lòng thử lại sau.");
        }
      } else {
        console.error("API request failed with status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);

        setNotesSummary(`Lỗi API (${response.status}). Vui lòng thử lại sau.`);
      }
    } catch (error) {
      console.error("Error generating notes summary:", error);
      setNotesSummary("Lỗi kết nối. Không thể tạo tóm tắt ghi chú.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleClose = () => {
    setIsDialogVisible(false);
    setTimeout(() => {
      onClose();
    }, 200); // Wait for animation to complete
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const noteData = {
      content: newNote,
      type: "note",
    };

    const newNoteWithTimestamp = {
      id: Date.now(),
      content: noteData.content,
      author: "Current User",
      timestamp: new Date().toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      type: noteData.type,
    };

    const updatedNotes = [...(customer?.notes || []), newNoteWithTimestamp];

    console.log("About to add note:", newNoteWithTimestamp);
    console.log("Updated notes list:", updatedNotes);

    onAddNote(noteData);

    setNewNote("");
    setIsNoteDialogOpen(false);

    console.log(
      "Generating summary with",
      updatedNotes.length,
      "notes including new note"
    );
    generateNotesSummary(updatedNotes);
  };

  const handleNoteDialogClose = () => {
    setIsNoteDialogVisible(false);
    setTimeout(() => {
      setIsNoteDialogOpen(false);
    }, 200);
  };

  if (!customer) return null;

  return (
    <>
      {/* Main Dialog Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isDialogVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      >
        {/* Main Dialog Container */}
        <div
          className={`fixed inset-4 md:inset-8 lg:inset-16 xl:left-1/2 xl:top-1/2 xl:-translate-x-1/2 xl:-translate-y-1/2 xl:w-full xl:max-w-2xl xl:min-h-[60vh] xl:max-h-[85vh] 
            bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${
              isDialogVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center animate-pulse">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {customer.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Thông tin chi tiết và lịch sử tương tác với khách hàng
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Status Badge */}
                <span
                  className={`${
                    getStatusInfo(customer.status).color
                  } text-xs px-2 sm:px-3 py-1 rounded-full font-medium border`}
                >
                  {getStatusInfo(customer.status).label}
                </span>

                {/* Create Contract Button */}
                {onCreateContract && customer.status != "converted" && (
                  <button
                    onClick={() => onCreateContract(customer)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg 
                             hover:bg-emerald-100 active:bg-emerald-200 transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Tạo hợp đồng</span>
                    <span className="sm:hidden">Hợp đồng</span>
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Đóng dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 mt-1">
            <div className="py-4 sm:py-2">
              {/* Tabs Header */}
              <div className="flex bg-gray-100 p-1 rounded-lg mb-4 sm:mb-6">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform ${
                    activeTab === "info"
                      ? "bg-white text-gray-900 shadow-sm scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:scale-105"
                  }`}
                >
                  Thông tin
                </button>
                <button
                  onClick={() => setActiveTab("notes")}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 transform ${
                    activeTab === "notes"
                      ? "bg-white text-gray-900 shadow-sm scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:scale-105"
                  }`}
                >
                  Ghi chú ({customer.notes.length})
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "info" && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-right-2 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Email
                          </div>
                          <div className="text-base text-gray-900">
                            {customer.email ? (
                              <div
                                className="cursor-pointer lg:cursor-default"
                                onClick={() => toggleFieldExpansion("email")}
                                title={customer.email}
                              >
                                <span
                                  className={`${
                                    expandedFields["email"] ? "" : "truncate"
                                  } block lg:truncate`}
                                >
                                  {customer.email}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Số điện thoại
                          </div>
                          <div className="text-base text-gray-900">
                            {customer.phone ? (
                              <span>{customer.phone}</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Địa chỉ
                          </div>
                          <div className="text-base text-gray-900">
                            {customer.address ? (
                              <div
                                className="cursor-pointer lg:cursor-default"
                                onClick={() => toggleFieldExpansion("address")}
                                title={customer.address}
                              >
                                <span
                                  className={`${
                                    expandedFields["address"]
                                      ? ""
                                      : "line-clamp-2"
                                  } lg:line-clamp-2`}
                                >
                                  {customer.address}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <Webhook className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Nguồn khách hàng
                          </div>
                          <div className="text-base text-gray-900">
                            {customer.source ? (
                              <div
                                className="cursor-pointer lg:cursor-default"
                                onClick={() => toggleFieldExpansion("source")}
                                title={customer.source}
                              >
                                <span
                                  className={`${
                                    expandedFields["source"] ? "" : "truncate"
                                  } block lg:truncate`}
                                >
                                  {customer.source}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Người phụ trách
                          </div>
                          <div className="text-base text-gray-900">
                            {customer.assignedTo ? (
                              <div
                                className="cursor-pointer lg:cursor-default"
                                onClick={() =>
                                  toggleFieldExpansion("assignedTo")
                                }
                                title={customer.assignedTo}
                              >
                                <span
                                  className={`${
                                    expandedFields["assignedTo"]
                                      ? ""
                                      : "truncate"
                                  } block lg:truncate`}
                                >
                                  {customer.assignedTo}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Ngày tạo
                          </div>
                          <div className="text-base text-gray-900">
                            {new Date(customer.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors mb-2">
                        <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-500">
                            Liên hệ cuối
                          </div>
                          <div className="text-base text-gray-900">
                            {new Date(customer.lastContact).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                        </div>
                      </div>

                      {customer.contractValue && (
                        <div className="flex items-start gap-3 min-h-[44px] hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors">
                          <FileText className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-gray-500 mb-1">
                              Giá trị hợp đồng
                            </div>
                            <div className="text-sm text-gray-900 font-medium">
                              {formatCurrency(customer.contractValue)}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes Summary Section */}
                  <hr className="border-gray-200" />
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <h4 className="font-medium text-gray-900 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-blue-600" />
                        Tóm tắt ghi chú AI
                      </h4>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 transform transition-all duration-300 hover:scale-[1.01]">
                      {isGeneratingSummary ? (
                        <div className="flex items-center gap-3 text-blue-600">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Đang tạo tóm tắt...</span>
                        </div>
                      ) : notesSummary ? (
                        <div className="text-sm text-blue-900 leading-relaxed">
                          {notesSummary}
                        </div>
                      ) : customer.notes.length === 0 ? (
                        <div className="text-sm text-blue-600 italic">
                          Chưa có ghi chú nào để tóm tắt
                        </div>
                      ) : (
                        <div className="text-sm text-blue-600 italic">
                          Tóm tắt sẽ được tự động tạo khi có ghi chú
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-4 sm:space-y-6 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium text-gray-900">
                      Ghi chú & Lịch sử
                    </h4>
                    <button
                      onClick={() => setIsNoteDialogOpen(true)}
                      className="gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 touch-manipulation inline-flex"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Thêm ghi chú</span>
                      <span className="sm:hidden">Thêm</span>
                    </button>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto space-y-3">
                    {customer.notes.map((note: any, index: number) => {
                      const NoteIcon = getNoteTypeIcon(note.type);
                      return (
                        <div
                          key={note.id}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 hover:shadow-sm transition-all duration-200 
                                   animate-in fade-in-0 slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <NoteIcon className="w-4 h-4 text-gray-500 mt-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 mb-1">
                                {note.content}
                              </p>
                              <div className="text-xs text-gray-500">
                                {note.author} • {note.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {customer.notes.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Chưa có ghi chú nào</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Extra space for mobile */}
              <div className="h-4 sm:h-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Note Dialog */}
      {isNoteDialogOpen && (
        <div
          className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all duration-300 ${
            isNoteDialogVisible
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleNoteDialogClose}
        >
          <div
            className={`fixed inset-4 md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:h-auto md:max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transform transition-all duration-300 ease-out ${
              isNoteDialogVisible
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Note Dialog Header */}
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center animate-pulse">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Thêm ghi chú mới
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Thêm ghi chú hoặc lịch sử tương tác với khách hàng
                  </p>
                </div>
                <button
                  onClick={handleNoteDialogClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110"
                  title="Đóng dialog ghi chú"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Dialog Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Nội dung ghi chú
                </label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Nhập nội dung ghi chú..."
                  className="w-full min-h-[120px] px-3 py-2 border border-gray-200 rounded-lg resize-none 
                           focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 
                           transition-all duration-200 text-sm hover:border-gray-300"
                  maxLength={500}
                />
                <div
                  className={`text-xs transition-colors ${
                    newNote.length > 450 ? "text-orange-500" : "text-gray-500"
                  }`}
                >
                  {newNote.length}/500 ký tự
                </div>
              </div>

              {/* Info */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-gray-600">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="space-y-1 text-xs">
                      <li>
                        • Ghi chú sẽ được lưu vào lịch sử với thời gian hiện tại
                      </li>
                      <li>
                        • Tóm tắt AI sẽ được tự động cập nhật sau khi thêm
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Note Dialog Actions */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleNoteDialogClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg 
                         hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 active:scale-95 touch-manipulation"
              >
                Hủy
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="flex-1 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg 
                         hover:bg-blue-100 active:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                         transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95 touch-manipulation flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Lưu ghi chú</span>
                <span className="sm:hidden">Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
