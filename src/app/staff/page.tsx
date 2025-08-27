"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  usePermissions,
  PermissionWrapper,
} from "@/contexts/PermissionContext";
import { StaffMember } from "@/types";
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Mail,
  Phone,
  Plus,
  Search,
  Users,
} from "lucide-react";

// Simplified mock staff data
const mockStaff: StaffMember[] = [
  {
    id: 1,
    name: "Nguyễn Văn Photographer",
    email: "photographer@plannie.vn",
    phone: "0123456789",
    department: "Photography",
    position: "Senior Photographer",
    avatar: "NVP",
    joinDate: "2023-01-15",
    currentTasks: 8,
    completedTasks: 156,
  },
  {
    id: 2,
    name: "Trần Thị Designer",
    email: "designer@plannie.vn",
    phone: "0123456790",
    department: "Design",
    position: "Art Director",
    avatar: "TTD",
    joinDate: "2023-03-01",
    currentTasks: 5,
    completedTasks: 98,
  },
  {
    id: 3,
    name: "Lê Văn Editor",
    email: "editor@plannie.vn",
    phone: "0123456791",
    department: "Post-Production",
    position: "Video Editor",
    avatar: "LVE",
    joinDate: "2023-06-20",
    currentTasks: 3,
    completedTasks: 45,
  },
  {
    id: 4,
    name: "Phạm Thị Coordinator",
    email: "coordinator@plannie.vn",
    phone: "0123456792",
    department: "Operations",
    position: "Project Coordinator",
    avatar: "PTC",
    joinDate: "2023-02-10",
    currentTasks: 0,
    completedTasks: 89,
  },
  {
    id: 5,
    name: "Hoàng Văn Assistant",
    email: "assistant@plannie.vn",
    phone: "0123456793",
    department: "Photography",
    position: "Photography Assistant",
    avatar: "HVA",
    joinDate: "2023-08-15",
    currentTasks: 2,
    completedTasks: 23,
  },
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { hasPermission } = usePermissions();

  const filteredStaff = mockStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simplified stats calculation - removed average tasks per staff
  const totalStaff = mockStaff.length;
  const totalTasks = mockStaff.reduce((sum, s) => sum + s.currentTasks, 0);
  const totalCompleted = mockStaff.reduce(
    (sum, s) => sum + s.completedTasks,
    0
  );

  return (
    <div className="p-6 space-y-6 min-h-screen pt-18">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Quản lý nhân viên
          </h1>
          <p className="text-gray-600 mt-1">
            Quản lý thông tin và công việc của nhân viên studio
          </p>
        </div>

        <PermissionWrapper resource="staff" action="create">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhân viên
          </button>
        </PermissionWrapper>
      </div>

      {/* Simplified Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-white shadow-md rounded-lg border border-blue-200 p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {totalStaff}
              </p>
              <p className="text-sm text-gray-600">Tổng nhân viên</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg border border-amber-200 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {totalTasks}
              </p>
              <p className="text-sm text-gray-600">Công việc hiện tại</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg border border-emerald-200 p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {totalCompleted}
              </p>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm nhân viên, vị trí, phòng ban..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-2 px-4 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Staff List */}
      <div className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Danh sách nhân viên
          </h2>
          <span className="text-sm text-gray-600">
            {filteredStaff.length} nhân viên
          </span>
        </div>

        <div className="space-y-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="bg-white shadow-md rounded-lg border-l-4 border-l-blue-500 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                    {staff.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{staff.name}</h3>
                    <p className="text-sm text-gray-600">{staff.position}</p>
                    <p className="text-xs text-gray-500">{staff.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <PermissionWrapper permission="staff::view">
                    <button className="inline-flex items-center border border-gray-300 text-sm text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500/10 cursor-pointer flex-1 sm:flex-0">
                      <Eye className="w-4 h-4 mr-2" />
                      Xem
                    </button>
                  </PermissionWrapper>

                  <PermissionWrapper permission="staff::edit">
                    <button className="inline-flex items-center border border-gray-300 text-sm text-gray-700 py-2 px-3 rounded-md hover:bg-blue-500/10 cursor-pointer flex-1 sm:flex-0">
                      <Edit className="w-4 h-4 mr-2" />
                      Sửa
                    </button>
                  </PermissionWrapper>
                </div>
              </div>

              {/* Basic Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{staff.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{staff.phone}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">
                    Vào làm: {staff.joinDate}
                  </span>
                </div>
              </div>

              {/* Simple Task Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-semibold text-blue-600">
                    {staff.currentTasks}
                  </p>
                  <p className="text-xs text-gray-600">Công việc hiện tại</p>
                </div>

                <div className="text-center">
                  <p className="text-lg font-semibold text-green-600">
                    {staff.completedTasks}
                  </p>
                  <p className="text-xs text-gray-600">Đã hoàn thành</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="bg-white shadow-md rounded-lg p-4 text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy nhân viên
            </h3>
            <p className="text-gray-500">
              Thử thay đổi từ khóa tìm kiếm hoặc thêm nhân viên mới.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
