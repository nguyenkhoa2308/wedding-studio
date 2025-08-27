"use client";

import React, { createContext, useContext, ReactNode } from "react";
import {
  Role,
  Permission,
  Resource,
  Action,
  hasPermission as checkPermission,
  canAccessPage as checkPageAccess,
  getPermissionsForRole,
  canManageRole as checkRoleManagement,
  RESOURCES,
  ACTIONS,
} from "./permissionStore";
import { useAuth } from "./AuthContext";

interface PermissionContextType {
  // Permission checking
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  canAccessPage: (page: string) => boolean;
  canPerformAction: (resource: Resource, action: Action) => boolean;

  // Role management
  canManageRole: (targetRole: Role) => boolean;
  canEditUser: (targetRole: Role) => boolean;
  canDeleteUser: (targetRole: Role) => boolean;

  // User permissions
  userPermissions: Permission[];
  userRole: Role | null;

  // Permission metadata
  getAllowedActions: (resource: Resource) => Action[];
  getAccessibleResources: () => Resource[];

  // UI helpers
  shouldShowElement: (permission: Permission) => boolean;
  shouldShowPage: (page: string) => boolean;
  shouldShowAction: (resource: Resource, action: Action) => boolean;

  // Admin helpers
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  isManager: () => boolean;
  isEmployee: () => boolean;
  isGuest: () => boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(
  undefined
);

interface PermissionProviderProps {
  children: ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const { user } = useAuth();

  const userRole: Role | null = (user?.role as Role) || null;
  const userPermissions: Permission[] = userRole
    ? getPermissionsForRole(userRole)
    : [];

  // Core permission checking
  const hasPermission = (permission: Permission): boolean => {
    if (!userRole) return false;
    return checkPermission(userRole, permission);
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return permissions.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    if (!userRole) return false;
    return permissions.every((permission) => hasPermission(permission));
  };

  const canAccessPage = (page: string): boolean => {
    if (!userRole) return false;
    return checkPageAccess(userRole, page);
  };

  const canPerformAction = (resource: Resource, action: Action): boolean => {
    const permission: Permission = `${resource}::${action}`;
    return hasPermission(permission);
  };

  // Role management
  const canManageRole = (targetRole: Role): boolean => {
    if (!userRole) return false;
    return checkRoleManagement(userRole, targetRole);
  };

  const canEditUser = (targetRole: Role): boolean => {
    return hasPermission("users::edit") && canManageRole(targetRole);
  };

  const canDeleteUser = (targetRole: Role): boolean => {
    return hasPermission("users::delete") && canManageRole(targetRole);
  };

  // User permissions analysis
  const getAllowedActions = (resource: Resource): Action[] => {
    if (!userRole) return [];

    const allowedActions: Action[] = [];
    Object.keys(ACTIONS).forEach((action) => {
      if (canPerformAction(resource, action as Action)) {
        allowedActions.push(action as Action);
      }
    });

    return allowedActions;
  };

  const getAccessibleResources = (): Resource[] => {
    if (!userRole) return [];

    const accessibleResources: Resource[] = [];
    Object.keys(RESOURCES).forEach((resource) => {
      if (canPerformAction(resource as Resource, "view")) {
        accessibleResources.push(resource as Resource);
      }
    });

    return accessibleResources;
  };

  // UI helpers
  const shouldShowElement = (permission: Permission): boolean => {
    return hasPermission(permission);
  };

  const shouldShowPage = (page: string): boolean => {
    return canAccessPage(page);
  };

  const shouldShowAction = (resource: Resource, action: Action): boolean => {
    return canPerformAction(resource, action);
  };

  // Role type checkers
  const isAdmin = (): boolean => userRole === "admin" || isSuperAdmin();
  const isSuperAdmin = (): boolean => userRole === "super_admin";
  const isManager = (): boolean => userRole === "manager" || isAdmin();
  const isEmployee = (): boolean => userRole === "employee" || isManager();
  const isGuest = (): boolean => userRole === "guest";

  const value: PermissionContextType = {
    // Permission checking
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPage,
    canPerformAction,

    // Role management
    canManageRole,
    canEditUser,
    canDeleteUser,

    // User permissions
    userPermissions,
    userRole,

    // Permission metadata
    getAllowedActions,
    getAccessibleResources,

    // UI helpers
    shouldShowElement,
    shouldShowPage,
    shouldShowAction,

    // Admin helpers
    isAdmin,
    isSuperAdmin,
    isManager,
    isEmployee,
    isGuest,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissions(): PermissionContextType {
  const context = useContext(PermissionContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }
  return context;
}

// Convenience hooks for common checks
export function useCanAccess(permission: Permission): boolean {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
}

export function useCanAccessPage(page: string): boolean {
  const { canAccessPage } = usePermissions();
  return canAccessPage(page);
}

export function useCanPerform(resource: Resource, action: Action): boolean {
  const { canPerformAction } = usePermissions();
  return canPerformAction(resource, action);
}

export function useIsRole(role: Role): boolean {
  const { userRole } = usePermissions();
  return userRole === role;
}

export function useIsAdmin(): boolean {
  const { isAdmin } = usePermissions();
  return isAdmin();
}

export function useIsSuperAdmin(): boolean {
  const { isSuperAdmin } = usePermissions();
  return isSuperAdmin();
}

// Component-level permission wrapper
interface PermissionWrapperProps {
  children: ReactNode;
  permission?: Permission;
  resource?: Resource;
  action?: Action;
  page?: string;
  fallback?: ReactNode;
  requireAll?: boolean; // For multiple permissions
  permissions?: Permission[];
}

export function PermissionWrapper({
  children,
  permission,
  resource,
  action,
  page,
  fallback = null,
  requireAll = false,
  permissions = [],
}: PermissionWrapperProps) {
  const {
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    canAccessPage,
    canPerformAction,
  } = usePermissions();

  let hasAccess = false;

  // Check specific permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }
  // Check resource + action
  else if (resource && action) {
    hasAccess = canPerformAction(resource, action);
  }
  // Check page access
  else if (page) {
    hasAccess = canAccessPage(page);
  }
  // Check multiple permissions
  else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Higher-order component for page-level permission checking
export function withPermissions<T extends object>(
  Component: React.ComponentType<T>,
  requiredPermission: Permission | string,
  fallbackComponent?: React.ComponentType<T>
) {
  return function PermissionCheckedComponent(props: T) {
    const { hasPermission, canAccessPage } = usePermissions();

    const hasAccess =
      typeof requiredPermission === "string"
        ? canAccessPage(requiredPermission)
        : hasPermission(requiredPermission);

    if (!hasAccess) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...props} />;
      }
      return (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center p-6">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Không có quyền truy cập
            </h2>
            <p className="text-gray-600">
              Bạn không có quyền truy cập tính năng này.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
