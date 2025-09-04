/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Trash2,
  User,
  Percent,
  CreditCard,
  X,
  ChevronDown,
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { usePricing } from "@/contexts/PricingContext";

interface CreateContractDialogProps {
  customer: any;
  onClose: () => void;
  onSave: () => void;
  onCreateContract: (customer: any, contractData: any) => void;
}

interface PaymentItem {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "pending" | "completed" | "cancelled";
  notes: string;
}

interface Service {
  id: string;
  name: string;
  price: string;
  category: string;
}

// Mock services data - replace with your actual data source
const mockServices = {
  "Wedding Photography": [
    {
      id: "1",
      name: "Gói chụp ảnh cưới cơ bản",
      price: "15000000",
      category: "Wedding Photography",
    },
    {
      id: "2",
      name: "Gói chụp ảnh cưới premium",
      price: "25000000",
      category: "Wedding Photography",
    },
    {
      id: "3",
      name: "Gói chụp ảnh cưới luxury",
      price: "40000000",
      category: "Wedding Photography",
    },
  ],
  "Event Planning": [
    {
      id: "4",
      name: "Tổ chức tiệc cưới nhỏ",
      price: "20000000",
      category: "Event Planning",
    },
    {
      id: "5",
      name: "Tổ chức tiệc cưới lớn",
      price: "50000000",
      category: "Event Planning",
    },
  ],
  "Makeup & Hair": [
    {
      id: "6",
      name: "Trang điểm cô dâu",
      price: "3000000",
      category: "Makeup & Hair",
    },
    {
      id: "7",
      name: "Trang điểm + làm tóc",
      price: "5000000",
      category: "Makeup & Hair",
    },
  ],
};

// Toast function (mock)
const toast = {
  error: (message: string) => console.error("Toast Error:", message),
  success: (message: string) => console.log("Toast Success:", message),
};

export default function CreateContractDialog({
  customer,
  onClose,
  onSave,
  onCreateContract,
}: CreateContractDialogProps) {
  const { services } = usePricing();

  const [formData, setFormData] = useState({
    contractName: "",
    contractSignDate: "",
    totalValue: "",
    discountPercent: "",
    finalValue: "",
    notes: "",
  });

  const [selectedMainService, setSelectedMainService] =
    useState<Service | null>(null);
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<
    Service[]
  >([]);

  const [mainServiceOpen, setMainServiceOpen] = useState(false);
  const [additionalServiceOpen, setAdditionalServiceOpen] = useState(false);
  const [mainServiceSearch, setMainServiceSearch] = useState("");
  const [additionalServiceSearch, setAdditionalServiceSearch] = useState("");

  const [payments, setPayments] = useState<PaymentItem[]>([
    {
      id: "1",
      date: "",
      description: "",
      amount: "",
      status: "pending",
      notes: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mainServiceRef = useRef<HTMLDivElement>(null);
  const additionalServiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (customer) {
      setIsVisible(true);
    }
  }, [customer]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mainServiceRef.current &&
        !mainServiceRef.current.contains(event.target as Node)
      ) {
        setMainServiceOpen(false);
      }
      if (
        additionalServiceRef.current &&
        !additionalServiceRef.current.contains(event.target as Node)
      ) {
        setAdditionalServiceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Additional services from pricing context
  const additionalServicesFromPricing = useMemo(
    () =>
      (services.additional || []).map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        category: "additional",
      })),
    [services]
  );

  // Filter services for search
  const filteredMainServices = services.items.filter((service) =>
    service.name.toLowerCase().includes(mainServiceSearch.toLowerCase())
  );

  const filteredAdditionalServices = additionalServicesFromPricing.filter(
    (service) =>
      service.name
        .toLowerCase()
        .includes(additionalServiceSearch.toLowerCase()) &&
      !selectedAdditionalServices.some(
        (selected) => selected.id === service.id
      ) &&
      selectedMainService?.id !== service.id
  );

  // Recalculate totalValue = main service + sum(additional)
  useEffect(() => {
    const base = parseInt((selectedMainService?.price || "0").toString().replace(/\D/g, "")) || 0;
    const addSum = selectedAdditionalServices.reduce((sum, s) => {
      const n = parseInt((s.price || "0").toString().replace(/\D/g, "")) || 0;
      return sum + n;
    }, 0);
    const total = base + addSum;
    setFormData((prev) => ({ ...prev, totalValue: total.toString() }));
  }, [selectedMainService, selectedAdditionalServices]);

  // Keep finalValue in sync when totalValue/discount changes
  useEffect(() => {
    const total = parseInt(formData.totalValue.replace(/\D/g, "")) || 0;
    const discount = parseFloat(formData.discountPercent) || 0;
    const final = Math.max(total - (total * discount) / 100, 0);
    setFormData((prev) => ({ ...prev, finalValue: String(Math.round(final)) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.totalValue, formData.discountPercent]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto calculate final value when total value or discount changes
      if (field === "totalValue" || field === "discountPercent") {
        const totalValue =
          parseFloat(
            (field === "totalValue" ? value : prev.totalValue).replace(
              /\D/g,
              ""
            )
          ) || 0;
        const discountPercent =
          parseFloat(
            field === "discountPercent" ? value : prev.discountPercent
          ) || 0;
        const discountAmount = (totalValue * discountPercent) / 100;
        const finalValue = totalValue - discountAmount;
        updated.finalValue = finalValue.toString();
      }

      return updated;
    });
  };

  const handlePaymentChange = (
    id: string,
    field: keyof PaymentItem,
    value: string
  ) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id ? { ...payment, [field]: value } : payment
      )
    );
  };

  const addPayment = () => {
    const newPayment: PaymentItem = {
      id: Date.now().toString(),
      date: "",
      description: "",
      amount: "",
      status: "pending",
      notes: "",
    };
    setPayments((prev) => [...prev, newPayment]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    } else {
      toast.error("Phải có ít nhất một thông tin thanh toán");
    }
  };

  const handleMainServiceSelect = (service: Service) => {
    setSelectedMainService(service);
    setFormData((prev) => ({ ...prev, totalValue: service.price }));
    setMainServiceOpen(false);
    setMainServiceSearch("");
  };

  const handleAdditionalServiceSelect = (service: Service) => {
    setSelectedAdditionalServices((prev) => [...prev, service]);
    setAdditionalServiceOpen(false);
    setAdditionalServiceSearch("");
  };

  const removeAdditionalService = (serviceId: string) => {
    setSelectedAdditionalServices((prev) =>
      prev.filter((s) => s.id !== serviceId)
    );
  };

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("vi-VN").format(parseInt(number) || 0);
  };

  const handleAmountChange = (
    value: string,
    field: string,
    paymentId?: string
  ) => {
    const numericValue = value.replace(/\D/g, "");
    if (paymentId) {
      handlePaymentChange(paymentId, field as keyof PaymentItem, numericValue);
    } else {
      handleInputChange(field, numericValue);
    }
  };

  const validateForm = () => {
    if (!formData.contractName.trim()) {
      toast.error("Tên hợp đồng không được để trống");
      return false;
    }
    if (!selectedMainService) {
      toast.error("Vui lòng chọn gói dịch vụ chính");
      return false;
    }
    if (!formData.contractSignDate) {
      toast.error("Ngày ký hợp đồng không được để trống");
      return false;
    }
    if (!formData.totalValue.trim()) {
      toast.error("Giá trị hợp đồng không được để trống");
      return false;
    }

    // Validate payments
    const validPayments = payments.filter(
      (payment) =>
        payment.date.trim() &&
        payment.description.trim() &&
        payment.amount.trim()
    );
    if (validPayments.length === 0) {
      toast.error("Vui lòng nhập ít nhất một thông tin thanh toán hợp lệ");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Filter out empty payments and format
      const validPayments = payments
        .filter(
          (payment) =>
            payment.date.trim() &&
            payment.description.trim() &&
            payment.amount.trim()
        )
        .map((payment) => ({
          date: payment.date,
          description: payment.description.trim(),
          amount: parseInt(payment.amount) || 0,
          status: payment.status,
          notes: payment.notes.trim(),
        }));

      const contractData = {
        contractName: formData.contractName.trim(),
        mainService: selectedMainService,
        additionalServices: selectedAdditionalServices,
        contractSignDate: formData.contractSignDate,
        totalValue: formData.totalValue,
        discountPercent: formData.discountPercent,
        finalValue: formData.finalValue,
        notes: formData.notes.trim(),
        payments: validPayments,
      };

      console.log("Creating contract with data:", contractData);

      onCreateContract(customer, contractData);

      toast.success(`Đã tạo hợp đồng "${formData.contractName}" thành công`);
      handleClose();
      onSave();
    } catch (error) {
      console.error("Error creating contract:", error);
      toast.error("Không thể tạo hợp đồng. Vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Reset form data
      setFormData({
        contractName: "",
        contractSignDate: "",
        totalValue: "",
        discountPercent: "",
        finalValue: "",
        notes: "",
      });
      setSelectedMainService(null);
      setSelectedAdditionalServices([]);
      setPayments([
        {
          id: "1",
          date: "",
          description: "",
          amount: "",
          status: "pending",
          notes: "",
        },
      ]);
      setMainServiceSearch("");
      setAdditionalServiceSearch("");
      onClose();
    }, 200);
  };

  if (!customer) return null;

  return (
    <AnimatePresence>
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
              <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </motion.div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        Tạo hợp đồng
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Tạo hợp đồng mới với quản lý công nợ cho khách hàng{" "}
                        {customer.name}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-6">
                <div className="py-4 sm:py-6 space-y-6">
                  {/* Basic Contract Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <h4 className="text-sm font-medium text-gray-700">
                        Thông tin hợp đồng
                      </h4>
                    </div>

                    {/* Contract Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Tên hợp đồng *
                      </label>
                      <motion.input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-sm"
                        value={formData.contractName}
                        onChange={(e) =>
                          handleInputChange("contractName", e.target.value)
                        }
                        placeholder="Nhập tên hợp đồng"
                        whileFocus={{ scale: 1.01 }}
                      />
                    </div>

                    {/* Main Service Package */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Gói dịch vụ *
                      </label>
                      <div className="relative" ref={mainServiceRef}>
                        <motion.button
                          onClick={() => setMainServiceOpen(!mainServiceOpen)}
                          className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-between min-h-[48px] sm:min-h-[40px]"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          {selectedMainService ? (
                            <div className="flex flex-col items-start">
                              <span className="text-sm font-medium">
                                {selectedMainService.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatCurrency(selectedMainService.price)} VNĐ
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">
                              Tìm và chọn gói dịch vụ...
                            </span>
                          )}
                          <motion.div
                            animate={{ rotate: mainServiceOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </motion.button>

                        <AnimatePresence>
                          {mainServiceOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                              <div className="p-2 border-b border-gray-100">
                                <input
                                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                                  placeholder="Tìm gói dịch vụ..."
                                  value={mainServiceSearch}
                                  onChange={(e) =>
                                    setMainServiceSearch(e.target.value)
                                  }
                                />
                              </div>
                              <div className="max-h-48 overflow-y-auto">
                                {filteredMainServices.length === 0 ? (
                                  <div className="p-4 text-sm text-gray-500 text-center">
                                    Không tìm thấy gói dịch vụ nào.
                                  </div>
                                ) : (
                                  filteredMainServices.map((service, index) => (
                                    <button
                                      key={service.id}
                                      onClick={() =>
                                        handleMainServiceSelect(service)
                                      }
                                      className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                                    >
                                      <div className="flex flex-col items-start">
                                        <span className="font-medium text-sm">
                                          {service.name}
                                        </span>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                          <span>
                                            {formatCurrency(service.price)} VNĐ
                                          </span>
                                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                            {service.category}
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Gói bổ sung
                      </label>
                      <div className="space-y-2">
                        {/* Show selected additional services */}
                        <AnimatePresence>
                          {selectedAdditionalServices.length > 0 && (
                            <motion.div className="flex flex-wrap gap-2">
                              {selectedAdditionalServices.map(
                                (service, index) => (
                                  <motion.span
                                    key={service.id}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs border"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: index * 0.05 }}
                                    layout
                                  >
                                    {service.name} -{" "}
                                    {formatCurrency(service.price)} VNĐ
                                    <motion.button
                                      onClick={() =>
                                        removeAdditionalService(service.id)
                                      }
                                      className="ml-1 p-0.5 hover:bg-red-100 rounded-full transition-colors"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <X className="w-3 h-3 text-red-500" />
                                    </motion.button>
                                  </motion.span>
                                )
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="relative" ref={additionalServiceRef}>
                          <motion.button
                            onClick={() =>
                              setAdditionalServiceOpen(!additionalServiceOpen)
                            }
                            className="w-full px-3 py-2 text-left border border-gray-200 rounded-lg hover:border-gray-300 focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 flex items-center justify-between"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <span className="text-gray-500 text-sm">
                              Tìm và thêm gói bổ sung...
                            </span>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </motion.button>

                          <AnimatePresence>
                            {additionalServiceOpen && (
                              <motion.div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-hidden">
                                <div className="p-2 border-b border-gray-100">
                                  <motion.input
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50"
                                    placeholder="Tìm gói bổ sung..."
                                    value={additionalServiceSearch}
                                    onChange={(e) =>
                                      setAdditionalServiceSearch(e.target.value)
                                    }
                                    whileFocus={{ scale: 1.01 }}
                                  />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                  {filteredAdditionalServices.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500 text-center">
                                      Không tìm thấy gói dịch vụ nào.
                                    </div>
                                  ) : (
                                    filteredAdditionalServices.map(
                                      (service) => (
                                        <motion.button
                                          key={service.id}
                                          onClick={() =>
                                            handleAdditionalServiceSelect(
                                              service
                                            )
                                          }
                                          className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                                        >
                                          <div className="flex flex-col items-start">
                                            <span className="font-medium text-sm">
                                              {service.name}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                              <span>
                                                {formatCurrency(service.price)}{" "}
                                                VNĐ
                                              </span>
                                              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                {service.category}
                                              </span>
                                            </div>
                                          </div>
                                        </motion.button>
                                      )
                                    )
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    {/* Contract Sign Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Ngày ký hợp đồng *
                      </label>
                      <motion.input
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-sm"
                        type="date"
                        value={formData.contractSignDate}
                        onChange={(e) =>
                          handleInputChange("contractSignDate", e.target.value)
                        }
                        whileFocus={{ scale: 1.01 }}
                      />
                    </div>

                    {/* Pricing Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="text-sm font-medium text-gray-700">
                          Giá trị *
                        </label>
                        <div className="relative">
                          <motion.input
                            className="w-full px-3 py-2 pr-12 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-sm"
                            value={formatCurrency(formData.totalValue)}
                            onChange={(e) =>
                              handleAmountChange(e.target.value, "totalValue")
                            }
                            placeholder="0"
                            whileFocus={{ scale: 1.01 }}
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            VNĐ
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="text-sm font-medium text-gray-700">
                          Giảm giá (%)
                        </label>
                        <div className="relative">
                          <motion.input
                            className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-sm"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.discountPercent}
                            onChange={(e) =>
                              handleInputChange(
                                "discountPercent",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            whileFocus={{ scale: 1.01 }}
                          />
                          <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                        </div>
                      </motion.div>

                      <motion.div
                        className="space-y-2"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="text-sm font-medium text-gray-700">
                          Tổng giá trị
                        </label>
                        <div className="relative">
                          <input
                            className="w-full px-3 py-2 pr-12 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                            value={formatCurrency(formData.finalValue)}
                            readOnly
                            placeholder="0"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                            VNĐ
                          </span>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Payment Information Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-600" />
                        <h4 className="text-sm font-medium text-gray-700">
                          Thông tin thanh toán
                        </h4>
                      </div>
                      <motion.button
                        onClick={addPayment}
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Plus className="w-3 h-3" />
                        Thêm thanh toán
                      </motion.button>
                    </div>

                    <div className="space-y-3">
                      <AnimatePresence>
                        {payments.map((payment, index) => (
                          <div
                            key={payment.id}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {/* Payment Date */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  Ngày thu
                                </label>
                                <motion.input
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-sm"
                                  type="date"
                                  value={payment.date}
                                  onChange={(e) =>
                                    handlePaymentChange(
                                      payment.id,
                                      "date",
                                      e.target.value
                                    )
                                  }
                                  whileFocus={{ scale: 1.01 }}
                                />
                              </div>

                              {/* Payment Description */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  Nội dung
                                </label>
                                <motion.input
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-sm"
                                  value={payment.description}
                                  onChange={(e) =>
                                    handlePaymentChange(
                                      payment.id,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Mô tả nội dung thanh toán"
                                  whileFocus={{ scale: 1.01 }}
                                />
                              </div>

                              {/* Payment Amount */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  Giá trị
                                </label>
                                <div className="relative">
                                  <motion.input
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-sm"
                                    value={formatCurrency(payment.amount)}
                                    onChange={(e) =>
                                      handleAmountChange(
                                        e.target.value,
                                        "amount",
                                        payment.id
                                      )
                                    }
                                    placeholder="0"
                                    whileFocus={{ scale: 1.01 }}
                                  />
                                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                                    VNĐ
                                  </span>
                                </div>
                              </div>

                              {/* Payment Status */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  Trạng thái
                                </label>
                                <CustomSelect
                                  options={[
                                    {
                                      value: "pending",
                                      label: "Chờ thanh toán",
                                    },
                                    {
                                      value: "completed",
                                      label: "Đã thanh toán",
                                    },
                                    { value: "cancelled", label: "Đã hủy" },
                                  ]}
                                  value={payment.status}
                                  onChange={(val) =>
                                    handlePaymentChange(
                                      payment.id,
                                      "status",
                                      val as
                                        | "pending"
                                        | "completed"
                                        | "cancelled"
                                    )
                                  }
                                />
                              </div>

                              {/* Payment Notes */}
                              <div>
                                <label className="text-xs font-medium text-gray-600 mb-1 block">
                                  Ghi chú
                                </label>
                                <motion.input
                                  className="w-full px-3 py-2.5 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 text-sm"
                                  value={payment.notes}
                                  onChange={(e) =>
                                    handlePaymentChange(
                                      payment.id,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ghi chú thêm"
                                  whileFocus={{ scale: 1.01 }}
                                />
                              </div>

                              {/* Remove Button */}
                              <div className="flex items-end">
                                <motion.button
                                  onClick={() => removePayment(payment.id)}
                                  disabled={payments.length === 1}
                                  className="h-10 w-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all duration-200 -translate-y-1"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Trash2 className="w-5 h-5" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Ghi chú
                    </label>
                    <motion.textarea
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-300 focus:ring-2 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 text-sm min-h-[80px] resize-none"
                      value={formData.notes}
                      onChange={(e) =>
                        handleInputChange("notes", e.target.value)
                      }
                      placeholder="Ghi chú thêm cho hợp đồng..."
                      whileFocus={{ scale: 1.01 }}
                    />
                  </div>

                  {/* Customer Info Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      <h5 className="text-sm font-medium text-blue-900">
                        Thông tin khách hàng
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-blue-700 font-medium">Tên:</span>
                        <span className="text-blue-800 ml-1">
                          {customer.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">SĐT:</span>
                        <span className="text-blue-800 ml-1">
                          {customer.phone || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Email:
                        </span>
                        <span className="text-blue-800 ml-1">
                          {customer.email || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-blue-700 font-medium">
                          Nguồn:
                        </span>
                        <span className="text-blue-800 ml-1">
                          {customer.source || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-gray-50/50">
                <motion.button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Hủy
                </motion.button>
                <motion.button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo hợp đồng"
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
