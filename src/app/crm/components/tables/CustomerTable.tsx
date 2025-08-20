import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { getStatusInfo } from "../../utils/helper";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  avatar: string;
  weddingDate: string;
  budget: string;
  source: string;
  assignedTo: string;
  createdAt: string;
  lastContact: string;
  priority: string;
  notes: any[];
  contractValue?: string;
  contractDate?: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onCreateContract?: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
  selectedTab: string;
}

export default function CustomerTable({
  customers,
  onSelectCustomer,
  onEditCustomer,
  onCreateContract,
  onDeleteCustomer,
  selectedTab,
}: CustomerTableProps) {
  return (
    <table className="table-fixed-layout">
      <thead>
        <tr>
          <th className="pl-6 col-name font-semibold text-gray-700">
            Tên khách hàng
          </th>
          <th className="hidden sm:table-cell col-phone font-semibold text-gray-700">
            Số điện thoại
          </th>
          <th className="hidden md:table-cell col-status font-semibold text-gray-700">
            Trạng thái
          </th>
          <th className="hidden lg:table-cell col-source font-semibold text-gray-700">
            Nguồn khách
          </th>
          <th className="hidden lg:table-cell col-count text-center font-semibold text-gray-700">
            Số ghi chú
          </th>
          <th className="hidden md:table-cell col-date font-semibold text-gray-700">
            Liên hệ cuối
          </th>
          <th className="col-actions text-center font-semibold text-gray-700">
            Hành động
          </th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => {
          const statusInfo = getStatusInfo(customer.status);

          return (
            <tr
              key={customer.id}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onSelectCustomer(customer)}
            >
              <td className="pl-6 col-name">
                <div className="flex items-center gap-3">
                  <div
                    className="font-medium text-gray-900 cell-fixed"
                    title={customer.name}
                  >
                    {customer.name}
                  </div>
                  <div className="sm:hidden flex-shrink-0">
                    <span className={`text-xs ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
                <div
                  className="text-sm text-gray-500 sm:hidden cell-fixed"
                  title={customer.phone || "Chưa có số điện thoại"}
                >
                  {customer.phone || <span className="cell-empty">-</span>}
                </div>
              </td>

              <td className="hidden sm:table-cell col-phone">
                <div
                  className="cell-fixed text-sm"
                  title={customer.phone || "Chưa có số điện thoại"}
                >
                  {customer.phone || <span className="cell-empty">-</span>}
                </div>
              </td>

              <td className="hidden md:table-cell col-status">
                <span className={`text-xs ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </td>

              <td className="hidden lg:table-cell col-source">
                <div
                  className="cell-fixed text-sm"
                  title={customer.source || "Chưa có nguồn"}
                >
                  {customer.source || <span className="cell-empty">-</span>}
                </div>
              </td>

              <td className="hidden lg:table-cell col-count text-center">
                <div className="text-sm font-medium">
                  {customer.notes?.length || 0}
                </div>
              </td>

              <td className="hidden md:table-cell col-date">
                <div
                  className="text-sm cell-fixed"
                  title={
                    customer.lastContact
                      ? new Date(customer.lastContact).toLocaleString("vi-VN")
                      : "Chưa có liên hệ"
                  }
                >
                  {customer.lastContact ? (
                    new Date(customer.lastContact).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  ) : (
                    <span className="cell-empty">-</span>
                  )}
                </div>
              </td>

              <td className="col-actions" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-center gap-1">
                  <button
                    className="h-8 w-8 p-0 mobile-button touch-manipulation hover-lift"
                    onClick={() => onSelectCustomer(customer)}
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {onEditCustomer && (
                    <button
                      className="h-8 w-8 p-0 mobile-button touch-manipulation hover:bg-slate-100 hover-lift"
                      onClick={() => onEditCustomer(customer)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {selectedTab === "prospecting" && onCreateContract && (
                    <button
                      className="h-8 w-8 p-0 mobile-button touch-manipulation hover:bg-emerald-50 hover-lift text-emerald-600"
                      onClick={() => onCreateContract(customer)}
                      title="Tạo hợp đồng"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteCustomer && (
                    <button
                      className="h-8 w-8 p-0 mobile-button touch-manipulation hover:bg-red-50 hover-lift text-red-600"
                      onClick={() => onDeleteCustomer(customer)}
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
