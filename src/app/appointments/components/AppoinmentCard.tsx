/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState, type ComponentType } from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
  LayoutGroup,
} from "framer-motion";
import {
  Calendar,
  Camera,
  Clock,
  Edit,
  Eye,
  MapPin,
  User,
  Users,
  UserCheck,
} from "lucide-react";
import { Appointment } from "@/types";
import StatusChangeDialog from "./StatusChangeDialog";

// ===== Types =====
export type TabKey = "overview" | "staff" | "customer";
export type IconType = ComponentType<{ className?: string }>;

export type StatusCfg = {
  label: string;
  color: string; // Tailwind classes cho badge
  icon: IconType;
  description: string;
};

export type AppointmentStatus =
  | "staff_assignment"
  | "waiting_confirmation"
  | "confirmed"
  | "shooting"
  | "completed";

export type AppointmentCardProps = {
  appointment: Appointment;
  getStatusConfig: (s: AppointmentStatus) => StatusCfg;
  getAvailableTransitions: (s: AppointmentStatus) => AppointmentStatus[];
  onStatusChange: (a: Appointment, s: AppointmentStatus) => void;
  onViewClick?: (a: Appointment) => void;
  onEditClick?: (a: Appointment) => void;
};

// Tab definitions
const TABS: Array<{
  key: TabKey;
  label: string;
  short: string;
  Icon: IconType;
}> = [
  { key: "overview", label: "Tổng quan", short: "T.quan", Icon: Calendar },
  { key: "staff", label: "Nhân sự", short: "NS", Icon: Users },
  { key: "customer", label: "Khách hàng", short: "KH", Icon: User },
];

// Panel animation variants (directional)
const panelVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir * 24,
    filter: "blur(2px)",
  }),
  center: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.18 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: -dir * 24,
    filter: "blur(2px)",
    transition: { duration: 0.12 },
  }),
};

export default function AppointmentCard({
  appointment,
  getStatusConfig,
  getAvailableTransitions,
  onStatusChange,
  onViewClick,
  onEditClick,
}: AppointmentCardProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [isStatusChangeOpen, setIsStatusChangeOpen] = useState(false);
  const [targetStatus, setTargetStatus] =
    useState<AppointmentStatus>("staff_assignment");
  const [selectedAppointmentForStatus, setSelectedAppointmentForStatus] =
    useState<Appointment | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const prefersReducedMotion = useReducedMotion();

  const statusCfg = getStatusConfig(appointment.status);
  const availableTransitions = getAvailableTransitions(appointment.status);

  const handleStatusChange = (
    appointment: Appointment,
    newStatus: AppointmentStatus
  ) => {
    setSelectedAppointmentForStatus(appointment);
    setTargetStatus(newStatus);
    setIsStatusChangeOpen(true);
  };

  const handleStatusChangeConfirm = async (data: any) => {
    if (!selectedAppointmentForStatus) return;

    try {
      // Build update object based on status
      const updates: any = {
        status: data.status,
      };

      if (data.status === "waiting_confirmation") {
        updates.photographer = data.statusData.photographer;
        updates.assistant =
          data.statusData.assistant === "none" ? "" : data.statusData.assistant;
        updates.makeup =
          data.statusData.makeup === "none" ? "" : data.statusData.makeup;
        updates.equipment = data.statusData.equipment
          ? data.statusData.equipment.split(", ")
          : [];
        updates.dressCode = data.statusData.dressCode;
        updates.notes = data.statusData.notes;
      } else if (data.status === "confirmed") {
        updates.confirmedAt = data.timestamp;
        updates.clientNotes = data.statusData.clientNotes;
      } else if (data.status === "completed") {
        updates.completedAt = data.timestamp;
        updates.originalImagesUrl = data.statusData.originalImagesUrl;
        updates.shotCount = data.statusData.shotCount
          ? parseInt(data.statusData.shotCount)
          : undefined;
        updates.shootingNotes = data.statusData.shootingNotes;
      }

      // Update appointment - this will trigger auto contract sync if completing
      // await updateAppointment(selectedAppointmentForStatus.id, updates);

      // toast.success(
      //   `Đã cập nhật trạng thái lịch hẹn thành "${
      //     getStatusConfig(data.status).label
      //   }"`
      // );
    } catch (error) {
      console.error("Error updating appointment status:", error);
      // toast.error("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const tabIndex = useMemo(
    () =>
      TABS.reduce<Record<TabKey, number>>(
        (acc, t, i) => ({ ...acc, [t.key]: i }),
        {
          overview: 0,
          staff: 1,
          customer: 2,
        }
      ),
    []
  );

  const switchTab = (key: TabKey) => {
    setDirection(tabIndex[key] > tabIndex[activeTab] ? 1 : -1);
    setActiveTab(key);
  };

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 32,
        mass: 0.8,
      }}
      reducedMotion={prefersReducedMotion ? "always" : "never"}
    >
      <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-l-4 border-l-blue-500">
        <div className="px-6 [&:last-child]:pb-6 mobile-card">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <h3 className="text-slate-900">{appointment.couple}</h3>
                <span
                  className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[box-shadow] ${statusCfg.color}`}
                  title={statusCfg.description}
                >
                  {statusCfg.label}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-600">
                <span className="text-xs sm:text-sm">
                  #{appointment.contractNumber}
                </span>
                {appointment.date && (
                  <span className="flex items-center gap-1 text-xs sm:text-sm">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {appointment.date} {appointment.time}
                  </span>
                )}
                {appointment.location && (
                  <span className="flex items-center gap-1 text-xs sm:text-sm">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    {appointment.location}
                  </span>
                )}
              </div>
            </div>

            {/* Status Actions */}
            <div className="flex flex-wrap gap-2">
              {availableTransitions.map((next) => {
                const cfg = getStatusConfig(next);
                return (
                  <button
                    key={next}
                    onClick={() => handleStatusChange(appointment, next)}
                    className={`inline-flex items-center justify-center font-medium transition-all border rounded-md gap-1.5 glass text-sm h-8 px-2 hover:bg-slate-100/50 cursor-pointer ${cfg.color}`}
                  >
                    <cfg.icon className="w-4 h-4 mr-1" />
                    {cfg.label}
                  </button>
                );
              })}

              <button
                onClick={() => onViewClick?.(appointment)}
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all border rounded-md gap-1.5 glass text-sm h-8 px-2 hover:bg-slate-100/50 cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-1" />
                Chi tiết
              </button>

              <button
                onClick={() => onEditClick?.(appointment)}
                className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all border rounded-md gap-1.5 glass text-sm h-8 px-2 hover:bg-slate-100/50 cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-1" />
                Sửa
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-col gap-4">
            {/* Tabs header with animated pill */}
            <LayoutGroup id="tabs">
              <div
                aria-label="Chi tiết lịch hẹn"
                className="relative grid grid-cols-3 rounded-2xl p-1.5 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100/50 transform-gpu will-change-transform isolate"
              >
                {TABS.map(({ key, label, short, Icon }) => {
                  const isActive = activeTab === key;

                  return (
                    <motion.button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`panel-${key}-${appointment.id}`}
                      id={`tab-${key}-${appointment.id}`}
                      onClick={() => switchTab(key)}
                      whileTap={{ scale: 0.98 }}
                      initial={false}
                      layout
                      className={`relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium select-none ${
                        isActive
                          ? "bg-white/90 border border-blue-200/60 text-slate-900"
                          : "text-slate-700"
                      }`}
                    >
                      {/* Foreground content (no opacity animation) */}
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="hidden sm:inline relative z-10">
                        {label}
                      </span>
                      <span className="sm:hidden relative z-10">{short}</span>

                      {/* Focus ring */}
                      <span className="absolute inset-0 rounded-xl ring-0 focus-visible:ring-2 focus-visible:ring-blue-400 outline-none" />
                    </motion.button>
                  );
                })}
              </div>
            </LayoutGroup>

            {/* Panels giữ nguyên */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeTab}
                role="tabpanel"
                id={`panel-${activeTab}-${appointment.id}`}
                aria-labelledby={`tab-${activeTab}-${appointment.id}`}
                className="tab-content transform-gpu will-change-transform"
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
              >
                {activeTab === "overview" && (
                  <OverviewPanel appointment={appointment} />
                )}
                {activeTab === "staff" && (
                  <StaffPanel appointment={appointment} />
                )}
                {activeTab === "customer" && (
                  <CustomerPanel appointment={appointment} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      <StatusChangeDialog
        isOpen={isStatusChangeOpen}
        onClose={() => setIsStatusChangeOpen(false)}
        appointment={selectedAppointmentForStatus}
        newStatus={targetStatus}
        onConfirm={handleStatusChangeConfirm}
        getStatusConfig={getStatusConfig}
      />
    </MotionConfig>
  );
}

// ===== Panels =====
function OverviewPanel({ appointment }: { appointment: Appointment }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <InfoCard
          tone="blue"
          label="Gói dịch vụ"
          value={appointment.package ?? "—"}
          Icon={Camera}
        />
        <InfoCard
          tone="purple"
          label="Thời gian"
          value={String(appointment.duration ?? "—")}
          Icon={Clock}
        />
        <InfoCard
          tone="emerald"
          label="Địa điểm"
          value={appointment.location ?? "—"}
          Icon={MapPin}
        />
      </div>
    </div>
  );
}

function StaffPanel({ appointment }: { appointment: Appointment }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass">
        <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <h4 className="flex items-center gap-2 text-slate-800 text-base">
            <Users className="w-4 h-4" />
            Nhân sự và thiết bị
          </h4>
        </div>

        <div className="px-6 [&:last-child]:pb-6 space-y-4">
          <RowItem label="Photographer chính" Icon={Camera}>
            {appointment.photographer ?? (
              <span className="customer-info-value-empty">Chưa xếp</span>
            )}
          </RowItem>

          {appointment.assistant && (
            <RowItem label="Photographer phụ" Icon={UserCheck}>
              {appointment.assistant}
            </RowItem>
          )}

          {appointment.makeup && (
            <RowItem label="Makeup Artist" Icon={User}>
              {appointment.makeup}
            </RowItem>
          )}

          {!!appointment.equipment?.length && (
            <RowItem label="Thiết bị" Icon={Camera}>
              {appointment.equipment.join(", ")}
            </RowItem>
          )}

          {appointment.dressCode && (
            <RowItem label="Dress Code" Icon={Eye}>
              {appointment.dressCode}
            </RowItem>
          )}

          {appointment.notes && (
            <RowItem label="Ghi chú" Icon={Edit}>
              {appointment.notes}
            </RowItem>
          )}
        </div>
      </div>
    </div>
  );
}

function CustomerPanel({ appointment }: { appointment: Appointment }) {
  return (
    <div className="space-y-4">
      <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass">
        <div className="@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <h4 className="flex items-center gap-2 text-slate-800 text-base">
            <User className="w-4 h-4" />
            Thông tin liên hệ
          </h4>
        </div>
        <div className="px-6 [&:last-child]:pb-6 space-y-4">
          <RowItem label="Tên cặp đôi" Icon={User}>
            {appointment.couple ?? "—"}
          </RowItem>
          {appointment.clientNotes && (
            <RowItem label="Ghi chú từ khách" Icon={Edit}>
              {appointment.clientNotes}
            </RowItem>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== UI bits =====
function InfoCard({
  tone,
  label,
  value,
  Icon,
}: {
  tone: "blue" | "purple" | "emerald";
  label: string;
  value: string;
  Icon: IconType;
}) {
  const border = {
    blue: "border-blue-200/30",
    purple: "border-purple-200/30",
    emerald: "border-emerald-200/30",
  }[tone];
  const bg = {
    blue: "bg-blue-100",
    purple: "bg-purple-100",
    emerald: "bg-emerald-100",
  }[tone];
  const text = {
    blue: "text-blue-700",
    purple: "text-purple-700",
    emerald: "text-emerald-700",
  }[tone];
  const icon = {
    blue: "text-blue-600",
    purple: "text-purple-600",
    emerald: "text-emerald-600",
  }[tone];

  return (
    <div className={`glass-card touch-manipulation ${border}`}>
      <div className="mobile-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-slate-600 mb-1">{label}</p>
            <p className={`text-lg sm:text xl font-bold truncate ${text}`}>
              {value}
            </p>
          </div>
          <div className={`p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0 ${bg}`}>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${icon}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RowItem({
  label,
  Icon,
  children,
}: {
  label: string;
  Icon: IconType;
  children: React.ReactNode;
}) {
  return (
    <div className="align-start gap-4 min-h-[44px] flex">
      <Icon className="mt-2 w-4 h-4 text-gray-500 shrink-0" />
      <div className="flex-1">
        <p className="mb-1 text-sm text-gray-500">{label}</p>
        <p className="text-sm text-gray-900">{children}</p>
      </div>
    </div>
  );
}
