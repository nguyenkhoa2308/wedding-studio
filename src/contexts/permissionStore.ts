// Permission system following Laravel Filament Shield pattern

export type Action = "view" | "create" | "edit" | "delete" | "manage";
export type Resource =
  | "dashboard"
  | "appointments"
  | "contracts"
  | "accounting"
  | "staff"
  | "crm"
  | "studio-info"
  | "retouch"
  | "pricing"
  | "settings"
  | "users"
  | "roles"
  | "permissions";

export type Permission = `${Resource}::${Action}`;

export type Role = "super_admin" | "admin" | "manager" | "employee" | "guest";

// Resource definitions with display names
export const RESOURCES: Record<
  Resource,
  { label: string; description: string; icon: string }
> = {
  dashboard: {
    label: "Dashboard",
    description: "Trang tổng quan và thống kê",
    icon: "BarChart3",
  },
  appointments: {
    label: "Lịch hẹn",
    description: "Quản lý lịch hẹn chụp ảnh",
    icon: "Calendar",
  },
  contracts: {
    label: "Hợp đồng",
    description: "Quản lý hợp đồng và thanh toán",
    icon: "FileText",
  },
  accounting: {
    label: "Kế toán",
    description: "Quản lý tài chính và báo cáo",
    icon: "DollarSign",
  },
  staff: {
    label: "Nhân viên",
    description: "Quản lý nhân viên và phân công",
    icon: "Users",
  },
  crm: {
    label: "CRM",
    description: "Quản lý khách hàng và tương tác",
    icon: "UserCheck",
  },
  "studio-info": {
    label: "Thông tin Studio",
    description: "Thông tin và cài đặt studio",
    icon: "Building",
  },
  retouch: {
    label: "Retouch",
    description: "Quản lý chỉnh sửa ảnh",
    icon: "Image",
  },
  pricing: {
    label: "Bảng giá",
    description: "Quản lý gói dịch vụ và giá",
    icon: "Tag",
  },
  settings: {
    label: "Cài đặt",
    description: "Cài đặt hệ thống chung",
    icon: "Settings",
  },
  users: {
    label: "Người dùng",
    description: "Quản lý tài khoản người dùng",
    icon: "User",
  },
  roles: {
    label: "Vai trò",
    description: "Quản lý vai trò và quyền hạn",
    icon: "Shield",
  },
  permissions: {
    label: "Phân quyền",
    description: "Quản lý quyền truy cập chi tiết",
    icon: "Key",
  },
};

// Action definitions
export const ACTIONS: Record<
  Action,
  { label: string; description: string; color: string }
> = {
  view: { label: "Xem", description: "Xem và đọc dữ liệu", color: "blue" },
  create: { label: "Tạo", description: "Tạo mới dữ liệu", color: "green" },
  edit: { label: "Sửa", description: "Chỉnh sửa dữ liệu", color: "amber" },
  delete: { label: "Xóa", description: "Xóa dữ liệu", color: "red" },
  manage: {
    label: "Quản lý",
    description: "Quản lý toàn bộ (tất cả quyền)",
    color: "purple",
  },
};

// Role definitions with display info
export const ROLES: Record<
  Role,
  {
    label: string;
    description: string;
    color: string;
    level: number;
  }
> = {
  super_admin: {
    label: "Super Admin",
    description: "Quyền cao nhất, truy cập tất cả chức năng",
    color: "purple",
    level: 5,
  },
  admin: {
    label: "Admin",
    description: "Quản trị viên, quản lý hệ thống và dữ liệu",
    color: "blue",
    level: 4,
  },
  manager: {
    label: "Manager",
    description: "Quản lý, điều phối công việc và nhân viên",
    color: "green",
    level: 3,
  },
  employee: {
    label: "Employee",
    description: "Nhân viên, thực hiện công việc được phân công",
    color: "amber",
    level: 2,
  },
  guest: {
    label: "Guest",
    description: "Khách, chỉ có quyền xem cơ bản",
    color: "gray",
    level: 1,
  },
};

// Permission matrix - defines what each role can do
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  super_admin: [
    // Full access to everything
    "dashboard::view",
    "dashboard::manage",
    "appointments::view",
    "appointments::create",
    "appointments::edit",
    "appointments::delete",
    "appointments::manage",
    "contracts::view",
    "contracts::create",
    "contracts::edit",
    "contracts::delete",
    "contracts::manage",
    "accounting::view",
    "accounting::create",
    "accounting::edit",
    "accounting::delete",
    "accounting::manage",
    "staff::view",
    "staff::create",
    "staff::edit",
    "staff::delete",
    "staff::manage",
    "crm::view",
    "crm::create",
    "crm::edit",
    "crm::delete",
    "crm::manage",
    "studio-info::view",
    "studio-info::create",
    "studio-info::edit",
    "studio-info::delete",
    "studio-info::manage",
    "retouch::view",
    "retouch::create",
    "retouch::edit",
    "retouch::delete",
    "retouch::manage",
    "pricing::view",
    "pricing::create",
    "pricing::edit",
    "pricing::delete",
    "pricing::manage",
    "settings::view",
    "settings::create",
    "settings::edit",
    "settings::delete",
    "settings::manage",
    "users::view",
    "users::create",
    "users::edit",
    "users::delete",
    "users::manage",
    "roles::view",
    "roles::create",
    "roles::edit",
    "roles::delete",
    "roles::manage",
    "permissions::view",
    "permissions::create",
    "permissions::edit",
    "permissions::delete",
    "permissions::manage",
  ],
  admin: [
    // Admin access - most things but not user/role management
    "dashboard::view",
    "dashboard::manage",
    "appointments::view",
    "appointments::create",
    "appointments::edit",
    "appointments::delete",
    "contracts::view",
    "contracts::create",
    "contracts::edit",
    "contracts::delete",
    "accounting::view",
    "accounting::create",
    "accounting::edit",
    "accounting::delete",
    "staff::view",
    "staff::create",
    "staff::edit",
    "crm::view",
    "crm::create",
    "crm::edit",
    "crm::delete",
    "studio-info::view",
    "studio-info::edit",
    "retouch::view",
    "retouch::create",
    "retouch::edit",
    "retouch::delete",
    "pricing::view",
    "pricing::create",
    "pricing::edit",
    "pricing::delete",
    "settings::view",
    "settings::edit",
    "users::view",
    "users::edit",
    "roles::view",
    "permissions::view",
  ],
  manager: [
    // Manager access - operations focused
    "dashboard::view",
    "appointments::view",
    "appointments::create",
    "appointments::edit",
    "contracts::view",
    "contracts::create",
    "contracts::edit",
    "accounting::view",
    "accounting::create",
    "staff::view",
    "staff::edit",
    "crm::view",
    "crm::create",
    "crm::edit",
    "studio-info::view",
    "retouch::view",
    "retouch::create",
    "retouch::edit",
    "pricing::view",
    "settings::view",
    "users::view",
    "roles::view",
    "permissions::view",
  ],
  employee: [
    // Employee access - basic operations
    "dashboard::view",
    "appointments::view",
    "appointments::create",
    "contracts::view",
    "accounting::view",
    "staff::view",
    "crm::view",
    "crm::create",
    "studio-info::view",
    "retouch::view",
    "retouch::create",
    "pricing::view",
  ],
  guest: [
    // Guest access - view only basics
    "dashboard::view",
    "appointments::view",
    "contracts::view",
    "crm::view",
    "studio-info::view",
    "pricing::view",
  ],
};

// Default permissions for pages (fallback when no specific permission check)
export const PAGE_PERMISSIONS: Record<string, Permission> = {
  dashboard: "dashboard::view",
  appointments: "appointments::view",
  contracts: "contracts::view",
  accounting: "accounting::view",
  staff: "staff::view",
  crm: "crm::view",
  "studio-info": "studio-info::view",
  retouch: "retouch::view",
  pricing: "pricing::view",
  settings: "settings::view",
  permissions: "permissions::view", // Added permissions page permission
};

// Utility functions
export function getAllPermissions(): Permission[] {
  const permissions: Permission[] = [];
  Object.keys(RESOURCES).forEach((resource) => {
    Object.keys(ACTIONS).forEach((action) => {
      permissions.push(`${resource}::${action}` as Permission);
    });
  });
  return permissions;
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const rolePermissions = getPermissionsForRole(userRole);

  // Super admin has all permissions
  if (userRole === "super_admin") {
    return true;
  }

  // Check direct permission
  if (rolePermissions.includes(permission)) {
    return true;
  }

  // Check if user has manage permission for the resource
  const [resource] = permission.split("::") as [Resource, Action];
  const managePermission: Permission = `${resource}::manage`;
  if (rolePermissions.includes(managePermission)) {
    return true;
  }

  return false;
}

export function canAccessPage(userRole: Role, page: string): boolean {
  const permission = PAGE_PERMISSIONS[page];
  if (!permission) return true; // Allow access if no permission defined
  return hasPermission(userRole, permission);
}

export function getResourcePermissions(resource: Resource): Permission[] {
  return Object.keys(ACTIONS).map(
    (action) => `${resource}::${action}` as Permission
  );
}

export function parsePermission(permission: Permission): {
  resource: Resource;
  action: Action;
} {
  const [resource, action] = permission.split("::") as [Resource, Action];
  return { resource, action };
}

export function formatPermission(permission: Permission): string {
  const { resource, action } = parsePermission(permission);
  const resourceLabel = RESOURCES[resource]?.label || resource;
  const actionLabel = ACTIONS[action]?.label || action;
  return `${actionLabel} ${resourceLabel}`;
}

// Role hierarchy helper
export function getRoleLevel(role: Role): number {
  return ROLES[role]?.level || 0;
}

export function isRoleHigherThan(role1: Role, role2: Role): boolean {
  return getRoleLevel(role1) > getRoleLevel(role2);
}

export function canManageRole(managerRole: Role, targetRole: Role): boolean {
  // Super admin can manage all roles
  if (managerRole === "super_admin") return true;

  // Admin can manage manager, employee, guest
  if (managerRole === "admin") {
    return ["manager", "employee", "guest"].includes(targetRole);
  }

  // Manager can manage employee, guest
  if (managerRole === "manager") {
    return ["employee", "guest"].includes(targetRole);
  }

  return false;
}

// Permission groups for UI organization
export const PERMISSION_GROUPS = [
  {
    name: "Quản lý chung",
    resources: ["dashboard", "settings"] as Resource[],
  },
  {
    name: "Khách hàng & Hợp đồng",
    resources: ["crm", "contracts", "appointments"] as Resource[],
  },
  {
    name: "Sản xuất & Dịch vụ",
    resources: ["retouch", "pricing", "studio-info"] as Resource[],
  },
  {
    name: "Quản lý hệ thống",
    resources: [
      "accounting",
      "staff",
      "users",
      "roles",
      "permissions",
    ] as Resource[],
  },
];
