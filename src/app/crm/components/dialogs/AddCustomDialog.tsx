// AddCustomerDialog.tsx
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import CustomSelect from "@/components/CustomSelect";

const prospectingStatuses = [
  { value: "", label: "Chọn trạng thái" },
  {
    value: "interested",
    label: "Quan tâm",
    // color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    value: "potential",
    label: "Tiềm năng",
    // color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    value: "hot",
    label: "Chốt nóng",
    // color: "bg-red-50 text-red-700 border-red-200",
  },
];

// Customer source options
const customerSources = [
  { value: "", label: "Chọn nguồn khách hàng" },
  { value: "Facebook", label: "Facebook" },
  { value: "Instagram", label: "Instagram" },
  { value: "Website", label: "Website" },
  { value: "Google", label: "Google" },
  { value: "Zalo", label: "Zalo" },
  { value: "TikTok", label: "TikTok" },
  { value: "YouTube", label: "YouTube" },
  { value: "Referral", label: "Giới thiệu" },
  { value: "Event", label: "Sự kiện" },
  { value: "Walk-in", label: "Walk-in" },
  { value: "Phone", label: "Điện thoại" },
  { value: "Other", label: "Khác" },
];

interface AddCustomerDialogProps {
  onAddCustomer: (customer: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    source: string;
    status: string;
    note?: string;
  }) => void;
}

export function AddCustomerDialog({ onAddCustomer }: AddCustomerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [newCustomerSource, setNewCustomerSource] = useState("");
  const [newCustomerStatus, setNewCustomerStatus] = useState("");
  const [newCustomerNote, setNewCustomerNote] = useState("");

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    if (!email.trim()) return true; // Email is optional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    if (!phone.trim()) return true; // Phone is optional
    const phoneRegex = /^(0|\+84)[0-9]{8,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  const handleAddCustomer = () => {
    if (!newCustomerName.trim() || !newCustomerSource || !newCustomerStatus) {
      return;
    }

    // Validate email if provided
    if (newCustomerEmail.trim() && !isValidEmail(newCustomerEmail)) {
      return;
    }

    // Validate phone if provided
    if (newCustomerPhone.trim() && !isValidPhone(newCustomerPhone)) {
      return;
    }

    onAddCustomer({
      name: newCustomerName,
      phone: newCustomerPhone.trim() || undefined,
      email: newCustomerEmail.trim() || undefined,
      address: newCustomerAddress.trim() || undefined,
      source: newCustomerSource,
      status: newCustomerStatus,
      note: newCustomerNote.trim() || undefined,
    });

    // Reset form
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
    setNewCustomerAddress("");
    setNewCustomerSource("");
    setNewCustomerStatus("");
    setNewCustomerNote("");
    setIsOpen(false);
  };

  const handleCancel = () => {
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewCustomerEmail("");
    setNewCustomerAddress("");
    setNewCustomerSource("");
    setNewCustomerStatus("");
    setNewCustomerNote("");
    setIsOpen(false);
  };

  const isFormValid = () => {
    return (
      newCustomerName.trim() &&
      newCustomerSource &&
      newCustomerStatus &&
      (!newCustomerEmail.trim() || isValidEmail(newCustomerEmail)) &&
      (!newCustomerPhone.trim() || isValidPhone(newCustomerPhone))
    );
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 transition-all duration-300 hover:bg-blue-700 transform hover:scale-105"
      >
        <UserPlus className="w-4 h-4" />
        Thêm khách hàng
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            <motion.div
              className="absolute inset-0 z-50 bg-black/40"
              onClick={() => handleCancel()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="relative inset-0 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                <div className="flex items-center gap-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">Thêm khách hàng mới</h3>
                </div>

                <p className="mt-2 text-sm text-gray-600">
                  Nhập thông tin chi tiết của khách hàng mới
                </p>

                {/* Form Content */}
                <div className="mt-4">
                  <div className="mb-4">
                    <label
                      htmlFor="customer-name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên khách hàng *
                    </label>
                    <input
                      id="customer-name"
                      value={newCustomerName}
                      onChange={(e) => setNewCustomerName(e.target.value)}
                      placeholder="Nhập tên khách hàng..."
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Phone and Email fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label
                        htmlFor="customer-phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Số điện thoại
                      </label>
                      <input
                        id="customer-phone"
                        value={newCustomerPhone}
                        onChange={(e) => setNewCustomerPhone(e.target.value)}
                        placeholder="0901 234 567"
                        className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          newCustomerPhone.trim() &&
                          !isValidPhone(newCustomerPhone)
                            ? "border-red-300"
                            : ""
                        }`}
                      />
                      {newCustomerPhone.trim() &&
                        !isValidPhone(newCustomerPhone) && (
                          <p className="text-xs text-red-600 mt-1">
                            Số điện thoại không hợp lệ
                          </p>
                        )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="customer-email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        id="customer-email"
                        type="email"
                        value={newCustomerEmail}
                        onChange={(e) => setNewCustomerEmail(e.target.value)}
                        placeholder="example@email.com"
                        className={`mt-1 block w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          newCustomerEmail.trim() &&
                          !isValidEmail(newCustomerEmail)
                            ? "border-red-300"
                            : ""
                        }`}
                      />
                      {newCustomerEmail.trim() &&
                        !isValidEmail(newCustomerEmail) && (
                          <p className="text-xs text-red-600 mt-1">
                            Email không hợp lệ
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-4">
                    <label
                      htmlFor="customer-address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Địa chỉ
                    </label>
                    <input
                      id="customer-address"
                      value={newCustomerAddress}
                      onChange={(e) => setNewCustomerAddress(e.target.value)}
                      placeholder="Nhập địa chỉ khách hàng..."
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Customer Source and Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label
                        htmlFor="customer-source"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nguồn khách *
                      </label>
                      <CustomSelect
                        options={customerSources}
                        value={newCustomerSource}
                        onChange={(value: string) =>
                          setNewCustomerSource(value)
                        }
                        placeholder="Chọn nguồn khách hàng"
                        // disabled={isLoading}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="customer-status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Trạng thái *
                      </label>
                      <CustomSelect
                        options={prospectingStatuses}
                        value={newCustomerStatus}
                        onChange={(value: string) =>
                          setNewCustomerStatus(value)
                        }
                        placeholder="Chọn trạng thái"
                        // disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-4">
                    <label
                      htmlFor="customer-note"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ghi chú (tùy chọn)
                    </label>
                    <textarea
                      id="customer-note"
                      value={newCustomerNote}
                      onChange={(e) => setNewCustomerNote(e.target.value)}
                      placeholder="Ghi chú về khách hàng, yêu cầu đặc biệt..."
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md min-h-[80px] sm:min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleAddCustomer}
                    disabled={!isFormValid()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50 inline-flex items-center"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm khách hàng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
