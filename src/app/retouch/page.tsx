/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Search,
  Phone,
  Calendar,
  User,
  ExternalLink,
  Edit,
  Trash2,
  MessageSquare,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  X,
  Info,
  Play,
  Send,
  CheckCircle2,
  RefreshCw,
  Camera,
  Palette,
  Circle,
  AlertCircle,
  Mail,
  MapPin,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CustomSelect from "@/components/CustomSelect";

interface RetouchItem {
  id: string;
  contractName: string;
  customerName: string;
  phone: string;
  servicePackage: string;
  deadline: string;
  submissionDate: string;
  assignee: string;
  status:
    | "Chờ khách chọn ảnh"
    | "Đang thực hiện"
    | "Chờ khách duyệt"
    | "Cần chỉnh sửa"
    | "Hoàn thành";
  selectedImageUrl?: string;
  retouchImageUrl?: string;
  location?: string;
  notes: Array<{
    id: string;
    content: string;
    timestamp: string;
    author: string;
  }>;
}

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (inputValue?: string) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  type: "confirm" | "input" | "delete";
  inputPlaceholder?: string;
  inputLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  type,
  inputPlaceholder,
  inputLabel,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleConfirm = () => {
    if (type === "input") {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    setInputValue("");
    onClose();
  };

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`p-6 border-b border-gray-200 ${
              type === "delete"
                ? "bg-gradient-to-r from-red-50 to-orange-50"
                : "bg-gradient-to-r from-white to-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl ${
                  type === "delete"
                    ? "bg-red-100"
                    : type === "input"
                    ? "bg-blue-100"
                    : "bg-orange-100"
                }`}
              >
                {type === "delete" ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : type === "input" ? (
                  <Edit className="w-6 h-6 text-blue-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{message}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {type === "input" && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-800">
                  {inputLabel}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={inputPlaceholder}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      handleConfirm();
                    }
                  }}
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={type === "input" && !inputValue.trim()}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  type === "delete"
                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                } ${
                  type === "input" && !inputValue.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {confirmText}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClose}
                className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-semibold"
              >
                {cancelText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const mockRetouchData: RetouchItem[] = [
  {
    id: "1",
    contractName: "Wedding Minh Anh & Tuấn Khang",
    customerName: "Nguyễn Minh Anh",
    phone: "0901234567",
    servicePackage: "Premium",
    deadline: "2025-01-15",
    submissionDate: "2025-01-10",
    assignee: "Nguyễn Văn A",
    status: "Chờ khách chọn ảnh",
    location: "Landmark 81 & Dinh Độc Lập",
    notes: [
      {
        id: "1",
        content:
          "Khách yêu cầu retouching tự nhiên, không quá đậm. Tập trung vào làm đẹp da và ánh sáng.",
        timestamp: "2025-01-08 10:30",
        author: "Admin",
      },
    ],
  },
  {
    id: "2",
    contractName: "Wedding Ngọc Mai & Hoàng Long",
    customerName: "Trần Ngọc Mai",
    phone: "0987654321",
    servicePackage: "Premium",
    deadline: "2025-01-20",
    submissionDate: "2025-01-12",
    assignee: "Trần Thị B",
    status: "Đang thực hiện",
    location: "Nhà thờ Đức Bà & Công viên 23/9",
    selectedImageUrl: "https://drive.google.com/selected-images-2",
    notes: [
      {
        id: "2",
        content:
          "Đã nhận được 50 ảnh từ khách, bắt đầu retouching. Ưu tiên các ảnh ceremony trước.",
        timestamp: "2025-01-12 14:00",
        author: "Trần Thị B",
      },
    ],
  },
  {
    id: "3",
    contractName: "Pre-wedding Hoàng Nam & Thúy An",
    customerName: "Lê Hoàng Nam",
    phone: "0912345678",
    servicePackage: "Standard",
    deadline: "2025-01-18",
    submissionDate: "2025-01-11",
    assignee: "Lê Văn C",
    status: "Chờ khách duyệt",
    location: "Công viên Tao Đàn",
    selectedImageUrl: "https://drive.google.com/selected-images-3",
    retouchImageUrl: "https://drive.google.com/retouched-images-3",
    notes: [
      {
        id: "4",
        content: "Hoàn thành 30 ảnh đầu tiên, gửi preview cho khách xem.",
        timestamp: "2025-01-13 16:20",
        author: "Lê Văn C",
      },
    ],
  },
  {
    id: "4",
    contractName: "Maternity Thanh Hà",
    customerName: "Nguyễn Thanh Hà",
    phone: "0923456789",
    servicePackage: "Basic",
    deadline: "2025-01-22",
    submissionDate: "2025-01-14",
    assignee: "Nguyễn Văn A",
    status: "Hoàn thành",
    location: "Studio Plannie",
    selectedImageUrl: "https://drive.google.com/selected-images-4",
    retouchImageUrl: "https://drive.google.com/retouched-images-4",
    notes: [
      {
        id: "5",
        content: "Khách hàng rất hài lòng với kết quả. Đã giao đầy đủ 25 ảnh.",
        timestamp: "2025-01-16 11:30",
        author: "Nguyễn Văn A",
      },
    ],
  },
  {
    id: "5",
    contractName: "Family Portrait Kim Chi",
    customerName: "Trần Kim Chi",
    phone: "0934567890",
    servicePackage: "Standard",
    deadline: "2025-01-25",
    submissionDate: "2025-01-15",
    assignee: "Lê Văn C",
    status: "Cần chỉnh sửa",
    location: "Bảo tàng Lịch sử Việt Nam",
    selectedImageUrl: "https://drive.google.com/selected-images-5",
    retouchImageUrl: "https://drive.google.com/retouched-images-5",
    notes: [
      {
        id: "6",
        content:
          "Khách yêu cầu làm trắng răng thêm cho bé và chỉnh màu da sáng hơn một chút.",
        timestamp: "2025-01-16 09:15",
        author: "Khách hàng",
      },
      {
        id: "7",
        content: "Đã ghi nhận feedback, sẽ chỉnh sửa theo yêu cầu.",
        timestamp: "2025-01-16 09:30",
        author: "Lê Văn C",
      },
    ],
  },
];

export default function RetouchPage() {
  const [retouchItems, setRetouchItems] =
    useState<RetouchItem[]>(mockRetouchData);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RetouchItem | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [cardTabs, setCardTabs] = useState<{
    [key: string]: "overview" | "customer" | "notes";
  }>({});

  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    type: "confirm" | "input" | "delete";
    inputPlaceholder?: string;
    inputLabel?: string;
    onConfirm: (inputValue?: string) => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "",
    cancelText: "",
    type: "confirm",
    onConfirm: () => {},
  });

  const filteredItems = retouchItems.filter((item) => {
    return (
      item.contractName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery)
    );
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Chờ khách chọn ảnh":
        return {
          color:
            "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-amber-200",
          icon: Camera,
          iconColor: "text-amber-600",
          bgColor: "bg-amber-50",
        };
      case "Đang thực hiện":
        return {
          color:
            "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200",
          icon: Palette,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "Chờ khách duyệt":
        return {
          color:
            "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200",
          icon: Send,
          iconColor: "text-purple-600",
          bgColor: "bg-purple-50",
        };
      case "Cần chỉnh sửa":
        return {
          color:
            "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200",
          icon: RefreshCw,
          iconColor: "text-orange-600",
          bgColor: "bg-orange-50",
        };
      case "Hoàn thành":
        return {
          color:
            "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200",
          icon: CheckCircle2,
          iconColor: "text-green-600",
          bgColor: "bg-green-50",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: Circle,
          iconColor: "text-gray-600",
          bgColor: "bg-gray-50",
        };
    }
  };

  const showConfirmDialog = (options: Omit<typeof confirmDialog, "isOpen">) => {
    setConfirmDialog({
      ...options,
      isOpen: true,
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const getNextActions = (item: RetouchItem) => {
    switch (item.status) {
      case "Chờ khách chọn ảnh":
        return [
          {
            label: "Bắt đầu thực hiện",
            icon: Play,
            className:
              "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
            action: () => {
              showConfirmDialog({
                title: "Bắt đầu thực hiện retouch",
                message:
                  "Vui lòng nhập link Google Drive chứa ảnh khách đã chọn",
                confirmText: "Bắt đầu thực hiện",
                cancelText: "Hủy",
                type: "input",
                inputLabel: "Link Google Drive ảnh đã chọn",
                inputPlaceholder: "https://drive.google.com/drive/folders/...",
                onConfirm: (imageUrl) => {
                  if (imageUrl) {
                    handleStatusChange(item.id, "Đang thực hiện", {
                      selectedImageUrl: imageUrl,
                    });
                  }
                },
              });
            },
          },
        ];
      case "Đang thực hiện":
        return [
          {
            label: "Gửi duyệt",
            icon: Send,
            className:
              "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
            action: () => {
              showConfirmDialog({
                title: "Gửi duyệt cho khách hàng",
                message: "Vui lòng nhập link Google Drive chứa ảnh đã retouch",
                confirmText: "Gửi duyệt",
                cancelText: "Hủy",
                type: "input",
                inputLabel: "Link Google Drive ảnh retouch",
                inputPlaceholder: "https://drive.google.com/drive/folders/...",
                onConfirm: (imageUrl) => {
                  if (imageUrl) {
                    handleStatusChange(item.id, "Chờ khách duyệt", {
                      retouchImageUrl: imageUrl,
                    });
                  }
                },
              });
            },
          },
        ];
      case "Chờ khách duyệt":
        return [
          {
            label: "Hoàn thành",
            icon: CheckCircle2,
            className:
              "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
            action: () => {
              showConfirmDialog({
                title: "Hoàn thành dự án",
                message:
                  "Xác nhận hoàn thành dự án retouch này? Khách hàng đã chấp nhận kết quả cuối cùng.",
                confirmText: "Hoàn thành",
                cancelText: "Hủy",
                type: "confirm",
                onConfirm: () => {
                  handleStatusChange(item.id, "Hoàn thành");
                },
              });
            },
          },
          {
            label: "Cần chỉnh sửa",
            icon: RefreshCw,
            className:
              "bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
            action: () => {
              showConfirmDialog({
                title: "Yêu cầu chỉnh sửa",
                message: "Ghi chú yêu cầu chỉnh sửa từ khách hàng",
                confirmText: "Xác nhận chỉnh sửa",
                cancelText: "Hủy",
                type: "input",
                inputLabel: "Ghi chú từ khách hàng",
                inputPlaceholder:
                  "VD: Làm trắng răng thêm, chỉnh màu da sáng hơn...",
                onConfirm: (note) => {
                  if (note) {
                    handleAddNote(item.id, note);
                    handleStatusChange(item.id, "Cần chỉnh sửa");
                  }
                },
              });
            },
          },
        ];
      case "Cần chỉnh sửa":
        return [
          {
            label: "Gửi duyệt lại",
            icon: Send,
            className:
              "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200",
            action: () => {
              showConfirmDialog({
                title: "Gửi duyệt lại cho khách hàng",
                message:
                  "Vui lòng nhập link Google Drive chứa ảnh đã chỉnh sửa",
                confirmText: "Gửi duyệt lại",
                cancelText: "Hủy",
                type: "input",
                inputLabel: "Link Google Drive ảnh đã chỉnh sửa",
                inputPlaceholder: "https://drive.google.com/drive/folders/...",
                onConfirm: (imageUrl) => {
                  if (imageUrl) {
                    handleStatusChange(item.id, "Chờ khách duyệt", {
                      retouchImageUrl: imageUrl,
                    });
                  }
                },
              });
            },
          },
        ];
      default:
        return [];
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: RetouchItem["status"],
    data?: any
  ) => {
    setRetouchItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              ...(data && data.selectedImageUrl
                ? { selectedImageUrl: data.selectedImageUrl }
                : {}),
              ...(data && data.retouchImageUrl
                ? { retouchImageUrl: data.retouchImageUrl }
                : {}),
            }
          : item
      )
    );
  };

  const handleAddNote = (id: string, noteContent: string) => {
    setRetouchItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              notes: [
                ...item.notes,
                {
                  id: Date.now().toString(),
                  content: noteContent,
                  timestamp: new Date().toLocaleString("vi-VN"),
                  author: "Admin",
                },
              ],
            }
          : item
      )
    );
  };

  const handleSave = (data: Partial<RetouchItem>) => {
    if (editingItem) {
      setRetouchItems((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...data } : item
        )
      );
    } else {
      const newItem: RetouchItem = {
        id: Date.now().toString(),
        contractName: data.contractName || "",
        customerName: data.customerName || "",
        phone: data.phone || "",
        servicePackage: data.servicePackage || "",
        deadline: data.deadline || "",
        submissionDate: data.submissionDate || "",
        assignee: data.assignee || "",
        status: data.status || "Đang thực hiện",
        location: data.location || "",
        notes: [],
      };
      setRetouchItems((prev) => [...prev, newItem]);
    }
    setShowForm(false);
    setEditingItem(undefined);
  };

  const handleEdit = (item: RetouchItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const item = retouchItems.find((item) => item.id === id);
    if (!item) return;

    showConfirmDialog({
      title: "Xóa dự án retouch",
      message: `Bạn có chắc muốn xóa dự án "${item.contractName}" không? Hành động này không thể hoàn tác.`,
      confirmText: "Xóa dự án",
      cancelText: "Hủy",
      type: "delete",
      onConfirm: () => {
        setRetouchItems((prev) => prev.filter((item) => item.id !== id));
      },
    });
  };

  const setCardTab = (
    cardId: string,
    tab: "overview" | "customer" | "notes"
  ) => {
    setCardTabs((prev) => ({ ...prev, [cardId]: tab }));
  };

  const getCardTab = (cardId: string) => {
    return cardTabs[cardId] || "overview";
  };

  const addNoteToItem = (id: string, note: string) => {
    if (note.trim()) {
      handleAddNote(id, note.trim());
    }
  };

  const getPackageColor = (pkg: string) => {
    switch (pkg) {
      case "basic":
        return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200";
      case "standard":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200";
      case "premium":
        return "bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen pt-12">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Quản lý Retouch
              </h1>
              <p className="text-base text-gray-600 mt-1">
                Theo dõi và quản lý tiến trình retouch ảnh cưới chuyên nghiệp
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl">
                    <Settings className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {retouchItems.length}
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Tổng dự án
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        retouchItems.filter(
                          (item) => item.status === "Đang thực hiện"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Đang thực hiện
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        retouchItems.filter(
                          (item) => item.status === "Hoàn thành"
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">
                      Hoàn thành
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-800">
                      {
                        retouchItems.filter((item) => {
                          const deadline = new Date(item.deadline);
                          const today = new Date();
                          return (
                            deadline < today && item.status !== "Hoàn thành"
                          );
                        }).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 font-medium">Quá hạn</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filter */}
            <div className="mb-8">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hợp đồng, tên khách hoặc số điện thoại..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Content List */}
            <div className="space-y-6">
              {filteredItems.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 text-center py-16 shadow-lg">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Không tìm thấy dự án nào
                  </h3>
                  <p className="text-sm text-gray-600">
                    Thử thay đổi từ khóa tìm kiếm hoặc tạo dự án mới
                  </p>
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const statusConfig = getStatusConfig(item.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.01,
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Card Header */}
                      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-3">
                              <h3 className="text-lg font-bold text-gray-800">
                                {item.contractName}
                              </h3>
                              <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${statusConfig.color}`}
                              >
                                <StatusIcon className="w-4 h-4" />
                                {item.status}
                              </div>
                              <div
                                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${getPackageColor(
                                  item.servicePackage
                                )}`}
                              >
                                {item.servicePackage}
                              </div>
                            </div>

                            {item.location && (
                              <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                {item.location}
                              </p>
                            )}

                            <div className="flex items-center gap-6 text-gray-600">
                              <span className="flex items-center gap-2 text-xs font-medium">
                                <User className="w-4 h-4" />
                                {item.customerName}
                              </span>
                              <span className="flex items-center gap-2 text-xs font-medium">
                                <Phone className="w-4 h-4" />
                                {item.phone}
                              </span>
                              <span className="flex items-center gap-2 text-xs font-medium">
                                <Calendar className="w-4 h-4" />
                                Deadline:{" "}
                                {new Date(item.deadline).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </span>
                              <span className="text-xs font-medium">
                                👨‍💼 {item.assignee}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Action Buttons */}
                            {getNextActions(item).map((action, actionIndex) => {
                              const ActionIcon = action.icon;
                              return (
                                <motion.button
                                  key={actionIndex}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={action.action}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${action.className}`}
                                >
                                  <ActionIcon className="w-4 h-4" />
                                  {action.label}
                                </motion.button>
                              );
                            })}

                            {/* Link Buttons */}
                            {item.selectedImageUrl && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() =>
                                  window.open(item.selectedImageUrl, "_blank")
                                }
                                className="flex items-center gap-2 px-3 py-2 text-xs border border-blue-200 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Ảnh chọn
                              </motion.button>
                            )}
                            {item.retouchImageUrl && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                onClick={() =>
                                  window.open(item.retouchImageUrl, "_blank")
                                }
                                className="flex items-center gap-2 px-3 py-2 text-xs border border-purple-200 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-all duration-200 font-medium"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Ảnh retouch
                              </motion.button>
                            )}

                            {/* Edit/Delete */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleEdit(item)}
                              className="p-2 hover:bg-blue-50 rounded-xl transition-all duration-200 text-blue-600"
                            >
                              <Edit className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDelete(item.id)}
                              className="p-2 hover:bg-red-50 rounded-xl transition-all duration-200 text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex border-b border-gray-200">
                          <button
                            onClick={() => setCardTab(item.id, "overview")}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-200 text-sm font-medium ${
                              getCardTab(item.id) === "overview"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            <Info className="w-4 h-4" />
                            Tổng quan
                          </button>
                          <button
                            onClick={() => setCardTab(item.id, "customer")}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-200 text-sm font-medium ${
                              getCardTab(item.id) === "customer"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            <Users className="w-4 h-4" />
                            Khách hàng
                          </button>
                          <button
                            onClick={() => setCardTab(item.id, "notes")}
                            className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-200 text-sm font-medium ${
                              getCardTab(item.id) === "notes"
                                ? "border-blue-500 text-blue-600 bg-blue-50"
                                : "border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                            }`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            Ghi chú
                            {item.notes.length > 0 && (
                              <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-semibold">
                                {item.notes.length}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Tab Content */}
                      <div className="p-6">
                        <AnimatePresence mode="wait">
                          {getCardTab(item.id) === "overview" && (
                            <motion.div
                              key="overview"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="grid grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                    <span className="text-white text-lg font-bold">
                                      {item.servicePackage.charAt(0)}
                                    </span>
                                  </div>
                                  <p className="text-base font-bold text-gray-800">
                                    {item.servicePackage}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Gói dịch vụ
                                  </p>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                    <Calendar className="w-8 h-8 text-white" />
                                  </div>
                                  <p className="text-base font-bold text-gray-800">
                                    {new Date(
                                      item.submissionDate
                                    ).toLocaleDateString("vi-VN")}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Ngày gửi duyệt
                                  </p>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
                                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                                    <User className="w-8 h-8 text-white" />
                                  </div>
                                  <p className="text-base font-bold text-gray-800">
                                    {item.assignee}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Người thực hiện
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {getCardTab(item.id) === "customer" && (
                            <motion.div
                              key="customer"
                              initial={{ opacity: 0, x: 0 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-6"
                            >
                              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                                <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                  <User className="w-5 h-5" />
                                  Thông tin khách hàng
                                </h4>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <div className="flex items-center gap-3 mb-4">
                                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-sm font-bold">
                                          {item.customerName.charAt(0)}
                                        </span>
                                      </div>
                                      <div>
                                        <p className="text-base font-semibold text-gray-800">
                                          {item.customerName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Khách hàng chính
                                        </p>
                                      </div>
                                    </div>

                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <Phone className="w-4 h-4 text-green-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {item.phone}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Số điện thoại
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <Mail className="w-4 h-4 text-blue-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {item.customerName
                                              .toLowerCase()
                                              .replace(/\s/g, "")}
                                            @email.com
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Email liên hệ
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <h5 className="text-base font-semibold text-gray-800 mb-3">
                                      Chi tiết dự án
                                    </h5>
                                    <div className="space-y-3">
                                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <MapPin className="w-4 h-4 text-red-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {item.location || "Chưa cập nhật"}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Địa điểm chụp
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <Calendar className="w-4 h-4 text-purple-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {new Date(
                                              item.deadline
                                            ).toLocaleDateString("vi-VN")}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Ngày deadline
                                          </p>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                                        <Settings className="w-4 h-4 text-orange-600" />
                                        <div>
                                          <p className="text-sm font-medium text-gray-800">
                                            {item.servicePackage}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            Gói dịch vụ
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {getCardTab(item.id) === "notes" && (
                            <motion.div
                              key="notes"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                              className="space-y-4"
                            >
                              {item.notes.length > 0 ? (
                                <div className="space-y-4 mb-6">
                                  {item.notes.map((note, noteIndex) => (
                                    <motion.div
                                      key={note.id}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: noteIndex * 0.1 }}
                                      className="relative pl-8"
                                    >
                                      <div className="absolute left-0 top-2 w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 shadow-sm">
                                        <p className="text-sm text-gray-800 font-medium mb-2">
                                          {note.content}
                                        </p>
                                        <div className="flex items-center gap-3 text-xs text-gray-600">
                                          <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {note.author}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {note.timestamp}
                                          </span>
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-12">
                                  <div className="w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                  </div>
                                  <h4 className="text-base font-semibold text-gray-800 mb-2">
                                    Chưa có ghi chú
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Thêm ghi chú đầu tiên để theo dõi tiến trình
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <input
                                  type="text"
                                  placeholder="Thêm ghi chú mới vào timeline..."
                                  className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      const target =
                                        e.target as HTMLInputElement;
                                      addNoteToItem(item.id, target.value);
                                      target.value = "";
                                    }
                                  }}
                                />
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    const input = e.currentTarget
                                      .previousElementSibling as HTMLInputElement;
                                    addNoteToItem(item.id, input.value);
                                    input.value = "";
                                  }}
                                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg font-medium"
                                >
                                  <span>Thêm</span>
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowForm(false);
                setEditingItem(undefined);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-white to-gray-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {editingItem
                        ? "Chỉnh sửa dự án Retouch"
                        : "Tạo dự án Retouch mới"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {editingItem
                        ? "Cập nhật thông tin dự án"
                        : "Điền thông tin để tạo dự án mới"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(undefined);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    contractName: formData.get("contractName") as string,
                    customerName: formData.get("customerName") as string,
                    phone: formData.get("phone") as string,
                    servicePackage: formData.get("servicePackage") as string,
                    deadline: formData.get("deadline") as string,
                    submissionDate: formData.get("submissionDate") as string,
                    assignee: formData.get("assignee") as string,
                    location: formData.get("location") as string,
                    status: formData.get("status") as RetouchItem["status"],
                  };
                  handleSave(data);
                }}
                className="p-6 space-y-5"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Tên hợp đồng
                    </label>
                    <input
                      type="text"
                      name="contractName"
                      defaultValue={editingItem?.contractName || ""}
                      placeholder="VD: Wedding John & Jane"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Tên khách hàng
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      defaultValue={editingItem?.customerName || ""}
                      placeholder="Tên người liên hệ chính"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={editingItem?.phone || ""}
                      placeholder="0901234567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Gói dịch vụ
                    </label>
                    <CustomSelect
                      options={[
                        {
                          value: "",
                          label: "Chọn gói dịch vụ",
                        },
                        {
                          value: "Basic",
                          label: "Basic (20 ảnh)",
                        },
                        {
                          value: "Standard",
                          label: "Standard (50 ảnh)",
                        },

                        {
                          value: "Premium",
                          label: "Premium (100+ ảnh)",
                        },
                      ]}
                      value={editingItem?.servicePackage || ""}
                      onChange={(value) =>
                        setEditingItem((prev) =>
                          prev ? { ...prev, servicePackage: value } : undefined
                        )
                      }
                      placeholder="Chọn gói dịch vụ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-800">
                    Địa điểm chụp
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingItem?.location || ""}
                    placeholder="VD: Landmark 81, Nhà thờ Đức Bà, Studio..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Ngày deadline
                    </label>
                    <input
                      type="date"
                      name="deadline"
                      defaultValue={editingItem?.deadline || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Ngày gửi duyệt
                    </label>
                    <input
                      type="date"
                      name="submissionDate"
                      defaultValue={editingItem?.submissionDate || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Người thực hiện
                    </label>
                    <select
                      name="assignee"
                      defaultValue={editingItem?.assignee || ""}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                      required
                    >
                      <option value="">Chọn người thực hiện</option>
                      <option value="Nguyễn Văn A">
                        Nguyễn Văn A (Senior Retoucher)
                      </option>
                      <option value="Trần Thị B">
                        Trần Thị B (Creative Director)
                      </option>
                      <option value="Lê Văn C">Lê Văn C (Lead Editor)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-800">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      defaultValue={editingItem?.status || "Đang thực hiện"}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    >
                      <option value="Chờ khách chọn ảnh">
                        🎯 Chờ khách chọn ảnh
                      </option>
                      <option value="Đang thực hiện">🎨 Đang thực hiện</option>
                      <option value="Chờ khách duyệt">
                        📤 Chờ khách duyệt
                      </option>
                      <option value="Cần chỉnh sửa">🔄 Cần chỉnh sửa</option>
                      <option value="Hoàn thành">✅ Hoàn thành</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg text-sm font-semibold"
                  >
                    {editingItem ? "💾 Cập nhật dự án" : "🚀 Tạo dự án mới"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(undefined);
                    }}
                    className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-semibold"
                  >
                    Hủy
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={hideConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        type={confirmDialog.type}
        inputPlaceholder={confirmDialog.inputPlaceholder}
        inputLabel={confirmDialog.inputLabel}
      />
    </div>
  );
}
