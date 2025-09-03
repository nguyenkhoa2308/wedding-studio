/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
// import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  MapPin,
  CheckCircle,
  Activity,
  TrendingUp,
  Briefcase,
  Package,
  FileText,
  Eye,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";

import { usePricing } from "@/contexts/PricingContext";
import { AddServiceDialog } from "./components/dialogs/AddServiceDialog";
import { EditServiceDialog } from "./components/dialogs/EditServiceDialog";
import { DeleteServiceDialog } from "./components/dialogs/DeleteServiceDialog";
import { AddAdditionalServiceDialog } from "./components/dialogs/AddAdditionalServiceDialog";
import { EditAdditionalServiceDialog } from "./components/dialogs/EditAdditionalServiceDialog";
import { DeleteAdditionalServiceDialog } from "./components/dialogs/DeleteAdditionalServiceDialog";

const formatCurrency = (amount: string | number) => {
  const num =
    typeof amount === "string"
      ? parseInt(amount.replace(/[^\d]/g, ""))
      : amount;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(num);
};

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: any;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl relative">
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                fill
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-white/90 text-slate-700 text-xs border border-slate-200">
                  {service.duration}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl text-slate-900 mb-1">
                    {service.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-lg">
                      <span className="text-base font-bold">
                        {formatCurrency(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-sm text-rose-500 line-through ml-2">
                          {formatCurrency(service.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={onEdit}
                      aria-label="Chỉnh sửa gói"
                      title="Chỉnh sửa"
                      className="w-8 h-8 p-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Pencil
                        className="w-3 h-3 text-gray-600"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={onDelete}
                      aria-label="Xóa gói"
                      title="Xóa"
                      className="w-8 h-8 p-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2
                        className="w-3 h-3 text-gray-600"
                        aria-hidden="true"
                      />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm text-slate-600">
                    {service.description}
                  </p>
                  {service.location && (
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin
                        className="w-4 h-4 text-slate-500"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-slate-600">
                        {service.location}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.features
                .slice(0, 6)
                .map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2 text-sm">
                    <CheckCircle
                      className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              {service.features.length > 6 && (
                <div className="text-sm text-slate-500">
                  +{service.features.length - 6} tính năng khác
                </div>
              )}
            </div>

            {/* Stats */}
            {service.stats && (
              <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50/50 rounded-lg border border-slate-200/50">
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-blue-100 rounded-full">
                    <Activity
                      className="w-4 h-4 text-blue-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {service.stats.active}
                  </div>
                  <div className="text-xs text-slate-600">Đang làm</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-green-100 rounded-full">
                    <CheckCircle
                      className="w-4 h-4 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {service.stats.completed}
                  </div>
                  <div className="text-xs text-slate-600">Hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1 bg-emerald-100 rounded-full">
                    <TrendingUp
                      className="w-4 h-4 text-emerald-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="text-lg font-bold text-slate-900">
                    {Math.round(service.stats.totalRevenue / 1_000_000)}M
                  </div>
                  <div className="text-xs text-slate-600">Doanh thu</div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center mobile-button touch-manipulation border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-md px-3 py-2"
              >
                <Eye className="w-4 h-4 mr-2" aria-hidden="true" />
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdditionalServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: { id: string; name: string; price: string; description?: string };
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const formatPrice = (price: string) => {
    if (price.includes("%") || price.includes("/")) return price;
    return formatCurrency(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 flex-1">
                {service.name}
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                {onEdit && (
                  <button
                    type="button"
                    onClick={onEdit}
                    aria-label="Chỉnh sửa dịch vụ"
                    title="Chỉnh sửa"
                    className="w-8 h-8 p-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Pencil
                      className="w-3 h-3 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Xóa dịch vụ"
                    title="Xóa"
                    className="w-8 h-8 p-0 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-red-50 hover:border-red-300"
                  >
                    <Trash2
                      className="w-3 h-3 text-gray-600"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            </div>

            {service.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {service.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border border-rose-200 px-3 py-2 rounded-lg">
              <span className="text-sm sm:text-base font-bold">
                {formatPrice(service.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const {
    services,
    addService,
    editService,
    deleteService,
    addAdditionalService,
    editAdditionalService,
    deleteAdditionalService,
  } = usePricing();

  const [selectedTab, setSelectedTab] = useState<"packages" | "additional">(
    "packages"
  );

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedServiceCategory, setSelectedServiceCategory] =
    useState<string>("");
  const [dialogMode, setDialogMode] = useState<
    "add" | "edit" | "delete" | null
  >(null);

  const [selectedAdditionalService, setSelectedAdditionalService] =
    useState<any>(null);
  const [additionalDialogMode, setAdditionalDialogMode] = useState<
    "add" | "edit" | "delete" | null
  >(null);

  const handleEdit = (service: any, category: string) => {
    setSelectedService(service);
    setSelectedServiceCategory(category);
    setDialogMode("edit");
  };
  const handleDelete = (service: any, category: string) => {
    setSelectedService(service);
    setSelectedServiceCategory(category);
    setDialogMode("delete");
  };
  const handleAddService = (category: string) => {
    setSelectedServiceCategory(category);
    setDialogMode("add");
  };
  const handleCloseDialog = () => {
    setDialogMode(null);
    setSelectedService(null);
    setSelectedServiceCategory("");
  };
  const handleServiceSave = (service: any) => {
    if (dialogMode === "add") addService(service);
    else if (dialogMode === "edit") editService(service);
  };
  const handleServiceDelete = (serviceId: string) => {
    deleteService(serviceId);
  };

  const handleEditAdditionalService = (service: any) => {
    setSelectedAdditionalService(service);
    setAdditionalDialogMode("edit");
  };
  const handleDeleteAdditionalService = (service: any) => {
    setSelectedAdditionalService(service);
    setAdditionalDialogMode("delete");
  };
  const handleAddAdditionalService = () => setAdditionalDialogMode("add");
  const handleCloseAdditionalDialog = () => {
    setAdditionalDialogMode(null);
    setSelectedAdditionalService(null);
  };

  console.log("aaaaaa", services);

  return (
    <div className="min-h-screen bg-gray-50 pt-13">
      {/* Header */}
      <div className="mobile-padding bg-white border-b border-gray-200">
        <div className="py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shadow-sm">
              <Briefcase className="w-5 h-5 text-blue-600" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Bảng giá dịch vụ
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Quản lý toàn bộ gói dịch vụ và báo giá của studio
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mobile-padding py-6">
        <div
          role="tablist"
          aria-label="Tabs"
          className="grid w-full grid-cols-2 gap-2 rounded-lg bg-white p-1 border border-gray-200"
        >
          <button
            role="tab"
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
              selectedTab === "packages"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setSelectedTab("packages")}
          >
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Gói dịch vụ</span>
          </button>

          <button
            role="tab"
            className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
              selectedTab === "additional"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
            onClick={() => setSelectedTab("additional")}
          >
            <Package className="w-4 h-4" aria-hidden="true" />
            <span>Dịch vụ</span>
          </button>
        </div>

        {/* Tab panels */}
        {selectedTab === "packages" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <Briefcase
                    className="w-4 h-4 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Gói dịch vụ chính
                  </h2>
                  <p className="text-sm text-gray-500">
                    {services.items.length} gói dịch vụ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddService("main")}
                className="inline-flex items-center mobile-button bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md px-3 py-2"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Thêm gói
              </button>
            </div>

            <div className="space-y-6">
              {services.items.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => handleEdit(service, "main")}
                  onDelete={() => handleDelete(service, "main")}
                />
              ))}
            </div>
          </div>
        )}

        {selectedTab === "additional" && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100">
                  <Package
                    className="w-4 h-4 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Dịch vụ bổ sung
                  </h2>
                  <p className="text-sm text-gray-500">
                    {services.additional.length} dịch vụ
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddAdditionalService}
                className="inline-flex items-center mobile-button bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md px-3 py-2"
              >
                <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                Thêm dịch vụ
              </button>
            </div>

            <div className="space-y-3">
              {services.additional.map((service: any) => (
                <AdditionalServiceCard
                  key={service.id}
                  service={service}
                  onEdit={() => handleEditAdditionalService(service)}
                  onDelete={() => handleDeleteAdditionalService(service)}
                />
              ))}
            </div>

            {/* Note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <FileText
                    className="w-3 h-3 text-blue-600"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">
                    Lưu ý về dịch vụ bổ sung
                  </h4>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Các dịch vụ bổ sung có thể được thêm vào bất kỳ gói chụp ảnh
                    nào. Giá có thể thay đổi tùy theo gói chính và yêu cầu cụ
                    thể của khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {dialogMode === "add" && (
        <AddServiceDialog
          open={true}
          onOpenChange={handleCloseDialog}
          category={selectedServiceCategory}
          onAdd={handleServiceSave}
        />
      )}
      {dialogMode === "edit" && selectedService && (
        <EditServiceDialog
          open={true}
          onOpenChange={handleCloseDialog}
          service={selectedService}
          onEdit={handleServiceSave}
        />
      )}
      {dialogMode === "delete" && selectedService && (
        <DeleteServiceDialog
          open={true}
          onOpenChange={handleCloseDialog}
          service={selectedService}
          onDelete={handleServiceDelete}
        />
      )}

      {additionalDialogMode === "add" && (
        <AddAdditionalServiceDialog
          open={true}
          onOpenChange={handleCloseAdditionalDialog}
          onAdd={addAdditionalService}
        />
      )}
      {additionalDialogMode === "edit" && selectedAdditionalService && (
        <EditAdditionalServiceDialog
          open={true}
          onOpenChange={handleCloseAdditionalDialog}
          service={selectedAdditionalService}
          onEdit={editAdditionalService}
        />
      )}
      {additionalDialogMode === "delete" && selectedAdditionalService && (
        <DeleteAdditionalServiceDialog
          open={true}
          onOpenChange={handleCloseAdditionalDialog}
          service={selectedAdditionalService}
          onDelete={deleteAdditionalService}
        />
      )}
    </div>
  );
}
