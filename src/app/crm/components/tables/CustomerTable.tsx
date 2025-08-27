import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { getStatusInfo } from "../../utils/helper";
import { Customer } from "@/types";

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
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom text-sm table-fixed">
        <thead className="[&_tr]:border-b">
          <tr className="hover:bg-[#f8fafc]/50 data-[state=selected]:bg-[#f8fafc] border-b transition-colors">
            <th className="h-10 px-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] pl-6 w-[180px] font-semibold text-gray-700">
              Tên khách hàng
            </th>
            <th className="h-10 px-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hidden sm:table-cell w-[120px] font-semibold text-gray-700">
              Số điện thoại
            </th>
            <th className="h-10 px-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hidden md:table-cell w-[120px] font-semibold text-gray-700">
              Trạng thái
            </th>
            <th className="h-10 px-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hidden lg:table-cell w-[100px] font-semibold text-gray-700">
              Nguồn khách
            </th>
            <th className="h-10 px-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hidden lg:table-cell w-[80px] text-center font-semibold text-gray-700">
              Số ghi chú
            </th>
            <th className="h-10 px-2 text-left align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] hidden md:table-cell w-[120px] font-semibold text-gray-700">
              Liên hệ cuối
            </th>
            <th className="h-10 px-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] w-[120px] text-center font-semibold text-gray-700">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {customers.map((customer) => {
            const statusInfo = getStatusInfo(customer.status);

            return (
              <tr
                key={customer.id}
                className="data-[state=selected]:bg-[#f8fafc] border-b hover:bg-gray-50 cursor-pointer transition-colors h-15"
                onClick={() => onSelectCustomer(customer)}
              >
                <td className="p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] pl-6 w-[120px]">
                  <div className="flex items-center gap-3">
                    <div
                      className="font-medium text-gray-900 truncate"
                      title={customer.name}
                    >
                      {customer.name}
                    </div>
                    <div className="sm:hidden flex-shrink-0">
                      <span
                        className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden [a&]:hover:bg-primary/90 text-xs ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>
                  <div
                    className="text-sm text-gray-500 sm:hidden cell-fixed"
                    title={customer.phone || "-"}
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

                <td
                  className="col-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-center gap-1">
                    <button
                      className="flex justify-center items-center touch-manipulation cursor-pointer hover:bg-slate-100 p-3"
                      onClick={() => onSelectCustomer(customer)}
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                    {onEditCustomer && (
                      <button
                        className="flex justify-center items-center touch-manipulation hover:bg-slate-100 p-3"
                        onClick={() => onEditCustomer(customer)}
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    )}
                    {selectedTab === "prospecting" && onCreateContract && (
                      <button
                        className="flex justify-center items-center touch-manipulation hover:bg-emerald-50 text-emerald-600 p-3"
                        onClick={() => onCreateContract(customer)}
                        title="Tạo hợp đồng"
                      >
                        <FileText className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    )}
                    {onDeleteCustomer && (
                      <button
                        className="flex justify-center items-center touch-manipulation hover:bg-red-50 text-red-600 p-3"
                        onClick={() => onDeleteCustomer(customer)}
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
