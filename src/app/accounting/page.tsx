"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Filter,
  Search as SearchIcon,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  Users,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  ChevronDown, // thêm để dùng cho CustomSelect
} from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { useContracts } from "@/contexts/ContractsContext";

/* --------------------- CustomSelect (framer-motion) --------------------- */
type Option = { value: string; label: string };

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled,
  className,
}: {
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value]
  );

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        disabled={!!disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-left text-sm
                   flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selected ? "text-slate-900" : "text-slate-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-slate-50 ${
                  value === opt.value ? "bg-slate-50" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------- Dialog (framer-motion) -------------------------- */
function Dialog({
  open,
  onOpenChange,
  title,
  children,
  footer,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  // esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && onOpenChange(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpenChange]);

  // click outside + lock scroll + autofocus
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => firstRef.current?.focus(), 0);

    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        onOpenChange(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("mousedown", onDown);
    };
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 !mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
            >
              <div className="px-5 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {title}
                </h3>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="px-5 py-4 space-y-4">
                <input ref={firstRef} className="sr-only" />
                {children}
              </div>

              {footer && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ===================== Mock Databases (unchanged) ===================== */
const staffDatabase = [
  {
    id: 1,
    name: "Nguyễn Minh Anh",
    position: "Photographer chính",
    department: "Chụp ảnh",
    baseSalary: 15000000,
    hourlyRate: 200000,
    workingDaysPerMonth: 22,
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thu Hà",
    position: "Makeup Artist",
    department: "Trang điểm",
    baseSalary: 8000000,
    hourlyRate: 150000,
    workingDaysPerMonth: 20,
    status: "active",
  },
  {
    id: 3,
    name: "Lê Đức Nam",
    position: "Photographer phụ",
    department: "Chụp ảnh",
    baseSalary: 10000000,
    hourlyRate: 180000,
    workingDaysPerMonth: 21,
    status: "active",
  },
  {
    id: 4,
    name: "Phạm Lan Phương",
    position: "Tư vấn viên",
    department: "Tư vấn",
    baseSalary: 6000000,
    hourlyRate: 100000,
    workingDaysPerMonth: 22,
    status: "active",
  },
];

const attendanceDatabase = [
  {
    id: 1,
    staffId: 1,
    date: "2025-01-15",
    checkIn: "08:30",
    checkOut: "18:00",
    workHours: 8.5,
    overtimeHours: 0.5,
    status: "present",
    notes: "",
  },
  {
    id: 2,
    staffId: 2,
    date: "2025-01-15",
    checkIn: "09:00",
    checkOut: "17:30",
    workHours: 8,
    overtimeHours: 0,
    status: "present",
    notes: "",
  },
  {
    id: 3,
    staffId: 1,
    date: "2025-01-14",
    checkIn: "08:45",
    checkOut: "19:30",
    workHours: 9.75,
    overtimeHours: 1.75,
    status: "present",
    notes: "Chụp ảnh cưới ngoài giờ",
  },
  {
    id: 4,
    staffId: 3,
    date: "2025-01-14",
    checkIn: "",
    checkOut: "",
    workHours: 0,
    overtimeHours: 0,
    status: "absent",
    notes: "Nghỉ ốm có phép",
  },
  {
    id: 5,
    staffId: 4,
    date: "2025-01-15",
    checkIn: "08:00",
    checkOut: "17:00",
    workHours: 8,
    overtimeHours: 0,
    status: "present",
    notes: "",
  },
  {
    id: 6,
    staffId: 2,
    date: "2025-01-14",
    checkIn: "09:15",
    checkOut: "18:30",
    workHours: 8.25,
    overtimeHours: 0.25,
    status: "present",
    notes: "",
  },
  {
    id: 7,
    staffId: 3,
    date: "2025-01-13",
    checkIn: "08:30",
    checkOut: "19:00",
    workHours: 9.5,
    overtimeHours: 1.5,
    status: "present",
    notes: "Chụp ảnh sự kiện",
  },
  {
    id: 8,
    staffId: 4,
    date: "2025-01-14",
    checkIn: "08:30",
    checkOut: "17:30",
    workHours: 8,
    overtimeHours: 0,
    status: "present",
    notes: "",
  },
];

const rewardsPenaltiesDatabase = [
  {
    id: 1,
    staffId: 1,
    type: "reward",
    amount: 2000000,
    reason: "Hoàn thành xuất sắc dự án album cưới cao cấp",
    date: "2025-01-10",
    approvedBy: "Giám đốc",
    status: "approved",
  },
  {
    id: 2,
    staffId: 2,
    type: "reward",
    amount: 1000000,
    reason: "Makeup xuất sắc cho khách hàng VIP",
    date: "2025-01-08",
    approvedBy: "Giám đốc",
    status: "approved",
  },
  {
    id: 3,
    staffId: 3,
    type: "penalty",
    amount: 300000,
    reason: "Đến muộn 3 lần trong tháng",
    date: "2025-01-05",
    approvedBy: "Giám đốc",
    status: "approved",
  },
  {
    id: 4,
    staffId: 4,
    type: "reward",
    amount: 800000,
    reason: "Tư vấn thành công 5 khách hàng mới",
    date: "2025-01-12",
    approvedBy: "Giám đốc",
    status: "pending",
  },
];

const transactionsDatabase = [
  {
    id: 1,
    type: "income",
    amount: 25000000,
    category: "Chụp ảnh cưới",
    description: "Album cưới Minh Anh & Tuấn Khang",
    date: "2025-01-15",
    customer: "Minh Anh & Tuấn Khang",
    status: "completed",
  },
  {
    id: 2,
    type: "income",
    amount: 15000000,
    category: "Chụp ảnh cưới",
    description: "Đặt cọc album cưới Thu Hà & Đức Nam",
    date: "2025-01-14",
    customer: "Thu Hà & Đức Nam",
    status: "pending",
  },
  {
    id: 3,
    type: "expense",
    amount: 3000000,
    category: "Thiết bị",
    description: "Mua lens Canon 85mm",
    date: "2025-01-13",
    supplier: "Cửa hàng Canon",
    status: "completed",
  },
  {
    id: 4,
    type: "expense",
    amount: 2500000,
    category: "Studio",
    description: "Thuê studio chụp ảnh ngoài trời",
    date: "2025-01-12",
    supplier: "Studio ABC",
    status: "completed",
  },
  {
    id: 5,
    type: "income",
    amount: 18000000,
    category: "Chụp ảnh cưới",
    description: "Album cưới Lan Phương & Việt Anh",
    date: "2025-01-11",
    customer: "Lan Phương & Việt Anh",
    status: "completed",
  },
  {
    id: 6,
    type: "expense",
    amount: 0,
    category: "Nhân sự",
    description: "Lương tháng 01/2025",
    date: "2025-01-31",
    status: "pending",
  },
];

/* ===================== Helpers ===================== */
const getStaffById = (id: number) => staffDatabase.find((s) => s.id === id);
const getAttendanceByStaffId = (staffId: number) =>
  attendanceDatabase.filter((att) => att.staffId === staffId);
const getRewardsPenaltiesByStaffId = (staffId: number) =>
  rewardsPenaltiesDatabase.filter((rp) => rp.staffId === staffId);

const calculateStaffPayroll = (staffId: number) => {
  const staff = getStaffById(staffId);
  if (!staff) return null as any;

  const attendance = getAttendanceByStaffId(staffId);
  const rewardsPenalties = getRewardsPenaltiesByStaffId(staffId);

  const workDays = attendance.filter((att) => att.status === "present").length;
  const totalOvertimeHours = attendance.reduce(
    (sum, att) => sum + att.overtimeHours,
    0
  );

  const attendanceRate = workDays / staff.workingDaysPerMonth;
  const allowances =
    attendanceRate >= 1
      ? 2000000
      : attendanceRate >= 0.9
      ? 1500000
      : attendanceRate >= 0.8
      ? 1000000
      : 500000;

  const overtimePay = totalOvertimeHours * staff.hourlyRate * 1.5;

  const rewards = rewardsPenalties
    .filter((rp) => rp.type === "reward" && rp.status === "approved")
    .reduce((sum, rp) => sum + rp.amount, 0);
  const penalties = rewardsPenalties
    .filter((rp) => rp.type === "penalty" && rp.status === "approved")
    .reduce((sum, rp) => sum + rp.amount, 0);

  const bonus = rewards + overtimePay;
  const deductions = penalties;
  const totalSalary = staff.baseSalary + allowances + bonus - deductions;

  return {
    ...staff,
    workDays,
    overtimeHours: totalOvertimeHours,
    allowances,
    bonus,
    deductions,
    totalSalary,
  };
};

const getProcessedStaffData = () =>
  staffDatabase
    .map((s) => calculateStaffPayroll(s.id))
    .filter(Boolean) as any[];
const getProcessedRewardsPenaltiesData = () =>
  rewardsPenaltiesDatabase.map((rp) => ({
    ...rp,
    staffName: getStaffById(rp.staffId)?.name || "Unknown",
  }));
const getProcessedTransactions = () => {
  const staffPayroll = getProcessedStaffData();
  const totalPayroll = staffPayroll.reduce(
    (sum, staff: any) => sum + staff.totalSalary,
    0
  );
  const transactions = [...transactionsDatabase];
  const payrollTransaction = transactions.find((t) => t.id === 6);
  if (payrollTransaction) payrollTransaction.amount = totalPayroll;
  return transactions;
};

const chartData = [
  { month: "T10", income: 120000000, expense: 45000000 },
  { month: "T11", income: 140000000, expense: 52000000 },
  { month: "T12", income: 180000000, expense: 48000000 },
  { month: "T1", income: 200000000, expense: 55000000 },
];

/* ===================== Format helpers ===================== */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );
const formatCurrencyShort = (amount: number) => {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`;
  return amount.toString();
};

/* ===================== Page ===================== */
export default function AccountingPage() {
  const [tab, setTab] = useState("overview");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  // Payroll edit dialog state
  const [isPayrollOpen, setIsPayrollOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [payrollForm, setPayrollForm] = useState({
    baseSalary: "",
    hourlyRate: "",
    workingDaysPerMonth: "",
    allowances: "",
    bonus: "",
    deductions: "",
  });
  const [payrollOverrides, setPayrollOverrides] = useState<
    Record<number, { allowances?: number; bonus?: number; deductions?: number }>
  >({});
  const [payrollVersion, setPayrollVersion] = useState(0);

  const [form, setForm] = useState({
    type: "",
    amount: "",
    category: "",
    description: "",
    date: "",
    party: "",
  });
  const [extraTransactions, setExtraTransactions] = useState<any[]>([]);

  // Select options
  const typeOptions: Option[] = [
    { value: "income", label: "Thu nhập" },
    { value: "expense", label: "Chi phí" },
  ];
  const incomeCats: Option[] = [
    { value: "Chụp ảnh cưới", label: "Chụp ảnh cưới" },
    { value: "Chụp ảnh thời trang", label: "Chụp ảnh thời trang" },
    { value: "Khóa học", label: "Khóa học" },
    { value: "Khác", label: "Khác" },
  ];
  const expenseCats: Option[] = [
    { value: "Thiết bị", label: "Thiết bị" },
    { value: "Studio", label: "Studio" },
    { value: "Marketing", label: "Marketing" },
    { value: "Nhân sự", label: "Nhân sự" },
    { value: "Vận hành", label: "Vận hành" },
    { value: "Khác", label: "Khác" },
  ];
  const categoryOptions: Option[] =
    form.type === "income" ? incomeCats : expenseCats;

  const staffDataRaw = getProcessedStaffData();
  // Apply overrides and updates (baseSalary/hourlyRate/workingDays already mutated into staffDatabase on save)
  const staffData = useMemo(() => {
    return staffDataRaw.map((s: any) => {
      const ov = payrollOverrides[s.id];
      if (!ov) return s;
      const allowances = ov.allowances ?? s.allowances;
      const bonus = ov.bonus ?? s.bonus;
      const deductions = ov.deductions ?? s.deductions;
      const totalSalary = s.baseSalary + allowances + bonus - deductions;
      return { ...s, allowances, bonus, deductions, totalSalary };
    });
  }, [staffDataRaw, payrollOverrides, payrollVersion]);
  const rewardsData = getProcessedRewardsPenaltiesData();

  // Pull transactions from contracts payments and merge with base transactions
  const { contracts } = useContracts();
  const contractTransactions = useMemo(() => {
    const tx: any[] = [];
    contracts.forEach((c) => {
      (c.paymentSchedule || []).forEach((p, idx) => {
        tx.push({
          id: Number(`${c.id}${idx}`),
          type: "income",
          amount: p.amount,
          category: "Hợp đồng",
          description: `${c.contractNumber} - ${p.phase}`,
          date: (p.paidDate || p.dueDate) as string,
          customer: c.couple,
          status: p.status === "paid" ? "completed" : "pending",
        });
      });
    });
    return tx;
  }, [contracts]);

  const baseTransactions = getProcessedTransactions();
  const transactions = useMemo(
    () => [...extraTransactions, ...contractTransactions, ...baseTransactions],
    [extraTransactions, contractTransactions, baseTransactions]
  );

  // Helper: format numeric input with thousand separators (vi-VN)
  const formatNumberVN = (value: string) => {
    const digits = (value || "").replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleAddTransaction = () => {
    // Basic validation
    const amountNum = parseInt(form.amount.replace(/\D/g, "")) || 0;
    if (
      !form.type ||
      !amountNum ||
      !form.category ||
      !form.description ||
      !form.date
    ) {
      alert("Vui lòng nhập đầy đủ thông tin giao dịch");
      return;
    }
    const isIncome = form.type === "income";
    const newTx = {
      id: Date.now(),
      type: form.type,
      amount: amountNum,
      category: form.category,
      description: form.description.trim(),
      date: form.date,
      customer: isIncome ? form.party.trim() : undefined,
      supplier: !isIncome ? form.party.trim() : undefined,
      status: "completed",
    };
    setExtraTransactions((prev) => [newTx, ...prev]);
    // reset & close
    setForm({
      type: "",
      amount: "",
      category: "",
      description: "",
      date: "",
      party: "",
    });
    setIsAddOpen(false);
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);
  const profit = totalIncome - totalExpense;

  const q = searchTerm.toLowerCase();
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesSearch =
      t.description.toLowerCase().includes(q) ||
      (t.customer?.toLowerCase().includes(q) ?? false) ||
      (t.supplier?.toLowerCase().includes(q) ?? false);
    return matchesType && matchesSearch;
  });
  const sortedTransactions = [...filteredTransactions].sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-slate-900 text-2xl font-semibold">
            Quản lý kế toán
          </h1>
          <p className="text-slate-600 mt-1">
            Quản lý tài chính, lương, thưởng phạt và chấm công của studio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
            <Receipt className="w-4 h-4 mr-2" /> Xuất báo cáo
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-3 py-2 text-sm font-medium shadow-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2 inline" /> Thêm mới
          </button>
        </div>
      </div>

      {/* Tabs (plain buttons) */}
      <div className="space-y-4 sm:space-y-6 mt-4">
        <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {[
            { k: "overview", label: "Tổng quan" },
            { k: "transactions", label: "Giao dịch" },
            { k: "payroll", label: "Bảng lương" },
            { k: "rewards", label: "Thưởng phạt" },
            { k: "attendance", label: "Chấm công" },
            { k: "reports", label: "Báo cáo" },
          ].map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                tab === t.k
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-700 border border-slate-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === "overview" && (
          <div className="mobile-spacing">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-200/30 bg-white/70 backdrop-blur shadow-sm">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-600">
                        Tổng thu nhập
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-emerald-600 truncate">
                        {formatCurrency(totalIncome)}
                      </p>
                      <p className="text-xs text-emerald-600 flex items-center mt-1">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +12% so với tháng trước
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-emerald-50 rounded-lg ml-3">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-200/30 bg-white/70 backdrop-blur shadow-sm">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-600">
                        Tổng chi phí
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">
                        {formatCurrency(totalExpense)}
                      </p>
                      <p className="text-xs text-red-600 flex items-center mt-1">
                        <ArrowDownRight className="w-3 h-3 mr-1" />
                        +8% so với tháng trước
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-red-50 rounded-lg ml-3">
                      <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-blue-200/30 bg-white/70 backdrop-blur shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-slate-600">
                        Lợi nhuận
                      </p>
                      <p className="text-lg sm:text-2xl font-bold text-blue-600 truncate">
                        {formatCurrency(profit)}
                      </p>
                      <p className="text-xs text-blue-600 flex items-center mt-1">
                        <ArrowUpRight className="w-3 h-3 mr-1" />
                        +15% so với tháng trước
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-50 rounded-lg ml-3">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-4">
              <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
                <div className="px-4 pt-4 sm:px-6 pb-2">
                  <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Biểu đồ thu chi theo tháng
                  </h3>
                </div>
                <div className="px-4 pb-4 sm:px-6 pt-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        strokeWidth={1}
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={formatCurrencyShort}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        width={60}
                      />
                      <Tooltip
                        content={({ active, payload, label }: any) =>
                          active && payload && payload.length ? (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-medium text-gray-900 mb-2">{`Tháng ${label}`}</p>
                              {payload.map((entry: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-gray-600">
                                    {entry.name}:
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(entry.value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10b981"
                        strokeWidth={3}
                        name="Thu nhập"
                        dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                        activeDot={{
                          r: 7,
                          stroke: "#10b981",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expense"
                        stroke="#ef4444"
                        strokeWidth={3}
                        name="Chi phí"
                        dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
                        activeDot={{
                          r: 7,
                          stroke: "#ef4444",
                          strokeWidth: 2,
                          fill: "#ffffff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
                <div className="px-4 pt-4 sm:px-6 pb-2">
                  <h3 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-slate-900">
                    <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    So sánh thu chi
                  </h3>
                </div>
                <div className="px-4 pb-4 sm:px-6 pt-0">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        strokeWidth={1}
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        dy={10}
                      />
                      <YAxis
                        tickFormatter={formatCurrencyShort}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        width={60}
                      />
                      <Tooltip
                        content={({ active, payload, label }: any) =>
                          active && payload && payload.length ? (
                            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-medium text-gray-900 mb-2">{`Tháng ${label}`}</p>
                              {payload.map((entry: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  <span className="text-sm text-gray-600">
                                    {entry.name}:
                                  </span>
                                  <span className="text-sm font-medium text-gray-900">
                                    {formatCurrency(entry.value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : null
                        }
                      />
                      <Bar
                        dataKey="income"
                        fill="#10b981"
                        name="Thu nhập"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expense"
                        fill="#ef4444"
                        name="Chi phí"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {tab === "transactions" && (
          <div className="mobile-spacing">
            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm relative z-10">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      placeholder="Tìm kiếm giao dịch..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div className="w-full sm:w-[200px]">
                    <CustomSelect
                      options={[
                        { value: "all", label: "Tất cả" },
                        { value: "income", label: "Thu nhập" },
                        { value: "expense", label: "Chi phí" },
                      ]}
                      value={filterType}
                      onChange={(v) => setFilterType(v)}
                      placeholder="Lọc theo loại"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm mt-4">
              <div className="px-4 pt-4 sm:px-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Danh sách giao dịch
                </h3>
              </div>
              <div className="px-4 pb-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4">
                  {sortedTransactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-slate-200 bg-white/60 space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                            t.type === "income" ? "bg-emerald-50" : "bg-red-50"
                          }`}
                        >
                          {t.type === "income" ? (
                            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                            {t.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-slate-300 text-slate-700">
                              {t.category}
                            </span>
                            <span className="text-xs text-slate-500">
                              {format(new Date(t.date), "dd/MM/yyyy", {
                                locale: vi,
                              })}
                            </span>
                            {t.customer && (
                              <span className="text-xs text-slate-500 truncate">
                                • {t.customer}
                              </span>
                            )}
                            {t.supplier && (
                              <span className="text-xs text-slate-500 truncate">
                                • {t.supplier}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:text-right">
                        <p
                          className={`font-bold text-sm sm:text-base ${
                            t.type === "income"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}
                          {formatCurrency(t.amount)}
                        </p>
                        <div className="sm:mt-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              t.status === "completed"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {t.status === "completed"
                              ? "Hoàn thành"
                              : "Chờ xử lý"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAYROLL */}
        {tab === "payroll" && (
          <div className="mobile-spacing">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                {
                  icon: <Users className="h-8 w-8 text-blue-600" />,
                  value: staffDatabase.length,
                  label: "Tổng nhân viên",
                },
                {
                  icon: <DollarSign className="h-8 w-8 text-emerald-600" />,
                  value: formatCurrency(
                    staffData.reduce(
                      (s: number, x: any) => s + x.totalSalary,
                      0
                    )
                  ),
                  label: "Tổng lương tháng",
                },
                {
                  icon: <Clock className="h-8 w-8 text-amber-600" />,
                  value: `${staffData.reduce(
                    (s: number, x: any) => s + x.overtimeHours,
                    0
                  )}h`,
                  label: "Tổng làm thêm",
                },
                {
                  icon: <Award className="h-8 w-8 text-violet-600" />,
                  value: formatCurrency(
                    staffData.reduce((s: number, x: any) => s + x.bonus, 0)
                  ),
                  label: "Tổng thưởng",
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm border-slate-200"
                >
                  <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
                    {c.icon}
                    <div>
                      <p className="text-2xl font-bold text-slate-900">
                        {c.value}
                      </p>
                      <p className="text-sm text-slate-600">{c.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
              <div className="px-4 pt-4 sm:px-6">
                <h3 className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Users className="w-5 h-5" />
                  Bảng lương tháng 01/2025
                </h3>
              </div>
              <div className="px-4 pb-4 sm:px-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-2">Nhân viên</th>
                        <th className="py-2 pr-2">Chức vụ</th>
                        <th className="py-2 pr-2 text-right">Lương cơ bản</th>
                        <th className="py-2 pr-2 text-right">Phụ cấp</th>
                        <th className="py-2 pr-2 text-right">Thưởng</th>
                        <th className="py-2 pr-2 text-right">Khấu trừ</th>
                        <th className="py-2 pr-2 text-right">Thực lĩnh</th>
                        <th className="py-2 pr-2 text-center">Trạng thái</th>
                        <th className="py-2 pr-2 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {staffData.map((s: any) => (
                        <tr key={s.id} className="border-b last:border-0">
                          <td className="py-2 pr-2">
                            <div>
                              <p className="text-slate-900">{s.name}</p>
                              <p className="text-xs text-slate-500">
                                {s.department}
                              </p>
                            </div>
                          </td>
                          <td className="py-2 pr-2">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border border-slate-300 text-slate-700">
                              {s.position}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right">
                            {formatCurrency(s.baseSalary)}
                          </td>
                          <td className="py-2 pr-2 text-right">
                            {formatCurrency(s.allowances)}
                          </td>
                          <td className="py-2 pr-2 text-right text-emerald-600">
                            {formatCurrency(s.bonus)}
                          </td>
                          <td className="py-2 pr-2 text-right text-red-600">
                            {formatCurrency(s.deductions)}
                          </td>
                          <td className="py-2 pr-2 text-right text-slate-900">
                            {formatCurrency(s.totalSalary)}
                          </td>
                          <td className="py-2 pr-2 text-center">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                s.status === "active"
                                  ? "bg-slate-900 text-white"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {s.status === "active" ? "Hoạt động" : "Tạm dừng"}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-center">
                            <button
                              className="inline-flex items-center rounded-md border px-2 py-1 text-xs hover:bg-slate-50"
                              onClick={() => {
                                setSelectedStaffId(s.id);
                                setPayrollForm({
                                  baseSalary: formatNumberVN(
                                    String(s.baseSalary)
                                  ),
                                  hourlyRate: formatNumberVN(
                                    String(getStaffById(s.id)?.hourlyRate ?? 0)
                                  ),
                                  workingDaysPerMonth: String(
                                    getStaffById(s.id)?.workingDaysPerMonth ??
                                      22
                                  ),
                                  allowances: formatNumberVN(
                                    String(s.allowances)
                                  ),
                                  bonus: formatNumberVN(String(s.bonus)),
                                  deductions: formatNumberVN(
                                    String(s.deductions)
                                  ),
                                });
                                setIsPayrollOpen(true);
                              }}
                            >
                              Sửa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REWARDS */}
        {tab === "rewards" && (
          <div className="mobile-spacing">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm border-emerald-200/30">
                <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
                  <Award className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {rewardsData.filter((r) => r.type === "reward").length}
                    </p>
                    <p className="text-sm text-slate-600">Tổng thưởng</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm border-red-200/30">
                <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {rewardsData.filter((r) => r.type === "penalty").length}
                    </p>
                    <p className="text-sm text-slate-600">Tổng phạt</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm border-blue-200/30">
                <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(
                        rewardsData
                          .filter(
                            (r) =>
                              r.type === "reward" && r.status === "approved"
                          )
                          .reduce((s, r) => s + r.amount, 0)
                      )}
                    </p>
                    <p className="text-sm text-slate-600">Tổng tiền thưởng</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border bg-white/70 backdrop-blur shadow-sm border-amber-200/30">
                <div className="px-4 py-4 sm:px-6 flex items-center gap-2">
                  <Clock className="h-8 w-8 text-amber-600" />
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {rewardsData.filter((r) => r.status === "pending").length}
                    </p>
                    <p className="text-sm text-slate-600">Chờ duyệt</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
              <div className="px-4 pt-4 sm:px-6">
                <h3 className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Award className="w-5 h-5" />
                  Danh sách thưởng phạt
                </h3>
              </div>
              <div className="px-4 pb-4 sm:px-6">
                <div className="space-y-4">
                  {rewardsData.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-slate-200 bg-white/60 space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            item.type === "reward"
                              ? "bg-emerald-50"
                              : "bg-red-50"
                          }`}
                        >
                          {item.type === "reward" ? (
                            <Award className="w-6 h-6 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-slate-900 font-medium truncate max-w-[180px] sm:max-w-[260px]">
                              {item.staffName}
                            </p>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                item.type === "reward"
                                  ? "bg-slate-900 text-white"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {item.type === "reward" ? "Thưởng" : "Phạt"}
                            </span>
                          </div>
                          <p className="text-slate-700 text-sm">
                            {item.reason}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>
                              {format(new Date(item.date), "dd/MM/yyyy", {
                                locale: vi,
                              })}
                            </span>
                            <span>•</span>
                            <span>Duyệt bởi: {item.approvedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:block sm:text-right">
                        <p
                          className={`${
                            item.type === "reward"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.type === "reward" ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </p>
                        <div className="sm:mt-1">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.status === "approved"
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.status === "approved"
                              ? "Đã duyệt"
                              : "Chờ duyệt"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {tab === "attendance" && (
          <div className="mobile-spacing">
            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
              <div className="px-4 py-8 sm:px-6 text-center">
                <Clock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-medium text-gray-900 mb-3">
                  Tính năng đang được phát triển
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Module chấm công đang được phát triển để mang đến trải nghiệm
                  tốt nhất cho việc quản lý thời gian làm việc của nhân viên.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    Đang trong quá trình phát triển
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Dự kiến hoàn thành Q2 2025
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS */}
        {tab === "reports" && (
          <div className="mobile-spacing">
            <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm">
              <div className="px-4 pt-4 sm:px-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                  Báo cáo tài chính
                </h3>
              </div>
              <div className="px-4 pb-8 sm:px-6 text-center">
                <Receipt className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-2">
                  Báo cáo đang được phát triển
                </h3>
                <p className="text-slate-600 text-sm sm:text-base">
                  Tính năng báo cáo chi tiết sẽ được cập nhật trong phiên bản
                  tiếp theo
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog: Thêm giao dịch (framer-motion) */}
      <Dialog
        open={isPayrollOpen}
        onOpenChange={setIsPayrollOpen}
        title="Chỉnh sửa bảng lương"
        footer={
          <>
            <button
              onClick={() => setIsPayrollOpen(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (selectedStaffId == null) return;
                const staff = getStaffById(selectedStaffId);
                if (staff) {
                  staff.baseSalary =
                    parseInt(payrollForm.baseSalary.replace(/\D/g, "")) || 0;
                  (staff as any).hourlyRate =
                    parseInt(payrollForm.hourlyRate.replace(/\D/g, "")) || 0;
                  (staff as any).workingDaysPerMonth =
                    parseInt(
                      payrollForm.workingDaysPerMonth.replace(/\D/g, "")
                    ) || 22;
                }
                setPayrollOverrides((prev) => ({
                  ...prev,
                  [selectedStaffId!]: {
                    allowances:
                      parseInt(payrollForm.allowances.replace(/\D/g, "")) || 0,
                    bonus: parseInt(payrollForm.bonus.replace(/\D/g, "")) || 0,
                    deductions:
                      parseInt(payrollForm.deductions.replace(/\D/g, "")) || 0,
                  },
                }));
                setPayrollVersion((v) => v + 1);
                setIsPayrollOpen(false);
              }}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:opacity-95"
            >
              Lưu
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lương cơ bản
            </label>
            <input
              value={payrollForm.baseSalary}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  baseSalary: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Hệ số giờ
            </label>
            <input
              value={payrollForm.hourlyRate}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  hourlyRate: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Công chuẩn/tháng
            </label>
            <input
              value={payrollForm.workingDaysPerMonth}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  workingDaysPerMonth: e.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Phụ cấp
            </label>
            <input
              value={payrollForm.allowances}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  allowances: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Thưởng
            </label>
            <input
              value={payrollForm.bonus}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  bonus: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Khấu trừ
            </label>
            <input
              value={payrollForm.deductions}
              onChange={(e) =>
                setPayrollForm((f) => ({
                  ...f,
                  deductions: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Dialog>
      <Dialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        title="Thêm giao dịch mới"
        footer={
          <>
            <button
              onClick={() => setIsAddOpen(false)}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              onClick={handleAddTransaction}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-medium hover:opacity-95"
            >
              Thêm giao dịch
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Loại giao dịch
            </label>
            <CustomSelect
              options={typeOptions}
              value={form.type}
              onChange={(v) =>
                setForm((f) => ({ ...f, type: v, category: "" }))
              }
              placeholder="Chọn loại"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Số tiền
            </label>
            <input
              placeholder="1,000,000"
              value={form.amount}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  amount: formatNumberVN(e.target.value),
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Danh mục
          </label>
          <CustomSelect
            options={categoryOptions}
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v }))}
            placeholder="Chọn danh mục"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mô tả
          </label>
          <textarea
            placeholder="Mô tả chi tiết giao dịch..."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Ngày giao dịch
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Khách hàng/Nhà cung cấp
            </label>
            <input
              placeholder="Tên..."
              value={form.party}
              onChange={(e) =>
                setForm((f) => ({ ...f, party: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
