"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useContracts } from "./ContractsContext";
import { Appointment } from "@/types";

interface AppointmentsContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: number, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: number) => void;
  getAppointmentByContractId: (contractId: number) => Appointment | undefined;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(
  undefined
);

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: 1,
    contractId: 1,
    contractNumber: "WS2025001",
    couple: "Minh Anh & Tuấn Khang",
    date: "2025-03-15",
    time: "14:00",
    location: "Landmark 81 và Dinh Độc Lập",
    package: "Premium Wedding",
    status: "confirmed",
    createdAt: "2025-01-10T10:00:00.000Z",
    photographer: "Nguyễn Văn Photographer",
    assistant: "Trần Thị Assistant",
    makeup: "Lê Thị Makeup",
    equipment: ["Camera Canon R5", "Lens 85mm", "Flash Godox", "Tripod"],
    notes:
      "Phong cách vintage, chụp vào lúc hoàng hôn. Chuẩn bị đèn flash backup.",
    confirmedAt: "2025-01-12T09:30:00.000Z",
    clientNotes:
      "Khách hàng xác nhận sẽ có mặt đúng giờ. Muốn chụp ở tầng thượng Landmark 81.",
    duration: 4,
    totalAmount: 45000000,
    customerPhone: "0901234567",
    customerEmail: "minhanh@email.com",
    statusHistory: [
      {
        from: "staff_assignment",
        to: "waiting_confirmation",
        timestamp: "2025-01-11T15:00:00.000Z",
        data: {
          photographer: "Nguyễn Văn Photographer",
          assistant: "Trần Thị Assistant",
        },
      },
      {
        from: "waiting_confirmation",
        to: "confirmed",
        timestamp: "2025-01-12T09:30:00.000Z",
        data: {
          clientNotes: "Khách hàng xác nhận sẽ có mặt đúng giờ",
        },
      },
    ],
  },
  {
    id: 2,
    contractId: 4,
    contractNumber: "WS2025004",
    couple: "Hoài An & Minh Tú",
    date: "2025-05-18",
    time: "08:00",
    location: "Công viên Tao Đàn",
    package: "Standard Wedding",
    status: "staff_assignment",
    createdAt: "2025-01-20T14:00:00.000Z",
    duration: 3,
    totalAmount: 35000000,
    customerPhone: "0945678901",
    customerEmail: "hoaian@email.com",
    notes:
      "Khách hàng muốn phong cách tự nhiên, không quá cầu kỳ. Ưu tiên chụp sáng sớm.",
  },
  {
    id: 3,
    contractId: 3,
    contractNumber: "WS2025003",
    couple: "Lan Phương & Việt Anh",
    date: "2025-04-12",
    time: "07:00",
    location: "Đà Lạt - Multiple locations",
    package: "Luxury Wedding",
    status: "shooting",
    createdAt: "2025-01-08T09:30:00.000Z",
    photographer: "Lê Văn Photographer",
    assistant: "Phạm Thị Assistant",
    makeup: "Nguyễn Thị Makeup",
    equipment: [
      "Canon R6 Mark II",
      "Drone DJI Air 3",
      "Gimbal Ronin",
      "Lighting Kit",
    ],
    notes: "Luxury shoot với drone, cần team full và thiết bị chuyên nghiệp",
    confirmedAt: "2025-01-10T11:00:00.000Z",
    clientNotes:
      "Khách VIP, yêu cầu cao về chất lượng. Đặc biệt chú ý việc quay drone.",
    duration: 8,
    totalAmount: 75000000,
    customerPhone: "0934567890",
    customerEmail: "phuong.lan@email.com",
    statusHistory: [
      {
        from: "staff_assignment",
        to: "waiting_confirmation",
        timestamp: "2025-01-09T10:00:00.000Z",
        data: {
          photographer: "Lê Văn Photographer",
          makeup: "Nguyễn Thị Makeup",
        },
      },
      {
        from: "waiting_confirmation",
        to: "confirmed",
        timestamp: "2025-01-10T11:00:00.000Z",
        data: {
          clientNotes: "Khách VIP, yêu cầu cao về chất lượng",
        },
      },
      {
        from: "confirmed",
        to: "shooting",
        timestamp: "2025-04-12T07:00:00.000Z",
        data: {
          autoTransition: true,
          reason: "Đến ngày chụp, tự động chuyển trạng thái",
        },
      },
    ],
  },
];

export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const { updateContract } = useContracts();

  const addAppointment = useCallback((appointment: Appointment) => {
    setAppointments((prev) => [appointment, ...prev]);
  }, []);

  const updateAppointment = useCallback(
    async (id: number, updates: Partial<Appointment>) => {
      const appointment = appointments.find((a) => a.id === id);
      if (!appointment) return;

      // Handle status transition to 'completed' - auto sync with contracts
      if (updates.status === "completed" && appointment.status === "shooting") {
        try {
          // Update appointment first
          setAppointments((prev) =>
            prev.map((app) =>
              app.id === id
                ? {
                    ...app,
                    ...updates,
                    completedAt: new Date().toISOString(),
                    statusHistory: [
                      ...(app.statusHistory || []),
                      {
                        from: appointment.status,
                        to: "completed",
                        timestamp: new Date().toISOString(),
                        data: updates,
                      },
                    ],
                  }
                : app
            )
          );

          // Auto-transition contract from 'scheduled' to 'retouch'
          if (updates.originalImagesUrl) {
            await updateContract(appointment.contractId, {
              status: "retouch",
              originalImagesUrl: updates.originalImagesUrl,
              retouchProject: {
                type: "basic",
                estimatedDays: 7,
                specialRequests: `Tự động tạo từ lịch chụp hoàn thành. ${
                  updates.shootingNotes || ""
                }`,
                contractId: appointment.contractId,
                startDate: new Date().toISOString(),
                status: "in_progress",
              },
              statusHistory: [
                {
                  from: "scheduled",
                  to: "retouch",
                  timestamp: new Date().toISOString(),
                  data: {
                    autoTransition: true,
                    source: "appointment_completion",
                    appointmentId: id,
                    originalImagesUrl: updates.originalImagesUrl,
                  },
                },
              ],
            });

            // toast.success(
            //   `Lịch chụp hoàn thành! Hợp đồng ${appointment.contractNumber} đã tự động chuyển sang trạng thái Retouch`,
            //   {
            //     description: `Link ảnh gốc: ${updates.originalImagesUrl}`,
            //   }
            // );
          }
        } catch (error) {
          console.error(
            "Error syncing appointment completion with contract:",
            error
          );
          // toast.error("Lỗi đồng bộ với hợp đồng. Vui lòng kiểm tra lại.");
        }
      } else {
        // Normal update without auto-sync
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === id
              ? {
                  ...app,
                  ...updates,
                  statusHistory:
                    updates.status && updates.status !== appointment.status
                      ? [
                          ...(app.statusHistory || []),
                          {
                            from: appointment.status,
                            to: updates.status,
                            timestamp: new Date().toISOString(),
                            data: updates,
                          },
                        ]
                      : app.statusHistory,
                }
              : app
          )
        );
      }
    },
    [appointments, updateContract]
  );

  const deleteAppointment = useCallback((id: number) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
  }, []);

  const getAppointmentByContractId = useCallback(
    (contractId: number) => {
      return appointments.find(
        (appointment) => appointment.contractId === contractId
      );
    },
    [appointments]
  );

  const value: AppointmentsContextType = {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentByContractId,
  };

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  );
}

export function useAppointments() {
  const context = useContext(AppointmentsContext);
  if (context === undefined) {
    throw new Error(
      "useAppointments must be used within an AppointmentsProvider"
    );
  }
  return context;
}
