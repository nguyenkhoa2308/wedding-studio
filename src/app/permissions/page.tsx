"use client";

import { useState } from "react";

export function PermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  //   const { users } = useAuth();
  //   const { userRole, hasPermission, isSuperAdmin, isAdmin } = usePermissions();

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ROLES[user.role].label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats calculation
  const totalUsers = users.length;
  const roleDistribution = Object.keys(ROLES).reduce((acc, role) => {
    acc[role as keyof typeof ROLES] = users.filter(
      (u) => u.role === role
    ).length;
    return acc;
  }, {} as Record<keyof typeof ROLES, number>);

  const activeUsers = users.filter((u) => u.status === "active").length;
  const inactiveUsers = users.filter((u) => u.status !== "active").length;

  const getRoleColor = (role: string) => {
    const colors = {
      super_admin: "bg-purple-100 text-purple-800 border-purple-200",
      admin: "bg-blue-100 text-blue-800 border-blue-200",
      manager: "bg-green-100 text-green-800 border-green-200",
      employee: "bg-amber-100 text-amber-800 border-amber-200",
      guest: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[role as keyof typeof colors] || colors.guest;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      suspended: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <div className="mobile-padding mobile-spacing py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-slate-900">Quản lý phân quyền</h1>
          <p className="text-slate-600 mt-1">
            Quản lý vai trò, quyền hạn và người dùng trong hệ thống
          </p>
        </div>

        <PermissionWrapper permission="users::create">
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 mobile-button touch-manipulation">
            <Plus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </PermissionWrapper>
      </div>

      {/* Permission Level Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>
            Cấp độ quyền hạn của bạn: {ROLES[userRole || "guest"].label}
          </strong>
          <br />
          {ROLES[userRole || "guest"].description}
          {!isSuperAdmin() && !isAdmin() && (
            <span className="block mt-1 text-blue-700">
              💡 Một số tính năng có thể bị hạn chế dựa trên vai trò của bạn.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid mobile-grid gap-4">
        <Card className="glass-card border-blue-200/30 touch-manipulation">
          <CardContent className="mobile-card">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {totalUsers}
                </p>
                <p className="text-sm text-slate-600">Tổng người dùng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-emerald-200/30 touch-manipulation">
          <CardContent className="mobile-card">
            <div className="flex items-center space-x-2">
              <UserCheck className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {activeUsers}
                </p>
                <p className="text-sm text-slate-600">Đang hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-200/30 touch-manipulation">
          <CardContent className="mobile-card">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-amber-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {inactiveUsers}
                </p>
                <p className="text-sm text-slate-600">Không hoạt động</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-violet-200/30 touch-manipulation">
          <CardContent className="mobile-card">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-violet-600" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {Object.keys(ROLES).length}
                </p>
                <p className="text-sm text-slate-600">Vai trò có sẵn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution Overview */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Phân bổ vai trò
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(ROLES).map(([roleKey, roleData]) => (
              <div
                key={roleKey}
                className="text-center p-4 bg-gray-50 rounded-lg"
              >
                <div className="mb-2">
                  <Badge className={`${getRoleColor(roleKey)} text-xs`}>
                    Level {roleData.level}
                  </Badge>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  {roleData.label}
                </h3>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {roleDistribution[roleKey as keyof typeof ROLES] || 0}
                </p>
                <p className="text-xs text-gray-500">người dùng</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Users */}
      <Card className="glass">
        <CardContent className="mobile-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm người dùng, email hoặc vai trò..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 mobile-input"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Quick Overview */}
      {searchTerm && (
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Kết quả tìm kiếm ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredUsers.slice(0, 5).map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {user.avatar || user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 text-sm">
                        {user.name}
                      </h3>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={`${getRoleColor(user.role)} text-xs`}>
                      {ROLES[user.role].label}
                    </Badge>
                    <Badge className={`${getStatusColor(user.status)} text-xs`}>
                      {user.status === "active"
                        ? "Hoạt động"
                        : user.status === "inactive"
                        ? "Không hoạt động"
                        : "Bị khóa"}
                    </Badge>
                  </div>
                </div>
              ))}

              {filteredUsers.length > 5 && (
                <p className="text-center text-sm text-gray-500 pt-2">
                  Và {filteredUsers.length - 5} người dùng khác...
                </p>
              )}

              {filteredUsers.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Không tìm thấy người dùng nào phù hợp
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Permission Management */}
      <div className="space-y-6">
        <PermissionWrapper permission="roles::view">
          <RolePermissionManager />
        </PermissionWrapper>

        {/* Access Denied for non-privileged users */}
        {!hasPermission("roles::view") && (
          <Card className="glass border-red-200/30">
            <CardContent className="mobile-card text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Không có quyền truy cập
              </h2>
              <p className="text-gray-600 mb-4">
                Bạn cần quyền cao hơn để quản lý phân quyền và vai trò.
              </p>
              <Badge className={getRoleColor(userRole || "guest")}>
                Vai trò hiện tại: {ROLES[userRole || "guest"].label}
              </Badge>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Help Section */}
      {(isSuperAdmin() || isAdmin()) && (
        <Card className="glass border-blue-200/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4" />
              Hướng dẫn sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  🔑 Quản lý vai trò
                </h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• Super Admin: Quyền cao nhất, quản lý tất cả</li>
                  <li>• Admin: Quản trị hệ thống và dữ liệu</li>
                  <li>• Manager: Điều phối và quản lý</li>
                  <li>• Employee: Thực hiện công việc</li>
                  <li>• Guest: Chỉ xem cơ bản</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  ⚙️ Quản lý quyền hạn
                </h4>
                <ul className="space-y-1 text-gray-600">
                  <li>• View: Xem và đọc dữ liệu</li>
                  <li>• Create: Tạo mới dữ liệu</li>
                  <li>• Edit: Chỉnh sửa dữ liệu</li>
                  <li>• Delete: Xóa dữ liệu</li>
                  <li>• Manage: Quản lý toàn bộ</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
