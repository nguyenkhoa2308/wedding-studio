/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PlusCircle,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Receipt,
  Users,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
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

// Custom Select Component
interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  disabled,
  className = "",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      <button
        type="button"
        title={selectedOption ? selectedOption.label : placeholder}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        aria-haspopup="listbox"
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              title={option.label}
              className="w-full px-3 py-2 text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t-md last:rounded-b-md"
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Types
interface StaffMember {
  id: number;
  name: string;
  position: string;
  department: string;
  baseSalary: number;
  hourlyRate: number;
  workingDaysPerMonth: number;
  status: "active" | "inactive";
}

interface ProcessedStaff extends StaffMember {
  workDays: number;
  overtimeHours: number;
  allowances: number;
  bonus: number;
  deductions: number;
  totalSalary: number;
}

interface Transaction {
  id: number;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
  customer?: string;
  supplier?: string;
  status: "completed" | "pending";
}

// Base Staff Data
const staffDatabase: StaffMember[] = [
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

// Attendance Data
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
];

// Rewards and Penalties Data
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

// Business Transactions
const transactionsDatabase: Transaction[] = [
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
    amount: 39000000,
    category: "Nhân sự",
    description: "Lương tháng 01/2025",
    date: "2025-01-31",
    status: "pending",
  },
];

const chartData = [
  { month: "T10", income: 120000000, expense: 45000000 },
  { month: "T11", income: 140000000, expense: 52000000 },
  { month: "T12", income: 180000000, expense: 48000000 },
  { month: "T1", income: 200000000, expense: 55000000 },
];

// Helper Functions
const getStaffById = (id: number): StaffMember | undefined => {
  return staffDatabase.find((staff) => staff.id === id);
};

const getAttendanceByStaffId = (staffId: number) => {
  return attendanceDatabase.filter((att) => att.staffId === staffId);
};

const getRewardsPenaltiesByStaffId = (staffId: number) => {
  return rewardsPenaltiesDatabase.filter((rp) => rp.staffId === staffId);
};

const calculateStaffPayroll = (staffId: number): ProcessedStaff | null => {
  const staff = getStaffById(staffId);
  if (!staff) return null;

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

const getProcessedStaffData = (): ProcessedStaff[] => {
  return staffDatabase
    .map((staff) => calculateStaffPayroll(staff.id))
    .filter((staff): staff is ProcessedStaff => staff !== null);
};

const getProcessedRewardsPenaltiesData = () => {
  return rewardsPenaltiesDatabase.map((rp) => ({
    ...rp,
    staffName: getStaffById(rp.staffId)?.name || "Unknown",
  }));
};

// Select options
const transactionTypeOptions: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "income", label: "Thu nhập" },
  { value: "expense", label: "Chi phí" },
];

const transactionCategoryOptions: SelectOption[] = [
  { value: "wedding", label: "Chụp ảnh cưới" },
  { value: "equipment", label: "Thiết bị" },
  { value: "studio", label: "Studio" },
];

const addTransactionTypeOptions: SelectOption[] = [
  { value: "", label: "Chọn loại" },
  { value: "income", label: "Thu nhập" },
  { value: "expense", label: "Chi phí" },
];

export default function AccountingPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTransactionType, setNewTransactionType] = useState("");
  const [newTransactionCategory, setNewTransactionCategory] = useState("");

  // Calculate summary
  const totalIncome = transactionsDatabase
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactionsDatabase
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = totalIncome - totalExpense;

  // Filter transactions
  const filteredTransactions = transactionsDatabase.filter((transaction) => {
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false) ||
      (transaction.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ??
        false);
    return matchesType && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000000) {
      return `${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{`Tháng ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const tabItems = [
    { id: "overview", label: "Tổng quan" },
    { id: "transactions", label: "Giao dịch" },
    { id: "payroll", label: "Bảng lương" },
    { id: "rewards", label: "Thưởng phạt" },
    { id: "attendance", label: "Chấm công" },
    { id: "reports", label: "Báo cáo" },
  ];

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý kế toán</h1>
          <p className="text-slate-600 mt-1">
            Quản lý tài chính, lương, thưởng phạt và chấm công của studio
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            title="Xuất báo cáo Excel"
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </button>
          <button
            title="Thêm giao dịch mới"
            onClick={() => setIsAddDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-colors shadow-lg"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Thêm mới
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-4 overflow-x-auto">
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              title={`Chuyển đến tab ${tab.label}`}
              onClick={() => setSelectedTab(tab.id)}
              className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm transition-colors ${
                selectedTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {selectedTab === "overview" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-600">Tổng thu nhập</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(totalIncome)}
                  </p>
                  <p className="text-xs text-emerald-600 flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12% so với tháng trước
                  </p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-600">Tổng chi phí</p>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(totalExpense)}
                  </p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                    +8% so với tháng trước
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-600">Lợi nhuận</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(profit)}
                  </p>
                  <p className="text-xs text-blue-600 flex items-center mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +15% so với tháng trước
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Biểu đồ thu chi theo tháng
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={formatCurrencyShort}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Thu nhập"
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    name="Chi phí"
                    dot={{ fill: "#ef4444", strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
                <Receipt className="w-5 h-5 text-blue-600" />
                So sánh thu chi
              </h3>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                  />
                  <YAxis
                    tickFormatter={formatCurrencyShort}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
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
      )}

      {selectedTab === "transactions" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Tìm kiếm giao dịch theo tên, mô tả"
                  />
                </div>
              </div>
              <div className="w-full sm:w-40">
                <CustomSelect
                  options={transactionTypeOptions}
                  value={filterType}
                  onChange={setFilterType}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Transaction List */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold">Danh sách giao dịch</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          transaction.type === "income"
                            ? "bg-emerald-50"
                            : "bg-red-50"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">
                          {transaction.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === "income"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {format(new Date(transaction.date), "dd/MM/yyyy", {
                              locale: vi,
                            })}
                          </span>
                          {transaction.customer && (
                            <span className="text-xs text-slate-500">
                              • {transaction.customer}
                            </span>
                          )}
                          {transaction.supplier && (
                            <span className="text-xs text-slate-500">
                              • {transaction.supplier}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:block sm:text-right mt-3 sm:mt-0">
                      <p
                        className={`font-bold ${
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          transaction.status === "completed"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {transaction.status === "completed"
                          ? "Hoàn thành"
                          : "Chờ xử lý"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "payroll" && (
        <div className="space-y-6">
          {/* Payroll Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tổng nhân viên */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {staffDatabase.length}
                  </p>
                  <p className="text-sm text-slate-600">Tổng nhân viên</p>
                </div>
              </div>
            </div>

            {/* Tổng lương tháng */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <DollarSign
                    className="h-8 w-8 text-emerald-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      getProcessedStaffData().reduce(
                        (sum, staff) => sum + staff.totalSalary,
                        0
                      )
                    )}
                  </p>
                  <p className="text-sm text-slate-600">Tổng lương tháng</p>
                </div>
              </div>
            </div>

            {/* Tổng làm thêm */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock
                    className="h-8 w-8 text-amber-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {getProcessedStaffData().reduce(
                      (sum, staff) => sum + staff.overtimeHours,
                      0
                    )}
                    h
                  </p>
                  <p className="text-sm text-slate-600">Tổng làm thêm</p>
                </div>
              </div>
            </div>

            {/* Tổng thưởng */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-50 rounded-lg">
                  <Award
                    className="h-8 w-8 text-violet-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      getProcessedStaffData().reduce(
                        (sum, staff) => sum + staff.bonus,
                        0
                      )
                    )}
                  </p>
                  <p className="text-sm text-slate-600">Tổng thưởng</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payroll Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Users className="w-5 h-5" aria-hidden="true" />
                Bảng lương tháng 01/2025
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Nhân viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Chức vụ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Lương cơ bản
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Phụ cấp
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Thưởng
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Khấu trừ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Thực lĩnh
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {getProcessedStaffData().map((staff) => (
                    <tr
                      key={staff.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {staff.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {staff.department}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-2 rounded-full text-[12px] font-medium bg-slate-100 text-slate-800">
                          {staff.position}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                        {formatCurrency(staff.baseSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-900">
                        {formatCurrency(staff.allowances)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-emerald-600">
                        {formatCurrency(staff.bonus)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-red-600">
                        {formatCurrency(staff.deductions)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                        {formatCurrency(staff.totalSalary)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            staff.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          {staff.status === "active" ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "rewards" && (
        <div className="space-y-6">
          {/* Rewards Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <Award className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      getProcessedRewardsPenaltiesData().filter(
                        (r) => r.type === "reward"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-slate-600">Tổng thưởng</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      getProcessedRewardsPenaltiesData().filter(
                        (r) => r.type === "penalty"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-slate-600">Tổng phạt</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      getProcessedRewardsPenaltiesData()
                        .filter(
                          (r) => r.type === "reward" && r.status === "approved"
                        )
                        .reduce((sum, r) => sum + r.amount, 0)
                    )}
                  </p>
                  <p className="text-sm text-slate-600">Tổng tiền thưởng</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <div className="flex items-center space-x-3">
                <Clock className="h-8 w-8 text-amber-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      getProcessedRewardsPenaltiesData().filter(
                        (r) => r.status === "pending"
                      ).length
                    }
                  </p>
                  <p className="text-sm text-slate-600">Chờ duyệt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rewards & Penalties List */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-200">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Award className="w-5 h-5" />
                Danh sách thưởng phạt
              </h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {getProcessedRewardsPenaltiesData().map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          item.type === "reward" ? "bg-emerald-50" : "bg-red-50"
                        }`}
                      >
                        {item.type === "reward" ? (
                          <Award className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-slate-900">
                            {item.staffName}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.type === "reward"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.type === "reward" ? "Thưởng" : "Phạt"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">{item.reason}</p>
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
                    <div className="flex items-center justify-between sm:block sm:text-right mt-3 sm:mt-0">
                      <p
                        className={`font-bold ${
                          item.type === "reward"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.type === "reward" ? "+" : "-"}
                        {formatCurrency(item.amount)}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          item.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {item.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "attendance" && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              Tính năng đang được phát triển
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Module chấm công đang được phát triển để mang đến trải nghiệm tốt
              nhất cho việc quản lý thời gian làm việc của nhân viên.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Đang trong quá trình phát triển
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Dự kiến hoàn thành Q2 2025
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedTab === "reports" && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="text-center py-12">
            <Receipt className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Báo cáo đang được phát triển
            </h3>
            <p className="text-slate-600">
              Tính năng báo cáo chi tiết sẽ được cập nhật trong phiên bản tiếp
              theo
            </p>
          </div>
        </div>
      )}

      {/* Add Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setIsAddDialogOpen(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Thêm giao dịch mới
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Nhập thông tin giao dịch để thêm vào danh sách
                      </p>
                    </div>
                  </div>
                  <button
                    title="Đóng dialog"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Loại giao dịch
                      </label>
                      <CustomSelect
                        options={addTransactionTypeOptions}
                        value={newTransactionType}
                        onChange={setNewTransactionType}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số tiền
                      </label>
                      <input
                        type="text"
                        placeholder="1,000,000"
                        title="Nhập số tiền giao dịch"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Danh mục
                    </label>
                    <CustomSelect
                      options={transactionCategoryOptions}
                      value={newTransactionCategory}
                      onChange={setNewTransactionCategory}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      placeholder="Mô tả chi tiết giao dịch..."
                      rows={3}
                      title="Mô tả chi tiết về giao dịch"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Ngày giao dịch
                      </label>
                      <input
                        type="date"
                        title="Chọn ngày thực hiện giao dịch"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Khách hàng/Nhà cung cấp
                      </label>
                      <input
                        type="text"
                        placeholder="Tên..."
                        title="Tên khách hàng hoặc nhà cung cấp"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  title="Lưu giao dịch mới"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Thêm giao dịch
                </button>
                <button
                  type="button"
                  title="Hủy thao tác"
                  onClick={() => setIsAddDialogOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
