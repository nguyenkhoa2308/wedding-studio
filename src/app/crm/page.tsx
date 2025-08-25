/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import CustomerTable from "./components/tables/CustomerTable";

// Mock customer data - only prospecting customers now
const prospectingCustomers = [
  {
    id: 1,
    name: "Trần Minh Anh",
    email: "minhanh@email.com",
    phone: "0901234567",
    address: "Quận 1, TP.HCM",
    status: "hot",
    avatar: "/api/placeholder/60/60",
    weddingDate: "2025-06-15",
    budget: "50000000",
    source: "Facebook",
    assignedTo: "Nguyễn Văn An",
    createdAt: "2025-01-10",
    lastContact: "2025-01-14T15:45:00",
    priority: "high",
    notesSummary:
      "Khách hàng có tiềm năng cao, quan tâm gói Premium với album 200 ảnh. Đã nhận báo giá và đang trong quá trình cân nhắc. Cần theo dõi sát để chốt đơn trong tuần này.",
    notes: [
      {
        id: 1,
        content:
          "Khách hàng quan tâm gói Premium, cần báo giá chi tiết cho album 200 ảnh",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-14 10:30",
        type: "note",
      },
      {
        id: 2,
        content:
          "Đã gửi báo giá qua email. Khách hàng sẽ phản hồi trong tuần này",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-14 15:45",
        type: "action",
      },
    ],
  },
  {
    id: 2,
    name: "Lê Thị Hương",
    email: "huong.le@gmail.com",
    phone: "0912345678",
    address: "Hà Nội",
    status: "potential",
    avatar: "/api/placeholder/60/60",
    weddingDate: "2025-08-20",
    budget: "30000000",
    source: "Website",
    assignedTo: "Trần Thị Bình",
    createdAt: "2025-01-12",
    lastContact: "2025-01-13T14:20:00",
    priority: "medium",
    notes: [
      {
        id: 4,
        content: "Khách hàng mới từ website, quan tâm package cơ bản",
        author: "Trần Thị Bình",
        timestamp: "2025-01-12 14:20",
        type: "note",
      },
    ],
  },
  {
    id: 3,
    name: "Phạm Thị Mai",
    email: "mai.pham@email.com",
    phone: "0934567890",
    address: "Quận 7, TP.HCM",
    status: "interested",
    avatar: "/api/placeholder/60/60",
    weddingDate: "2025-12-25",
    budget: "25000000",
    source: "Instagram",
    assignedTo: "Phạm Thu Hà",
    createdAt: "2025-01-15",
    lastContact: "2025-01-15T13:45:00",
    priority: "low",
    notes: [
      {
        id: 8,
        content: "Liên hệ qua Instagram, quan tâm chụp ảnh cưới mùa Noel",
        author: "Phạm Thu Hà",
        timestamp: "2025-01-15 13:45",
        type: "note",
      },
    ],
  },
  {
    id: 4,
    name: "Nguyễn Thanh Hương",
    email: "huong.nguyen@company.com",
    phone: "0945678901",
    address: "Quận 3, TP.HCM",
    status: "hot",
    avatar: "/api/placeholder/60/60",
    weddingDate: "2025-05-20",
    budget: "60000000",
    source: "Referral",
    assignedTo: "Lê Minh Cường",
    createdAt: "2025-01-12",
    lastContact: "2025-01-16T11:00:00",
    priority: "high",
    notesSummary:
      "Khách hàng VIP được giới thiệu, có budget cao và quan tâm gói Luxury. Đã hẹn gặp trực tiếp để thảo luận chi tiết. Cơ hội chốt đơn rất cao, cần chuẩn bị kỹ lưỡng cho buổi tư vấn.",
    notes: [
      {
        id: 9,
        content: "Khách hàng được giới thiệu từ cô dâu cũ. Quan tâm gói Luxury",
        author: "Lê Minh Cường",
        timestamp: "2025-01-12 16:30",
        type: "note",
      },
      {
        id: 10,
        content: "Đã hẹn gặp trực tiếp để tư vấn chi tiết vào thứ 6 tuần này",
        author: "Lê Minh Cường",
        timestamp: "2025-01-16 11:00",
        type: "action",
      },
    ],
  },
  {
    id: 5,
    name: "Võ Minh Tân",
    email: "tan.vo@email.com",
    phone: "0956789012",
    address: "Đà Nẵng",
    status: "potential",
    avatar: "/api/placeholder/60/60",
    weddingDate: "2025-09-10",
    budget: "40000000",
    source: "Google",
    assignedTo: "Phạm Thu Hà",
    createdAt: "2025-01-14",
    lastContact: "2025-01-15T09:15:00",
    priority: "medium",
    notes: [
      {
        id: 11,
        content: "Khách hàng từ Đà Nẵng, quan tâm chụp ảnh cưới tại Hội An",
        author: "Phạm Thu Hà",
        timestamp: "2025-01-14 09:15",
        type: "note",
      },
    ],
  },
];

export const prospectingStatuses = [
  {
    id: "interested",
    label: "Quan tâm",
    color: "bg-green-50 text-green-700 border-green-200",
  },
  {
    id: "potential",
    label: "Tiềm năng",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  {
    id: "hot",
    label: "Chốt nóng",
    color: "bg-red-50 text-red-700 border-red-200",
  },
];

export default function CRMPage() {
  // Convert static data to state for reactive updates
  const [customers, setCustomers] = useState(prospectingCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [movingToContractCustomer, setMovingToContractCustomer] =
    useState<any>(null);
  const [deletingCustomer, setDeletingCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get contracts context
  // const { createAndAddContractFromCustomer } = useContracts();

  // Filter customers - only prospecting customers now
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getCustomerStats = () => {
    return prospectingStatuses.map((status) => ({
      ...status,
      count: customers.filter((c) => c.status === status.id).length,
    }));
  };

  const handleStatClick = (statusId: string) => {
    // Toggle filter: if already filtering by this status, clear filter; otherwise set filter
    setStatusFilter(statusFilter === statusId ? "all" : statusId);
  };

  const handleAddCustomer = (customerData: {
    name: string;
    source: string;
    status: string;
    note?: string;
  }) => {
    const now = new Date();
    const newCustomer = {
      id: Date.now(),
      name: customerData.name,
      email: "",
      phone: "",
      address: "",
      status: customerData.status,
      avatar: "/api/placeholder/60/60",
      weddingDate: "",
      budget: "0",
      source: customerData.source,
      assignedTo: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
      lastContact: now.toISOString(),
      priority: "medium",
      notes: [
        {
          id: Date.now(),
          content:
            customerData.note ||
            `Khách hàng mới được thêm từ nguồn ${customerData.source}`,
          author: "System",
          timestamp: now.toLocaleString("vi-VN"),
          type: "note",
        },
      ],
    };

    // Add to customers state to trigger re-render
    setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
  };

  const handleAddNote = (noteData: { content: string; type: string }) => {
    if (!selectedCustomer) return;

    const note = {
      id: Date.now(),
      content: noteData.content,
      author: "Current User",
      timestamp: new Date().toLocaleString("vi-VN"),
      type: noteData.type,
    };

    // Update both the selected customer and the customers list
    const updatedCustomer = {
      ...selectedCustomer,
      notes: [...selectedCustomer.notes, note],
    };

    setSelectedCustomer(updatedCustomer);
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === selectedCustomer.id ? updatedCustomer : customer
      )
    );

    // Generate new summary after adding note (will be triggered by CustomerDialog)
    console.log(
      "Added new note to customer",
      selectedCustomer.name,
      "- note:",
      note.content
    );
  };

  const handleEditCustomer = (updatedCustomer: any) => {
    // Add edit note to customer history
    const editNote = {
      id: Date.now(),
      content: "Thông tin khách hàng đã được cập nhật",
      author: "Current User",
      timestamp: new Date().toLocaleString("vi-VN"),
      type: "system",
    };

    const customerWithNote = {
      ...updatedCustomer,
      notes: [...updatedCustomer.notes, editNote],
    };

    // Update customer in state
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? customerWithNote : customer
      )
    );
  };

  const handleMoveToContract = (
    customer: any,
    contractData: {
      value: string;
      date: string;
      contractName: string;
      weddingDate: string;
      package: string;
      image?: string;
      note?: string;
    }
  ) => {
    let updatedCustomer = customer;

    // Only add note if there's actually a note from the user
    if (contractData.note && contractData.note.trim()) {
      const contractNote = {
        id: Date.now(),
        content: contractData.note.trim(), // Remove the "Tạo hợp đồng:" prefix
        author: "Current User",
        timestamp: new Date().toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        type: "note", // Change from "contract" to "note"
      };

      updatedCustomer = {
        ...customer,
        notes: [...customer.notes, contractNote],
      };

      console.log(
        `Đã thêm ghi chú tùy chọn vào lịch sử khách hàng ${customer.name}:`,
        contractData.note
      );
    }

    // Remove from customers state
    setCustomers((prevCustomers) =>
      prevCustomers.filter((c) => c.id !== customer.id)
    );

    // Create new contract using context with updated customer data
    // const newContract = createAndAddContractFromCustomer(
    //   updatedCustomer,
    //   contractData
    // );

    // Show success notification (in real app, would use toast)
    // console.log(
    //   `Đã tạo hợp đồng ${newContract.contractNumber} cho khách hàng ${customer.name}`
    // );
    console.log(`Thông tin hợp đồng:`, {
      contractName: contractData.contractName,
      package: contractData.package,
      value: contractData.value,
      weddingDate: contractData.weddingDate,
      hasImage: !!contractData.image,
      hasNote: !!contractData.note,
      noteTransferred: !!contractData.note,
    });
  };

  const handleDeleteCustomer = (customer: any) => {
    // Remove from customers state
    setCustomers((prevCustomers) =>
      prevCustomers.filter((c) => c.id !== customer.id)
    );

    // Show success notification (in real app, would use toast)
    console.log(`Đã xóa khách hàng ${customer.name} khỏi hệ thống`);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
            CRM - Quản lý khách hàng
          </h1>
          <p className="text-slate-600 mt-1">
            Theo dõi khách hàng tiềm năng và chuyển đổi thành hợp đồng
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          {/* <AddCustomerDialog onAddCustomer={handleAddCustomer} /> */}
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {getCustomerStats().map((stat: any) => {
            const isActive = statusFilter === stat.id;
            const isClickable = !!handleStatClick;

            return (
              <div
                key={stat.id}
                className={`text-center p-2 sm:p-3 rounded-lg border backdrop-blur-sm transition-all duration-200 ${
                  isClickable ? "cursor-pointer touch-manipulation" : ""
                } ${
                  isActive
                    ? "bg-blue-50 border-blue-200 ring-2 ring-blue-200/50 transform scale-[1.02]"
                    : "bg-white/50 border-stone-200/60 hover:bg-white/70 hover:border-stone-300/70"
                }`}
                onClick={() => handleStatClick?.(stat.id)}
                title={
                  isClickable ? `Click để lọc theo ${stat.label}` : undefined
                }
              >
                <p
                  className={`text-lg sm:text-xl font-bold transition-colors ${
                    isActive ? "text-blue-700" : "text-slate-900"
                  }`}
                >
                  {stat.count}
                </p>
                <p
                  className={`text-xs truncate transition-colors ${
                    isActive ? "text-blue-600" : "text-slate-600"
                  }`}
                >
                  {stat.label}
                </p>
                {isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1 animate-pulse"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card">
        <div className="mobile-card">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative flex-2 min-w-[150px]">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#94a3b8] group-focus:text-black" />
                <input
                  type="text"
                  placeholder="Tìm kiếm bot, tài khoản hoặc chiến lược..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-slate-300 px-10 py-5.5 text-md placeholder:text-[#94a3b8] outline-none bg-transparent hover:border-slate-400 focus:border-slate-400 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] search-compact touch-manipulation">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {prospectingStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}

              {statusFilter !== "all" && (
                <button
                  onClick={() => setStatusFilter("all")}
                  className="px-3 h-10 text-xs border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 touch-manipulation whitespace-nowrap"
                  title="Xóa bộ lọc"
                >
                  Xóa lọc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card glass-card">
        <div className="[&:last-child]:pb-6 mobile-card p-0 overflow-hidden">
          <div className="w-full overflow-x-hidden">
            <CustomerTable
              customers={filteredCustomers}
              onSelectCustomer={setSelectedCustomer}
              onEditCustomer={setEditingCustomer}
              // onMoveToContract={setMovingToContractCustomer}
              onDeleteCustomer={setDeletingCustomer}
              selectedTab="prospecting"
            />
          </div>
        </div>
      </div>

      {/* Customer Detail Dialog */}
      {/* <CustomerDialog
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        onAddNote={handleAddNote}
        statusOptions={prospectingStatuses}
      /> */}

      {/* Edit Customer Dialog */}
      {/* <EditCustomerDialog
        customer={editingCustomer}
        onClose={() => setEditingCustomer(null)}
        onSave={handleEditCustomer}
        statusOptions={prospectingStatuses}
      /> */}

      {/* Move To Contract Dialog */}
      {/* <MoveToContractDialog
        customer={movingToContractCustomer}
        onClose={() => setMovingToContractCustomer(null)}
        onMoveToContract={handleMoveToContract}
      /> */}

      {/* Delete Customer Dialog */}
      {/* <DeleteCustomerDialog
        customer={deletingCustomer}
        onClose={() => setDeletingCustomer(null)}
        onDeleteCustomer={handleDeleteCustomer}
      /> */}
    </div>
  );
}
