/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  FileText,
  DollarSign,
  Calendar,
  Edit,
  Plus,
  Clock,
  CheckCircle,
  CreditCard,
  StickyNote,
  User,
  Mail,
  Phone,
  Brain,
  RefreshCw,
  Settings,
  Package,
  ChevronRight,
  ArrowRight,
  X,
  AlertTriangle,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import { useContracts } from "@/contexts/ContractsContext";
import { NoteLogDialog } from "./components/dialogs/NoteLogDialog";
import AddNoteDialog from "./components/dialogs/AddNoteDialog";
import { EditCustomerInfoDialog } from "./components/dialogs/EditCustomerInfoDialog";
import { AddAdditionalServiceDialog } from "./components/dialogs/AddAdditionalServiceDialog";
import { Contract } from "@/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Updated status system
const CONTRACT_STATUSES = {
  waiting_schedule: "waiting_schedule",
  scheduled: "scheduled",
  retouch: "retouch",
  handover: "handover",
  completed: "completed",
  cancelled: "cancelled",
} as const;

type ContractStatus = keyof typeof CONTRACT_STATUSES;

const getStatusConfig = (status: ContractStatus) => {
  switch (status) {
    case "waiting_schedule":
      return {
        label: "Chờ lịch",
        color: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        description: "Hợp đồng đã ký, chờ lên lịch chụp",
      };
    case "scheduled":
      return {
        label: "Đã lên lịch",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Calendar,
        description: "Đã có lịch chụp, chờ thực hiện",
      };
    case "retouch":
      return {
        label: "Retouch",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: Settings,
        description: "Đang thực hiện retouch ảnh",
      };
    case "handover":
      return {
        label: "Bàn giao",
        color: "bg-teal-100 text-teal-800 border-teal-200",
        icon: Package,
        description: "Sản phẩm sẵn sàng bàn giao cho khách hàng",
      };
    case "completed":
      return {
        label: "Hoàn thành",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
        description: "Đã bàn giao xong cho khách",
      };
    case "cancelled":
      return {
        label: "Đóng hủy",
        color: "bg-red-100 text-red-800 border-red-200",
        icon: X,
        description: "Hợp đồng đã bị hủy",
      };
    default:
      return {
        label: "Không xác định",
        color: "bg-slate-100 text-slate-800 border-slate-200",
        icon: AlertTriangle,
        description: "Trạng thái không xác định",
      };
  }
};

// Status transition rules
const getAvailableTransitions = (
  currentStatus: ContractStatus
): ContractStatus[] => {
  switch (currentStatus) {
    case "waiting_schedule":
      return ["scheduled", "cancelled"];
    case "scheduled":
      return ["cancelled"]; // Removed 'retouch' - will auto-transition when appointment completes
    case "retouch":
      return ["handover", "cancelled"];
    case "handover":
      return ["completed", "cancelled"];
    case "completed":
      return []; // Final state
    case "cancelled":
      return []; // Final state
    default:
      return [];
  }
};

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: any;
  newStatus: ContractStatus;
  onConfirm: (data: any) => void;
}

function StatusChangeDialog({
  isOpen,
  onClose,
  contract,
  newStatus,
  onConfirm,
}: StatusChangeDialogProps) {
  const [formData, setFormData] = useState({
    // Appointment data for scheduled transition
    shootingDate: "",
    shootingTime: "",
    location: "",
    photographer: "",
    notes: "",
    // Retouch project data
    retouchType: "basic",
    estimatedDays: "7",
    specialRequests: "",
    // Handover data
    handoverDeliveryMethod: "drive",
    handoverNotes: "",
    // Completion data
    deliveryMethod: "drive",
    deliveryDate: "",
    customerFeedback: "",
    // Cancellation data
    cancellationReason: "",
    refundAmount: "0",
    cancellationNotes: "",
  });

  // Early return if contract is null
  if (!contract || !isOpen) {
    return null;
  }

  const statusConfig = getStatusConfig(newStatus);
  const currentStatusConfig = getStatusConfig(
    contract?.status || "waiting_schedule"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields based on status
    if (newStatus === "scheduled") {
      if (
        !formData.shootingDate ||
        !formData.shootingTime ||
        !formData.location
      ) {
        toast.error("Vui lòng điền đầy đủ thông tin lịch chụp");
        return;
      }
    } else if (newStatus === "retouch") {
      if (!formData.estimatedDays) {
        toast.error("Vui lòng điền thời gian dự kiến retouch");
        return;
      }
    } else if (newStatus === "handover") {
      // No required fields for handover transition
    } else if (newStatus === "completed") {
      if (!formData.deliveryDate) {
        toast.error("Vui lòng điền ngày bàn giao");
        return;
      }
    } else if (newStatus === "cancelled") {
      if (!formData.cancellationReason) {
        toast.error("Vui lòng điền lý do hủy hợp đồng");
        return;
      }
    }

    onConfirm({
      status: newStatus,
      statusData: formData,
      timestamp: new Date().toISOString(),
    });

    // Reset form
    setFormData({
      shootingDate: "",
      shootingTime: "",
      location: "",
      photographer: "",
      notes: "",
      retouchType: "basic",
      estimatedDays: "7",
      specialRequests: "",
      handoverDeliveryMethod: "drive",
      handoverNotes: "",
      deliveryMethod: "drive",
      deliveryDate: "",
      customerFeedback: "",
      cancellationReason: "",
      refundAmount: "0",
      cancellationNotes: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      {/* Dialog */}
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Chuyển trạng thái hợp đồng
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {currentStatusConfig.label} → {statusConfig.label}
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-4"
        >
          {/* Status transition preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${currentStatusConfig.color}`}
                >
                  {currentStatusConfig.label}
                </span>
                <p className="text-xs text-gray-500 mt-1">Hiện tại</p>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400" />

              <div className="text-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                >
                  {statusConfig.label}
                </span>
                <p className="text-xs text-gray-500 mt-1">Chuyển tới</p>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-sm text-gray-600">
                {statusConfig.description}
              </p>
            </div>
          </div>

          {/* Status specific fields would go here */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <statusConfig.icon className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">
                  Thông tin chuyển trạng thái
                </h4>
              </div>
              <p className="text-sm text-blue-700">
                Vui lòng xác nhận việc chuyển trạng thái hợp đồng.
              </p>
            </div>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-gray-50/50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-white rounded-lg font-medium transition-all duration-200 touch-manipulation"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700 border border-blue-200 rounded-lg font-medium transition-all duration-200 touch-manipulation flex items-center justify-center gap-2"
          >
            <statusConfig.icon className="w-4 h-4" />
            Chuyển trạng thái
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ContractsPage() {
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [isNoteLogOpen, setIsNoteLogOpen] = useState(false);
  const [selectedContractForNotes, setSelectedContractForNotes] =
    useState<Contract | null>(null);
  const [notesSummaries, setNotesSummaries] = useState<{
    [key: number]: string;
  }>({});
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<{
    [key: number]: boolean;
  }>({});
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [selectedContractForNote, setSelectedContractForNote] =
    useState<Contract | null>(null);
  const [isEditCustomerInfoOpen, setIsEditCustomerInfoOpen] = useState(false);
  const [
    selectedContractForEditCustomerInfo,
    setSelectedContractForEditCustomerInfo,
  ] = useState<Contract | null>(null);
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [selectedContractForService, setSelectedContractForService] =
    useState<Contract | null>(null);

  // Status change dialog states
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [selectedContractForStatus, setSelectedContractForStatus] =
    useState<any>(null);
  const [targetStatus, setTargetStatus] =
    useState<ContractStatus>("waiting_schedule");

  // Cancellation confirmation dialog states
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [selectedContractForCancel, setSelectedContractForCancel] =
    useState<any>(null);

  // Get contracts from context
  const { contracts, updateContract } = useContracts();

  // Status change handlers
  const handleStatusChange = (contract: any, newStatus: ContractStatus) => {
    // Special handling for cancellation - show confirmation first
    if (newStatus === "cancelled") {
      setSelectedContractForCancel(contract);
      setIsCancelConfirmOpen(true);
      return;
    }

    setSelectedContractForStatus(contract);
    setTargetStatus(newStatus);
    setIsStatusChangeOpen(true);
  };

  // Handle cancellation confirmation
  const handleCancelConfirm = () => {
    setIsCancelConfirmOpen(false);
    if (selectedContractForCancel) {
      setSelectedContractForStatus(selectedContractForCancel);
      setTargetStatus("cancelled");
      setIsStatusChangeOpen(true);
    }
  };

  const handleCancelDeny = () => {
    setIsCancelConfirmOpen(false);
    setSelectedContractForCancel(null);
  };

  const handleStatusChangeConfirm = async (data: any) => {
    if (!selectedContractForStatus) return;

    try {
      // Update contract with new status and related data
      const updates: any = {
        status: data.status,
        statusHistory: [
          ...(selectedContractForStatus.statusHistory || []),
          {
            from: selectedContractForStatus.status,
            to: data.status,
            timestamp: data.timestamp,
            data: data.statusData,
          },
        ],
      };

      // Handle specific status transitions
      if (data.status === "scheduled") {
        // Create appointment record
        updates.appointment = {
          date: data.statusData.shootingDate,
          time: data.statusData.shootingTime,
          location: data.statusData.location,
          photographer: data.statusData.photographer,
          notes: data.statusData.notes,
          contractId: selectedContractForStatus.id,
          createdAt: data.timestamp,
        };

        toast.success(
          `Đã tạo lịch chụp cho hợp đồng ${selectedContractForStatus.contractNumber}`
        );
      } else if (data.status === "retouch") {
        // Create retouch project
        updates.retouchProject = {
          type: data.statusData.retouchType,
          estimatedDays: parseInt(data.statusData.estimatedDays),
          specialRequests: data.statusData.specialRequests,
          contractId: selectedContractForStatus.id,
          startDate: data.timestamp,
          status: "in_progress",
        };

        toast.success(
          `Đã tạo dự án retouch cho hợp đồng ${selectedContractForStatus.contractNumber}`
        );
      } else if (data.status === "handover") {
        // Create handover record
        updates.handover = {
          readyDate: new Date().toISOString().split("T")[0],
          deliveryMethod: data.statusData.handoverDeliveryMethod,
          notes: data.statusData.handoverNotes,
          handoverAt: data.timestamp,
        };

        // toast.success(
        //   `Đã chuẩn bị bàn giao cho hợp đồng ${selectedContractForStatus.contractNumber}`
        // );
      } else if (data.status === "completed") {
        updates.completion = {
          deliveryMethod: data.statusData.deliveryMethod,
          deliveryDate: data.statusData.deliveryDate,
          customerFeedback: data.statusData.customerFeedback,
          completedAt: data.timestamp,
        };

        toast.success(
          `Đã hoàn thành hợp đồng ${selectedContractForStatus.contractNumber}`
        );
      } else if (data.status === "cancelled") {
        updates.cancellation = {
          reason: data.statusData.cancellationReason,
          refundAmount: parseFloat(data.statusData.refundAmount) || 0,
          notes: data.statusData.cancellationNotes,
          cancelledAt: data.timestamp,
        };

        toast.success(
          `Đã hủy hợp đồng ${selectedContractForStatus.contractNumber}`
        );
      }

      // Update contract in context
      await updateContract(selectedContractForStatus.id, updates);
    } catch (error) {
      console.error("Error updating contract status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const handleViewNoteLog = (contract: Contract) => {
    const latestContract =
      contracts.find((c) => c.id === contract.id) || contract;
    setSelectedContractForNotes(latestContract);

    console.log(">>>>>>", selectedContractForNote);

    setIsNoteLogOpen(true);
  };

  const handleEditCustomerInfo = (contract: Contract) => {
    setSelectedContractForEditCustomerInfo(contract);
    setIsEditCustomerInfoOpen(true);
  };

  const handleAddNote = (contract: Contract) => {
    setSelectedContractForNote(contract);
    setIsAddNoteOpen(true);
  };

  const handleAddService = (contract: Contract) => {
    setSelectedContractForService(contract);
    setIsAddServiceOpen(true);
  };

  const generateSummary = async (contract: Contract) => {
    if (!contract.noteHistory || contract.noteHistory.length === 0) {
      toast.error("Chưa có ghi chú nào để tóm tắt");
      return;
    }

    setIsGeneratingSummary((prev) => ({ ...prev, [contract.id]: true }));

    try {
      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockSummary = `Dựa trên ${
        contract.noteHistory.length
      } ghi chú, khách hàng đã thảo luận về gói ${
        contract.package
      }, yêu cầu đặc biệt về địa điểm chụp, và quan tâm đến thời gian giao sản phẩm. Tình trạng hiện tại: ${
        getStatusConfig(contract.status).label
      }.`;

      setNotesSummaries((prev) => ({ ...prev, [contract.id]: mockSummary }));

      toast.success("Đã tạo tóm tắt thành công");
    } catch (error) {
      console.error("Error generating summary:", error);
      toast.error("Có lỗi xảy ra khi tạo tóm tắt");
    } finally {
      setIsGeneratingSummary((prev) => ({ ...prev, [contract.id]: false }));
    }
  };

  // Group contracts by status
  const groupedContracts = contracts.reduce((groups, contract) => {
    const status = contract.status || "waiting_schedule";
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(contract);
    return groups;
  }, {} as Record<string, Contract[]>);

  // Status order for display
  const statusOrder: ContractStatus[] = [
    "waiting_schedule",
    "scheduled",
    "retouch",
    "handover",
    "completed",
    "cancelled",
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý hợp đồng
            </h1>
            <p className="text-sm text-gray-500">{contracts.length} hợp đồng</p>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statusOrder.map((status) => {
          const statusConfig = getStatusConfig(status);
          const count = groupedContracts[status]?.length || 0;
          const StatusIcon = statusConfig.icon;

          return (
            <div
              key={status}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-medium text-gray-600">
                    {statusConfig.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900">{count}</p>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.color}`}
                >
                  <StatusIcon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        {statusOrder.map((status) => {
          const contractsInStatus = groupedContracts[status] || [];
          if (contractsInStatus.length === 0) return null;

          const statusConfig = getStatusConfig(status);
          const StatusIcon = statusConfig.icon;

          return (
            <div key={status}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${statusConfig.color}`}
                >
                  <StatusIcon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {statusConfig.label} ({contractsInStatus.length})
                </h2>
              </div>
              {contractsInStatus.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onStatusChange={handleStatusChange}
                  onViewNoteLog={handleViewNoteLog}
                  onEditCustomerInfo={handleEditCustomerInfo}
                  onAddNote={handleAddNote}
                  onAddService={handleAddService}
                  onGenerateSummary={generateSummary}
                  notesSummary={notesSummaries[contract.id]}
                  isGeneratingSummary={isGeneratingSummary[contract.id]}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {contracts.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có hợp đồng nào
          </h3>
          <p className="text-gray-500">
            Hợp đồng sẽ xuất hiện ở đây khi được tạo từ khách hàng tiềm năng.
          </p>
        </div>
      )}

      {/* Dialogs */}
      <StatusChangeDialog
        isOpen={isStatusChangeOpen}
        onClose={() => setIsStatusChangeOpen(false)}
        contract={selectedContractForStatus}
        newStatus={targetStatus}
        onConfirm={handleStatusChangeConfirm}
      />

      {/* Cancel Confirmation Dialog */}
      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelDeny}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-lg mx-4 p-0 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-6 pb-3 sm:pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Xác nhận hủy hợp đồng
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Bạn có chắc chắn muốn hủy hợp đồng{" "}
                    {selectedContractForCancel?.contractNumber}?
                  </p>
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Lưu ý:</strong> Việc hủy hợp đồng sẽ dừng tất cả hoạt
                  động liên quan và có thể ảnh hưởng đến kế hoạch kinh doanh.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 pt-3 sm:pt-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={handleCancelDeny}
                className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 bg-white rounded-lg font-medium transition-all duration-200 touch-manipulation"
              >
                Không hủy
              </button>
              <button
                onClick={handleCancelConfirm}
                className="flex-1 h-12 px-6 text-base sm:h-10 sm:px-4 sm:text-sm bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700 border border-red-200 rounded-lg font-medium transition-all duration-200 touch-manipulation flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <NoteLogDialog
        isOpen={isNoteLogOpen}
        onClose={() => setIsNoteLogOpen(false)}
        noteHistory={selectedContractForNotes?.noteHistory}
        contractNumber={selectedContractForNotes?.contractNumber}
        coupleName={selectedContractForNotes?.couple}
      />

      <AddNoteDialog
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        contract={selectedContractForNote}
        // onNoteAdded={onNote}
      />

      <EditCustomerInfoDialog
        isOpen={isEditCustomerInfoOpen}
        onClose={() => setIsEditCustomerInfoOpen(false)}
        contract={selectedContractForEditCustomerInfo}
      />

      <AddAdditionalServiceDialog
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        contract={selectedContractForService}
      />
    </div>
  );
}

interface ContractCardProps {
  contract: Contract;
  onStatusChange: (contract: Contract, status: ContractStatus) => void;
  onViewNoteLog: (contract: Contract) => void;
  onEditCustomerInfo: (contract: Contract) => void;
  onAddNote: (contract: Contract) => void;
  onAddService: (contract: Contract) => void;
  onGenerateSummary: (contract: Contract) => void;
  notesSummary?: string;
  isGeneratingSummary?: boolean;
}

function ContractCard({
  contract,
  onStatusChange,
  onViewNoteLog,
  onEditCustomerInfo,
  onAddNote,
  onAddService,
  onGenerateSummary,
  notesSummary,
  isGeneratingSummary,
}: ContractCardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const statusConfig = getStatusConfig(contract.status);
  const availableTransitions = getAvailableTransitions(contract.status);

  // Calculate payment amounts
  const totalValue = contract.totalAmount || 0;
  const paidAmount = contract.paidAmount || 0;
  const remainingAmount = totalValue - paidAmount;

  return (
    <div className="bg-white border border-gray-200 hover:border-gray-300 transition-colors duration-200 rounded-lg overflow-hidden">
      {/* Card Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                {contract.customerName}
              </h3>
              <span
                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">
              <span>{contract.contractNumber}</span>
              <span>•</span>
              <span>
                Cưới:{" "}
                {new Date(
                  contract.weddingDate || contract.signedDate
                ).toLocaleDateString("vi-VN")}
              </span>
              <span>•</span>
              <span>{contract.package}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onStatusChange(contract, "cancelled")}
              className="h-8 px-3 text-sm text-red-600 border border-red-200 hover:bg-red-50 bg-white rounded font-medium transition-all duration-200 touch-manipulation"
            >
              Đóng hủy
            </button>
            <button className="h-8 px-2 text-sm border border-gray-200 hover:bg-gray-50 bg-white rounded font-medium transition-all duration-200 touch-manipulation">
              Sửa
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-100">
        <div className="flex w-full bg-gray-100 rounded-lg p-1">
          {[
            {
              id: "overview",
              label: "Tổng quan",
              shortLabel: "TQ",
              icon: Home,
            },
            {
              id: "customer",
              label: "Khách hàng",
              shortLabel: "KH",
              icon: User,
            },
            {
              id: "services",
              label: "Dịch vụ",
              shortLabel: "DV",
              icon: Package,
            },
            {
              id: "payment",
              label: "Thanh toán",
              shortLabel: "TT",
              icon: CreditCard,
            },
            {
              id: "notes",
              label: "Ghi chú",
              shortLabel: "GC",
              icon: StickyNote,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 h-11 text-sm font-medium rounded transition-all duration-200 touch-manipulation ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Financial Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-100 mb-2 mx-auto">
                  <DollarSign className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Tổng giá trị</p>
                <p className="text-base font-bold text-gray-900">
                  {formatCurrency(totalValue)}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 mb-2 mx-auto">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Đã thanh toán</p>
                <p className="text-base font-bold text-blue-600">
                  {formatCurrency(paidAmount)}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-100 mb-2 mx-auto">
                  <Clock className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-sm text-gray-500 mb-1">Còn lại</p>
                <p className="text-base font-bold text-red-600">
                  {formatCurrency(remainingAmount)}
                </p>
              </div>
            </div>

            {/* Status Actions */}
            {availableTransitions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Hành động</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTransitions.map((newStatus) => {
                    const newStatusConfig = getStatusConfig(newStatus);
                    const isCancel = newStatus === "cancelled";

                    return (
                      <button
                        key={newStatus}
                        onClick={() => onStatusChange(contract, newStatus)}
                        className={`flex items-center gap-1 text-sm h-8 px-2 rounded border font-medium transition-all duration-200 touch-manipulation ${
                          isCancel
                            ? "text-red-600 border-red-200 hover:bg-red-50"
                            : "text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <newStatusConfig.icon className="w-4 h-4" />
                        {newStatusConfig.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Tab */}
        {activeTab === "customer" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-gray-900">
                Thông tin khách hàng
              </h4>
              <button
                onClick={() => onEditCustomerInfo(contract)}
                className="h-8 px-2 text-sm text-gray-500 border border-gray-200 hover:text-gray-700 hover:bg-gray-100 flex items-center gap-1 transition-colors cursor-pointer rounded-sm"
              >
                <Edit className="w-4 h-4" />
                Sửa
              </button>
            </div>

            <div className="space-y-3 text-base">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{contract.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{contract.customerPhone}</span>
              </div>
              {contract.weddingDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    Ngày cưới:{" "}
                    {new Date(contract.weddingDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-medium text-gray-900">
                Dịch vụ bổ sung
              </h4>
              <button
                onClick={() => onAddService(contract)}
                className="h-7 px-2 text-sm border border-green-200 text-green-700 hover:bg-green-50 rounded font-medium transition-all duration-200 touch-manipulation flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Thêm
              </button>
            </div>

            {/* Main Package */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-medium text-blue-900">{contract.package}</p>
              <p className="text-lg font-bold text-blue-700 mt-1">
                {formatCurrency(totalValue)}
              </p>
            </div>

            {/* Additional Services */}
            {contract.additionalServices &&
            contract.additionalServices.length > 0 ? (
              <div className="space-y-2">
                {contract.additionalServices.map(
                  (service: any, index: number) => (
                    <div
                      key={index}
                      className="p-2 bg-gray-50 border border-gray-200 rounded text-[13px]"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-medium">{service.name}</span>
                        <span className="text-green-600">
                          {formatCurrency(service.price)}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-base">Chưa có dịch vụ bổ sung</p>
              </div>
            )}
          </div>
        )}

        {/* Payment Tab */}
        {activeTab === "payment" && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-gray-900">
              Thông tin thanh toán
            </h4>

            {/* Payment Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-600">Tiến độ thanh toán</span>
                <span className="font-medium">
                  {Math.round((paidAmount / totalValue) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(paidAmount / totalValue) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-[13px] text-gray-600">Tổng giá trị</span>
                <span className="text-[13px] font-medium">
                  {formatCurrency(totalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-[13px] text-gray-600">Đã thanh toán</span>
                <span className="text-[13px] font-medium text-green-600">
                  {formatCurrency(paidAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-[13px] text-gray-600">Còn lại</span>
                <span className="text-[13px] font-medium text-red-600">
                  {formatCurrency(remainingAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            {/* Notes Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-gray-400" />
                <h4 className="text-base font-medium text-gray-900">
                  Ghi chú & Tóm tắt AI
                </h4>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onAddNote(contract)}
                  className="h-7 px-2 text-sm border border-blue-200 text-blue-700 hover:bg-blue-50 rounded font-medium transition-all duration-200 touch-manipulation flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Thêm
                </button>
                <button
                  onClick={() => onViewNoteLog(contract)}
                  className="h-7 px-2 text-sm border border-gray-200 hover:bg-gray-50 rounded font-medium transition-all duration-200 touch-manipulation cursor-pointer cursor-pointer"
                >
                  Chi tiết ({contract.noteHistory?.length || 0})
                </button>
              </div>
            </div>

            {/* Notes Content */}
            {contract.noteHistory && contract.noteHistory.length > 0 ? (
              <div className="space-y-3">
                {contract.noteHistory
                  .slice(0, 2)
                  .map((note: any, index: number) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          {note.author}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(note.timestamp).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">
                        {note.note}
                      </p>
                    </div>
                  ))}

                {contract.noteHistory.length > 2 && (
                  <p className="text-sm text-gray-500 text-center">
                    và {contract.noteHistory.length - 2} ghi chú khác...
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 bg-blue-50 rounded-lg border border-blue-200">
                <Plus className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <p className="text-sm text-blue-700 mb-2">
                  Nhấn nút &quot;Thêm&quot; để thêm ghi chú mới
                </p>
                <button
                  onClick={() => onAddNote(contract)}
                  className="text-xs border border-blue-300 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded font-medium transition-all duration-200 touch-manipulation flex items-center gap-1 mx-auto"
                >
                  <Plus className="w-3 h-3" />
                  Thêm ghi chú
                </button>
              </div>
            )}

            {/* AI Summary */}
            <div className="space-y-3 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-700">
                  Tóm tắt AI
                </h5>
                <button
                  onClick={() => onGenerateSummary(contract)}
                  disabled={
                    isGeneratingSummary || !contract.noteHistory?.length
                  }
                  className="h-7 px-2 text-sm border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded font-medium transition-all duration-200 touch-manipulation flex items-center gap-1"
                >
                  {isGeneratingSummary ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Brain className="w-4 h-4" />
                  )}
                  {isGeneratingSummary ? "Đang tạo..." : "Tạo"}
                </button>
              </div>

              {notesSummary ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">{notesSummary}</p>
                </div>
              ) : (
                <div className="text-center py-3 text-gray-500">
                  <Brain className="w-8 h-8 mx-auto mb-1 text-gray-400" />
                  <p className="text-sm">Chưa có tóm tắt AI</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
