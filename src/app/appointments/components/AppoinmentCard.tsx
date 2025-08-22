"use client";

import { useMemo, useState, type ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// ===== Types =====
export type TabKey = "overview" | "staff" | "customer";
export type IconType = ComponentType<{ className?: string }>;

export type StatusCfg = {
  label: string;
  color: string; // full Tailwind classes for badge (bg-*/text-*/border-*)
  icon: IconType;
  description: string;
};

export type AppointmentStatus =
  | "staff_assignment"
  | "waiting_confirmation"
  | "confirmed"
  | "shooting"
  | "completed";

export type Appointment = {
  id: number | string;
  contractNumber: string;
  couple?: string;
  date?: string; // YYYY-MM-DD
  time?: string; // HH:mm
  package?: string;
  duration?: string | number;
  location?: string;
  // Staff
  photographer?: string;
  assistant?: string;
  makeup?: string;
  equipment?: string[];
  dressCode?: string;
  notes?: string;
  clientNotes?: string;
  status: AppointmentStatus;
};

export type AppointmentCardProps = {
  appointment: Appointment;
  getStatusConfig: (s: AppointmentStatus) => StatusCfg;
  getAvailableTransitions: (s: AppointmentStatus) => AppointmentStatus[];
  onStatusChange: (a: Appointment, s: AppointmentStatus) => void;
  onViewClick?: (a: Appointment) => void;
  onEditClick?: (a: Appointment) => void;
};

// ===== Utilities =====
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

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
  enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.18 } },
  exit: (dir: number) => ({
    opacity: 0,
    x: -dir * 24,
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
  const [direction, setDirection] = useState<1 | -1>(1);

  const statusCfg = getStatusConfig(appointment.status);
  const availableTransitions = getAvailableTransitions(appointment.status);

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
    <div className="bg-[#ffffffb3] text-[#1a1a1a] flex flex-col gap-6 rounded-xl border glass-card border-l-4 border-l-blue-500">
      <div className="px-6 [&:last-child]:pb-6 mobile-card">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-slate-900">{appointment.couple}</h3>
              <span
                className={cx(
                  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow]",
                  statusCfg.color
                )}
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
                  onClick={() => onStatusChange(appointment, next)}
                  className="inline-flex items-center justify-center font-medium transition-all border rounded-md gap-1.5 glass text-xs h-8 px-2 hover:bg-slate-100/50"
                >
                  <cfg.icon className="w-3 h-3 mr-1" />
                  {cfg.label}
                </button>
              );
            })}

            <button
              onClick={() => onViewClick?.(appointment)}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all border rounded-md gap-1.5 glass text-xs h-8 px-2 hover:bg-slate-100/50"
            >
              <Eye className="w-3 h-3 mr-1" />
              Chi tiết
            </button>

            <button
              onClick={() => onEditClick?.(appointment)}
              className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all border rounded-md gap-1.5 glass text-xs h-8 px-2 hover:bg-slate-100/50"
            >
              <Edit className="w-3 h-3 mr-1" />
              Sửa
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col gap-4">
          {/* Tabs header with animated pill */}
          <div
            role="tablist"
            aria-label="Chi tiết lịch hẹn"
            className="relative grid grid-cols-3 rounded-2xl p-1.5 bg-gradient-to-r from-blue-50 to-slate-50 border border-blue-100/50"
          >
            {TABS.map(({ key, label, short, Icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${key}-${appointment.id}`}
                  id={`tab-${key}-${appointment.id}`}
                  onClick={() => switchTab(key)}
                  className={cx(
                    "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                    isActive
                      ? "text-slate-800"
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-white/80"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sm:hidden">{short}</span>
                </button>
              );
            })}
          </div>

          {/* Tab panels with directional animation */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeTab}
              role="tabpanel"
              id={`panel-${activeTab}-${appointment.id}`}
              aria-labelledby={`tab-${activeTab}-${appointment.id}`}
              className="tab-content"
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
  );
}

// ===== Panels =====
function OverviewPanel({ appointment }: { appointment: Appointment }) {
  return (
    <div className="space-y-4">
      <div className="grid mobile-grid gap-4">
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
      <div className="glass">
        <div className="flex items-center gap-2 text-slate-800 text-base">
          <Users className="w-4 h-4" />
          Nhân sự và thiết bị
        </div>

        <div className="space-y-3 mt-3">
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
      <div className="glass">
        <div className="flex items-center gap-2 text-slate-800 text-base">
          <User className="w-4 h-4" />
          Thông tin liên hệ
        </div>
        <div className="space-y-3 mt-3">
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
    <div className={cx("glass-card touch-manipulation", border)}>
      <div className="mobile-card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-slate-600 mb-1">{label}</p>
            <p className={cx("text-lg sm:text-xl font-bold truncate", text)}>
              {value}
            </p>
          </div>
          <div className={cx("p-2 sm:p-3 rounded-lg ml-3 flex-shrink-0", bg)}>
            <Icon className={cx("w-5 h-5 sm:w-6 sm:h-6", icon)} />
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
    <div className="customer-info-item">
      <Icon className="customer-info-icon" />
      <div className="customer-info-content">
        <p className="customer-info-label">{label}</p>
        <p className="customer-info-value">{children}</p>
      </div>
    </div>
  );
}
