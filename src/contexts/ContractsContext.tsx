/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Contract, NoteHistory } from "@/types";
// import { updateContractWithAISummary } from "./aiWebhookService";

interface ContractsContextType {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  createAndAddContractFromCustomer: (
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
  ) => Contract;
  updateContract: (id: number, updates: Partial<Contract>) => void;
  deleteContract: (id: number) => void;
}

const ContractsContext = createContext<ContractsContextType | undefined>(
  undefined
);

const contractsData: Contract[] = [
  {
    id: 1,
    contractNumber: "WS2025001",
    couple: "Minh Anh & Tuấn Khang",
    package: "Premium Wedding",
    totalAmount: 45000000,
    paidAmount: 22500000,
    remainingAmount: 22500000,
    progress: 50,
    signedDate: "2025-01-10",
    weddingDate: "2025-03-15",
    status: "scheduled",
    services: [
      "Chụp ảnh cưới (200 ảnh đã chỉnh sửa)",
      "Album cưới cao cấp",
      "Ảnh phóng to 20x30 (5 ảnh)",
      "USB chứa toàn bộ ảnh gốc",
      "Makeup và làm tóc cô dâu",
    ],
    additionalServices: [
      {
        id: 1,
        name: "Chụp thêm 50 ảnh outdoor",
        description:
          "Chụp thêm 50 ảnh tại công viên Tao Đàn với concept mùa xuân",
        price: 5000000,
        addedDate: "2025-01-15",
      },
      {
        id: 2,
        name: "Video highlight 3 phút",
        description: "Video tóm tắt buổi chụp với nhạc nền lãng mạn",
        price: 3000000,
        addedDate: "2025-01-18",
      },
    ],
    paymentSchedule: [
      {
        phase: "Ký hợp đồng",
        amount: 22500000,
        dueDate: "2025-01-10",
        status: "paid",
        paidDate: "2025-01-10",
      },
      {
        phase: "Trước buổi chụp 1 tuần",
        amount: 13500000,
        dueDate: "2025-02-15",
        status: "pending",
      },
      {
        phase: "Giao album",
        amount: 9000000,
        dueDate: "2025-03-30",
        status: "pending",
      },
    ],
    customerName: "Minh Anh",
    customerEmail: "minhanh@email.com",
    customerPhone: "0901234567",
    customerAddress: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
    assignedTo: "Nguyễn Văn An",
    source: "Facebook",
    note: "Khách hàng ưu tiên phong cách vintage, muốn chụp ảnh vào lúc hoàng hôn. Đã confirm địa điểm chụp tại Landmark 81 và Dinh Độc Lập.",
    noteHistory: [
      {
        id: 1,
        content:
          "Khách hàng quan tâm gói Premium, cần báo giá chi tiết cho album 200 ảnh",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-14 10:30",
        type: "note",
        source: "crm",
      },
      {
        id: 2,
        content:
          "Đã gửi báo giá qua email. Khách hàng sẽ phản hồi trong tuần này",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-14 15:45",
        type: "action",
        source: "crm",
      },
      {
        id: 3,
        content:
          "Khách hàng đồng ý ký hợp đồng gói Premium. Tạo hợp đồng WS2025001",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-16 09:15",
        type: "contract",
        source: "contract",
      },
      {
        id: 4,
        content:
          "Đã confirm địa điểm chụp và thời gian. Khách hàng muốn phong cách vintage",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-16 14:30",
        type: "note",
        source: "contract",
      },
    ],
    appointment: {
      date: "2025-03-15",
      time: "14:00",
      location: "Landmark 81 và Dinh Độc Lập",
      photographer: "Nguyễn Văn Photographer",
      notes: "Phong cách vintage, chụp vào lúc hoàng hôn",
      contractId: 1,
      createdAt: "2025-01-10T10:00:00.000Z",
    },
    originalImagesUrl: "https://drive.google.com/drive/folders/example1",
    statusHistory: [
      {
        from: "waiting_schedule",
        to: "scheduled",
        timestamp: "2025-01-10T10:00:00.000Z",
        data: {
          shootingDate: "2025-03-15",
          shootingTime: "14:00",
          location: "Landmark 81 và Dinh Độc Lập",
          photographer: "Nguyễn Văn Photographer",
        },
      },
    ],
  },
  {
    id: 2,
    contractNumber: "WS2025002",
    couple: "Thu Hà & Đức Nam",
    package: "Classic Wedding",
    totalAmount: 25000000,
    paidAmount: 25000000,
    remainingAmount: 0,
    progress: 100,
    signedDate: "2024-12-20",
    weddingDate: "2025-01-20",
    status: "completed",
    services: [
      "Chụp ảnh cưới (150 ảnh đã chỉnh sửa)",
      "Album cưới tiêu chuẩn",
      "USB chứa toàn bộ ảnh gốc",
    ],
    paymentSchedule: [
      {
        phase: "Ký hợp đồng",
        amount: 12500000,
        dueDate: "2024-12-20",
        status: "paid",
        paidDate: "2024-12-20",
      },
      {
        phase: "Giao album",
        amount: 12500000,
        dueDate: "2025-01-25",
        status: "paid",
        paidDate: "2025-01-25",
      },
    ],
    customerName: "Thu Hà",
    customerEmail: "ha.thu@gmail.com",
    customerPhone: "0912345678",
    customerAddress: "45 Phố Hàng Bài, Hoàn Kiếm, Hà Nội",
    assignedTo: "Trần Thị Bình",
    source: "Website",
    note: "Đã hoàn thành xuất sắc! Khách hàng rất hài lòng với chất lượng album và dịch vụ. Sẽ giới thiệu thêm bạn bè.",
    noteHistory: [
      {
        id: 5,
        content: "Khách hàng mới từ website, quan tâm package cơ bản",
        author: "Trần Thị Bình",
        timestamp: "2024-12-12 14:20",
        type: "note",
        source: "crm",
      },
      {
        id: 6,
        content: "Khách hàng đồng ý ký hợp đồng Classic Wedding",
        author: "Trần Thị Bình",
        timestamp: "2024-12-20 10:00",
        type: "contract",
        source: "contract",
      },
      {
        id: 7,
        content: "Hoàn thành chụp ảnh và giao album. Khách hàng rất hài lòng",
        author: "Trần Thị Bình",
        timestamp: "2025-01-25 16:00",
        type: "note",
        source: "contract",
      },
    ],
    completion: {
      deliveryMethod: "drive",
      deliveryDate: "2025-01-25",
      customerFeedback:
        "Rất hài lòng với chất lượng và dịch vụ. Sẽ giới thiệu cho bạn bè.",
      completedAt: "2025-01-25T16:00:00.000Z",
    },
    retouchImagesUrl: "https://drive.google.com/drive/folders/example2-retouch",
    statusHistory: [
      {
        from: "waiting_schedule",
        to: "scheduled",
        timestamp: "2024-12-20T10:00:00.000Z",
        data: {
          shootingDate: "2025-01-20",
          shootingTime: "09:00",
          location: "Công viên Thủ Lệ, Hà Nội",
        },
      },
      {
        from: "scheduled",
        to: "retouch",
        timestamp: "2025-01-20T18:00:00.000Z",
        data: {
          retouchType: "basic",
          estimatedDays: 5,
        },
      },
      {
        from: "retouch",
        to: "handover",
        timestamp: "2025-01-24T14:00:00.000Z",
        data: {
          readyDate: "2025-01-24",
          deliveryMethod: "drive",
          notes: "Retouch hoàn tất, sản phẩm sẵn sàng giao khách",
        },
      },
      {
        from: "handover",
        to: "completed",
        timestamp: "2025-01-25T16:00:00.000Z",
        data: {
          deliveryMethod: "drive",
          deliveryDate: "2025-01-25",
          customerFeedback: "Rất hài lòng với chất lượng và dịch vụ",
        },
      },
    ],
  },
  {
    id: 3,
    contractNumber: "WS2025003",
    couple: "Lan Phương & Việt Anh",
    package: "Luxury Wedding",
    totalAmount: 75000000,
    paidAmount: 15000000,
    remainingAmount: 60000000,
    progress: 20,
    signedDate: "2025-01-08",
    weddingDate: "2025-04-12",
    status: "handover",
    services: [
      "Chụp ảnh cưới (300 ảnh đã chỉnh sửa)",
      "Video cưới cinematic",
      "Album cưới luxury",
      "Ảnh phóng to 30x45 (10 ảnh)",
      "USB chứa toàn bộ ảnh gốc và video",
      "Makeup và làm tóc cô dâu",
      "2 bộ váy cưới",
    ],
    additionalServices: [
      {
        id: 3,
        name: "Drone quay flycam",
        description: "Quay video từ trên cao bằng flycam chuyên nghiệp",
        price: 8000000,
        addedDate: "2025-01-12",
      },
    ],
    paymentSchedule: [
      {
        phase: "Ký hợp đồng",
        amount: 15000000,
        dueDate: "2025-01-08",
        status: "paid",
        paidDate: "2025-01-08",
      },
      {
        phase: "Trước buổi chụp 2 tuần",
        amount: 30000000,
        dueDate: "2025-03-29",
        status: "pending",
      },
      {
        phase: "Sau buổi chụp",
        amount: 22500000,
        dueDate: "2025-04-19",
        status: "pending",
      },
      {
        phase: "Giao album",
        amount: 7500000,
        dueDate: "2025-05-12",
        status: "pending",
      },
    ],
    customerName: "Lan Phương",
    customerEmail: "phuong.lan@email.com",
    customerPhone: "0934567890",
    customerAddress: "789 Đường Nguyễn Văn Linh, Quận 7, TP.HCM",
    assignedTo: "Phạm Thu Hà",
    source: "Instagram",
    note: "Khách VIP, yêu cầu cao về chất lượng. Muốn có video drone và phong cách hiện đại. Cần chuẩn bị kỹ lưỡng cho buổi chụp.",
    noteHistory: [
      {
        id: 8,
        content: "Liên hệ qua Instagram, quan tâm chụp ảnh cưới mùa xuân",
        author: "Phạm Thu Hà",
        timestamp: "2024-12-15 13:45",
        type: "note",
        source: "crm",
      },
      {
        id: 9,
        content:
          "Khách hàng VIP, yêu cầu cao. Quan tâm gói Luxury với video drone",
        author: "Phạm Thu Hà",
        timestamp: "2024-12-20 11:30",
        type: "note",
        source: "crm",
      },
      {
        id: 10,
        content: "Tạo hợp đồng Luxury Wedding cho khách VIP",
        author: "Phạm Thu Hà",
        timestamp: "2025-01-08 09:00",
        type: "contract",
        source: "contract",
      },
    ],
    appointment: {
      date: "2025-04-12",
      time: "07:00",
      location: "Đà Lạt - Multiple locations",
      photographer: "Lê Văn Photographer",
      notes: "Luxury shoot với drone, cần team full và thiết bị chuyên nghiệp",
      contractId: 3,
      createdAt: "2025-01-08T09:30:00.000Z",
    },
    retouchProject: {
      type: "premium",
      estimatedDays: 14,
      specialRequests: "Premium retouch với cinematic color grading cho video",
      contractId: 3,
      startDate: "2025-04-12T18:00:00.000Z",
      status: "completed",
    },
    handover: {
      readyDate: "2025-04-26",
      deliveryMethod: "drive",
      notes:
        "Đã hoàn thành retouch premium với cinematic grading. Sản phẩm sẵn sàng bàn giao.",
      handoverAt: "2025-04-26T16:00:00.000Z",
    },
    originalImagesUrl:
      "https://drive.google.com/drive/folders/example3-original",
    statusHistory: [
      {
        from: "waiting_schedule",
        to: "scheduled",
        timestamp: "2025-01-08T09:30:00.000Z",
        data: {
          shootingDate: "2025-04-12",
          shootingTime: "07:00",
          location: "Đà Lạt - Multiple locations",
          photographer: "Lê Văn Photographer",
        },
      },
      {
        from: "scheduled",
        to: "retouch",
        timestamp: "2025-04-12T18:00:00.000Z",
        data: {
          retouchType: "premium",
          estimatedDays: 14,
          specialRequests:
            "Premium retouch với cinematic color grading cho video",
        },
      },
      {
        from: "retouch",
        to: "handover",
        timestamp: "2025-04-26T16:00:00.000Z",
        data: {
          readyDate: "2025-04-26",
          deliveryMethod: "drive",
          notes: "Đã hoàn thành retouch premium với cinematic grading",
        },
      },
    ],
  },
  {
    id: 4,
    contractNumber: "WS2025004",
    couple: "Hoài An & Minh Tú",
    package: "Standard Wedding",
    totalAmount: 35000000,
    paidAmount: 10500000,
    remainingAmount: 24500000,
    progress: 30,
    signedDate: "2025-01-20",
    weddingDate: "2025-05-18",
    status: "waiting_schedule",
    services: [
      "Chụp ảnh cưới (150 ảnh đã chỉnh sửa)",
      "Album cưới tiêu chuẩn",
      "Ảnh phóng to 20x30 (3 ảnh)",
      "USB chứa toàn bộ ảnh gốc",
    ],
    paymentSchedule: [
      {
        phase: "Ký hợp đồng",
        amount: 10500000,
        dueDate: "2025-01-20",
        status: "paid",
        paidDate: "2025-01-20",
      },
      {
        phase: "Trước buổi chụp 1 tuần",
        amount: 14000000,
        dueDate: "2025-05-11",
        status: "pending",
      },
      {
        phase: "Giao album",
        amount: 10500000,
        dueDate: "2025-06-18",
        status: "pending",
      },
    ],
    customerName: "Hoài An",
    customerEmail: "hoaian@email.com",
    customerPhone: "0945678901",
    customerAddress: "456 Đường Lê Lợi, Quận 3, TP.HCM",
    assignedTo: "Nguyễn Văn An",
    source: "Referral",
    note: "Khách hàng được giới thiệu từ Thu Hà & Đức Nam. Muốn có phong cách tự nhiên, không quá cầu kỳ.",
    noteHistory: [
      {
        id: 11,
        content: "Khách hàng được giới thiệu từ Thu Hà, quan tâm gói Standard",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-18 16:20",
        type: "note",
        source: "crm",
      },
      {
        id: 12,
        content:
          "Tạo hợp đồng Standard Wedding. Khách hàng muốn phong cách tự nhiên",
        author: "Nguyễn Văn An",
        timestamp: "2025-01-20 14:00",
        type: "contract",
        source: "contract",
      },
    ],
  },
  {
    id: 5,
    contractNumber: "WS2025005",
    couple: "Thanh Hương & Quang Minh",
    package: "Basic Wedding",
    totalAmount: 20000000,
    paidAmount: 6000000,
    remainingAmount: 14000000,
    progress: 30,
    signedDate: "2025-01-25",
    weddingDate: "2025-06-22",
    status: "cancelled",
    services: [
      "Chụp ảnh cưới (100 ảnh đã chỉnh sửa)",
      "Album cưới tiêu chuẩn",
      "USB chứa toàn bộ ảnh gốc",
    ],
    paymentSchedule: [
      {
        phase: "Ký hợp đồng",
        amount: 6000000,
        dueDate: "2025-01-25",
        status: "paid",
        paidDate: "2025-01-25",
      },
      {
        phase: "Trước buổi chụp 1 tuần",
        amount: 8000000,
        dueDate: "2025-06-15",
        status: "pending",
      },
      {
        phase: "Giao album",
        amount: 6000000,
        dueDate: "2025-07-22",
        status: "pending",
      },
    ],
    customerName: "Thanh Hương",
    customerEmail: "huong.thanh@gmail.com",
    customerPhone: "0987654321",
    customerAddress: "789 Đường Hoàng Văn Thụ, Quận Tân Bình, TP.HCM",
    assignedTo: "Trần Thị Bình",
    source: "Google",
    note: "Đã hủy hợp đồng do thay đổi kế hoạch đám cưới. Hoàn lại 4,000,000 VNĐ cho khách hàng.",
    noteHistory: [
      {
        id: 13,
        content: "Khách hàng tìm thấy qua Google, budget hạn chế",
        author: "Trần Thị Bình",
        timestamp: "2025-01-22 11:15",
        type: "note",
        source: "crm",
      },
      {
        id: 14,
        content:
          "Tạo hợp đồng Basic Wedding. Khách hàng muốn tiết kiệm chi phí",
        author: "Trần Thị Bình",
        timestamp: "2025-01-25 09:30",
        type: "contract",
        source: "contract",
      },
      {
        id: 15,
        content:
          "Khách hàng yêu cầu hủy hợp đồng do thay đổi kế hoạch đám cưới",
        author: "Trần Thị Bình",
        timestamp: "2025-02-01 10:45",
        type: "action",
        source: "contract",
      },
    ],
    cancellation: {
      reason: "customer_request",
      refundAmount: 4000000,
      notes:
        "Khách hàng thay đổi kế hoạch đám cưới do hoàn cảnh gia đình. Hoàn lại 4 triệu theo chính sách hủy hợp đồng.",
      cancelledAt: "2025-02-01T10:45:00.000Z",
    },
    statusHistory: [
      {
        from: "waiting_schedule",
        to: "cancelled",
        timestamp: "2025-02-01T10:45:00.000Z",
        data: {
          cancellationReason: "customer_request",
          refundAmount: 4000000,
          cancellationNotes:
            "Khách hàng thay đổi kế hoạch đám cưới do hoàn cảnh gia đình",
        },
      },
    ],
  },
];

// Utility functions for contracts management
function generateContractNumber(): string {
  const year = new Date().getFullYear();
  const nextId = Math.max(...contractsData.map((c) => c.id)) + 1;
  return `WS${year}${nextId.toString().padStart(3, "0")}`;
}

// Package mapping
const packageMapping: { [key: string]: string } = {
  basic: "Gói cơ bản - Basic Wedding",
  standard: "Gói tiêu chuẩn - Standard Wedding",
  premium: "Gói cao cấp - Premium Wedding",
  luxury: "Gói sang trọng - Luxury Wedding",
  custom: "Gói tùy chỉnh - Custom Package",
};

// Service packages
const servicePackages: { [key: string]: string[] } = {
  basic: [
    "Chụp ảnh cưới (100 ảnh đã chỉnh sửa)",
    "Album cưới tiêu chuẩn",
    "USB chứa toàn bộ ảnh gốc",
  ],
  standard: [
    "Chụp ảnh cưới (150 ảnh đã chỉnh sửa)",
    "Album cưới tiêu chuẩn",
    "Ảnh phóng to 20x30 (3 ảnh)",
    "USB chứa toàn bộ ảnh gốc",
  ],
  premium: [
    "Chụp ảnh cưới (200 ảnh đã chỉnh sửa)",
    "Album cưới cao cấp",
    "Ảnh phóng to 20x30 (5 ảnh)",
    "USB chứa toàn bộ ảnh gốc",
    "Makeup và làm tóc cô dâu",
  ],
  luxury: [
    "Chụp ảnh cưới (300 ảnh đã chỉnh sửa)",
    "Video cưới cinematic",
    "Album cưới luxury",
    "Ảnh phóng to 30x45 (10 ảnh)",
    "USB chứa toàn bộ ảnh gốc và video",
    "Makeup và làm tóc cô dâu",
    "2 bộ váy cưới",
  ],
  custom: ["Dịch vụ tùy chỉnh theo yêu cầu khách hàng"],
};

export function ContractsProvider({ children }: { children: ReactNode }) {
  const [contracts, setContracts] = useState<Contract[]>(contractsData);

  // Di chuyển createContractFromCustomer vào đây như một function bên trong provider
  const createContractFromCustomer = useCallback(
    (
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
    ): Contract => {
      const contractValue = parseInt(contractData.value);
      const depositAmount = Math.floor(contractValue * 0.3); // 30% deposit

      // Transfer notes from CRM to contract noteHistory
      const noteHistory: NoteHistory[] = [];

      // Add CRM notes to history
      if (customer.notes && Array.isArray(customer.notes)) {
        customer.notes.forEach((note: any) => {
          noteHistory.push({
            id: note.id,
            content: note.content,
            author: note.author,
            timestamp: note.timestamp,
            type: note.type,
            source: "crm",
          });
        });
      }

      const newContract: Contract = {
        id: Date.now(),
        contractNumber: generateContractNumber(),
        couple: contractData.contractName,
        package: packageMapping[contractData.package] || contractData.package,
        totalAmount: contractValue,
        paidAmount: 0, // Set to 0 as requested - no payment made yet
        remainingAmount: contractValue, // Full amount remaining
        progress: 0, // 0% progress since no payment made
        signedDate: contractData.date,
        weddingDate: contractData.weddingDate || customer.weddingDate || "",
        status: "waiting_schedule",
        services:
          servicePackages[contractData.package] || servicePackages.custom,
        additionalServices: [], // Initialize empty additional services
        paymentSchedule: [
          {
            phase: "Ký hợp đồng",
            amount: depositAmount,
            dueDate: contractData.date,
            status: "pending", // Changed from "paid" to "pending"
            // Remove paidDate since no payment made yet
          },
          {
            phase: "Trước buổi chụp 1 tuần",
            amount: Math.floor(contractValue * 0.4),
            dueDate: new Date(
              new Date(contractData.date).getTime() + 30 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
            status: "pending",
          },
          {
            phase: "Giao album",
            amount: Math.floor(contractValue * 0.3),
            dueDate: new Date(
              new Date(contractData.date).getTime() + 60 * 24 * 60 * 60 * 1000
            )
              .toISOString()
              .split("T")[0],
            status: "pending",
          },
        ],
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        customerAddress: customer.address,
        assignedTo: customer.assignedTo,
        source: customer.source,
        contractImage: contractData.image,
        note: contractData.note,
        noteHistory: noteHistory,
        // Initialize AI summary status
        aiSummaryStatus: "pending",
      };
      return newContract;
    },
    []
  );

  const addContract = useCallback((contract: Contract) => {
    setContracts((prev) => [contract, ...prev]); // Add to beginning instead of end
  }, []);

  // Define updateContract first since it's used as dependency in createAndAddContractFromCustomer
  const updateContract = useCallback(
    (id: number, updates: Partial<Contract>) => {
      setContracts((prev) =>
        prev.map((contract) =>
          contract.id === id ? { ...contract, ...updates } : contract
        )
      );
    },
    []
  );

  const createAndAddContractFromCustomer = useCallback(
    (
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
      const newContract = createContractFromCustomer(customer, contractData);
      setContracts((prev) => [newContract, ...prev]); // Add to beginning instead of end

      console.log(
        `📋 Creating contract ${newContract.contractNumber} for customer ${customer.name}`
      );
      console.log(`📊 Contract data:`, {
        contractNumber: newContract.contractNumber,
        hasNoteHistory: !!(
          newContract.noteHistory && newContract.noteHistory.length > 0
        ),
        noteHistoryCount: newContract.noteHistory?.length || 0,
        hasUserNote: !!(contractData.note && contractData.note.trim()),
        userNote: contractData.note,
        package: contractData.package,
        source: customer.source,
      });

      // Always trigger AI summary generation for new contracts
      // AI will determine if there's enough data to create a meaningful summary
      console.log(
        `🚀 Triggering AI summary for contract ${newContract.contractNumber}`
      );

      // Set initial AI status to pending
      updateContract(newContract.id, {
        aiSummaryStatus: "pending",
      });

      //   // Use setTimeout to avoid blocking the UI and allow state update
      //   setTimeout(() => {
      //     updateContractWithAISummary(newContract, updateContract);
      //   }, 500); // Increased delay to ensure state is updated

      return newContract;
    },
    [createContractFromCustomer, updateContract]
  );

  const deleteContract = useCallback((id: number) => {
    setContracts((prev) => prev.filter((contract) => contract.id !== id));
  }, []);

  const value: ContractsContextType = {
    contracts,
    addContract,
    createAndAddContractFromCustomer,
    updateContract,
    deleteContract,
  };

  return (
    <ContractsContext.Provider value={value}>
      {children}
    </ContractsContext.Provider>
  );
}
export function useContracts() {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider");
  }
  return context;
}
