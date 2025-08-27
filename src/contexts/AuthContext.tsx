"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Role, canAccessPage as checkPageAccess } from "./permissionStore";

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  department?: string;
  joinDate?: string;
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  permissions?: string[]; // Custom permissions override
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  canAccess: (page: string) => boolean;

  // User management (for admin features)
  users: User[];
  addUser: (userData: Partial<User>) => Promise<User>;
  updateUser: (userId: number, userData: Partial<User>) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  getUsersByRole: (role: Role) => User[];

  // Role management
  getUserRole: (userId: number) => Role | null;
  updateUserRole: (userId: number, newRole: Role) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database with roles
const mockUsers: User[] = [
  {
    id: 1,
    name: "Super Admin",
    email: "superadmin@plannie.vn",
    role: "super_admin",
    avatar: "SA",
    phone: "0123456789",
    department: "Administration",
    joinDate: "2024-01-01",
    status: "active",
    lastLogin: "2025-01-20 09:00:00",
  },
  {
    id: 2,
    name: "Nguyễn Văn Admin",
    email: "admin@plannie.vn",
    role: "admin",
    avatar: "NVA",
    phone: "0123456790",
    department: "Management",
    joinDate: "2024-02-01",
    status: "active",
    lastLogin: "2025-01-19 18:30:00",
  },
  {
    id: 3,
    name: "Trần Thị Manager",
    email: "manager@plannie.vn",
    role: "manager",
    avatar: "TTM",
    phone: "0123456791",
    department: "Operations",
    joinDate: "2024-03-01",
    status: "active",
    lastLogin: "2025-01-19 17:45:00",
  },
  {
    id: 4,
    name: "Lê Văn Employee",
    email: "employee@plannie.vn",
    role: "employee",
    avatar: "LVE",
    phone: "0123456792",
    department: "Photography",
    joinDate: "2024-04-01",
    status: "active",
    lastLogin: "2025-01-19 16:20:00",
  },
  {
    id: 5,
    name: "Phạm Thị Guest",
    email: "guest@plannie.vn",
    role: "guest",
    avatar: "PTG",
    phone: "0123456793",
    department: "Guest",
    joinDate: "2024-05-01",
    status: "active",
    lastLogin: "2025-01-19 14:10:00",
  },
  {
    id: 6,
    name: "Hoàng Văn Photographer",
    email: "photographer@plannie.vn",
    role: "employee",
    avatar: "HVP",
    phone: "0123456794",
    department: "Photography",
    joinDate: "2024-06-01",
    status: "active",
    lastLogin: "2025-01-18 20:15:00",
  },
  {
    id: 7,
    name: "Ngô Thị Designer",
    email: "designer@plannie.vn",
    role: "employee",
    avatar: "NTD",
    phone: "0123456795",
    department: "Design",
    joinDate: "2024-07-01",
    status: "active",
    lastLogin: "2025-01-18 19:30:00",
  },
  {
    id: 8,
    name: "Đặng Văn Accountant",
    email: "accountant@plannie.vn",
    role: "manager",
    avatar: "DVA",
    phone: "0123456796",
    department: "Finance",
    joinDate: "2024-08-01",
    status: "active",
    lastLogin: "2025-01-18 18:45:00",
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Simulate API call to check authentication
        const savedUser = localStorage.getItem("wedding_studio_user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          // Find user in mock database to get latest data
          const currentUser =
            mockUsers.find((u) => u.id === parsedUser.id) || parsedUser;
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("wedding_studio_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user by email in mock database
      const foundUser = mockUsers.find((u) => u.email === email.toLowerCase());

      if (!foundUser) {
        return { success: false, error: "Email không tồn tại trong hệ thống" };
      }

      if (foundUser.status !== "active") {
        return {
          success: false,
          error: "Tài khoản đã bị khóa hoặc vô hiệu hóa",
        };
      }

      // Simple password validation (in real app, this would be properly hashed)
      const validPasswords: Record<string, string> = {
        "superadmin@plannie.vn": "123",
        "admin@plannie.vn": "123",
        "manager@plannie.vn": "123",
        "employee@plannie.vn": "123",
        "guest@plannie.vn": "123",
        "photographer@plannie.vn": "123",
        "designer@plannie.vn": "123",
        "accountant@plannie.vn": "123",
      };

      if (validPasswords[email.toLowerCase()] !== password) {
        return { success: false, error: "Mật khẩu không chính xác" };
      }

      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString().slice(0, 19).replace("T", " "),
      };

      setUser(updatedUser);
      localStorage.setItem("wedding_studio_user", JSON.stringify(updatedUser));

      // Update users list
      setUsers((prev) =>
        prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      );

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: "Đăng nhập thất bại. Vui lòng thử lại." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("wedding_studio_user");
  };

  const updateProfile = async (data: Partial<User>): Promise<void> => {
    if (!user) throw new Error("No user logged in");

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("wedding_studio_user", JSON.stringify(updatedUser));

    // Update in users list
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  const canAccess = (page: string): boolean => {
    if (!user) return false;
    return checkPageAccess(user.role, page);
  };

  // User management functions
  const addUser = async (userData: Partial<User>): Promise<User> => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: userData.name || "New User",
      email: userData.email || "",
      role: userData.role || "guest",
      phone: userData.phone,
      department: userData.department,
      joinDate: new Date().toISOString().split("T")[0],
      status: userData.status || "active",
      avatar:
        userData.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2) || "NU",
    };

    setUsers((prev) => [...prev, newUser]);
    return newUser;
  };

  const updateUser = async (
    userId: number,
    userData: Partial<User>
  ): Promise<void> => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...userData } : u))
    );

    // Update current user if it's their own data
    if (user?.id === userId) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("wedding_studio_user", JSON.stringify(updatedUser));
    }
  };

  const deleteUser = async (userId: number): Promise<void> => {
    if (user?.id === userId) {
      throw new Error("Cannot delete your own account");
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const getUsersByRole = (role: Role): User[] => {
    return users.filter((u) => u.role === role);
  };

  const getUserRole = (userId: number): Role | null => {
    const targetUser = users.find((u) => u.id === userId);
    return targetUser?.role || null;
  };

  const updateUserRole = async (
    userId: number,
    newRole: Role
  ): Promise<void> => {
    await updateUser(userId, { role: newRole });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    updateProfile,
    canAccess,

    // User management
    users,
    addUser,
    updateUser,
    deleteUser,
    getUsersByRole,
    getUserRole,
    updateUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
