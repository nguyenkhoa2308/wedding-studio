// components/PrivateRoute.tsx
import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/contexts/PermissionContext";
import { Permission } from "@/contexts/permissionStore";

interface PrivateRouteProps {
  children: ReactNode;
  permissionRequired?: Permission;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  permissionRequired,
}) => {
  const { user } = useAuth();
  const { hasPermission } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  if (permissionRequired && !hasPermission(permissionRequired)) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Không có quyền truy cập
        </h3>
        <p className="text-gray-500">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;
