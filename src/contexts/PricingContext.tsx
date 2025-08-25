"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { AdditionalPricingService, Service, ServicesData } from "@/types";

interface PricingContextType {
  services: ServicesData;
  addService: (category: keyof ServicesData, service: Service) => void;
  editService: (category: keyof ServicesData, service: Service) => void;
  deleteService: (category: keyof ServicesData, serviceId: string) => void;
  addAdditionalService: (service: AdditionalPricingService) => void;
  editAdditionalService: (service: AdditionalPricingService) => void;
  deleteAdditionalService: (serviceId: string) => void;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

// Initial additional services data
const initialAdditionalServices: AdditionalPricingService[] = [
  {
    id: "print-silk-13x18",
    name: "In ảnh ép lụa 13x18cm",
    price: "20.000",
    description:
      "In ảnh ép lụa chất lượng cao với kích thước 13x18cm, phù hợp để làm ảnh lưu niệm hoặc trang trí.",
  },
  {
    id: "print-silk-20x30",
    name: "In ảnh ép lụa 20x30cm",
    price: "45.000",
    description:
      "In ảnh ép lụa với kích thước 20x30cm, chất lượng sắc nét và bền màu theo thời gian.",
  },
  {
    id: "print-silk-30x45",
    name: "In ảnh ép lụa 30x45cm",
    price: "85.000",
    description:
      "In ảnh ép lụa kích thước lớn 30x45cm, thích hợp để trưng bày hoặc làm quà tặng ý nghĩa.",
  },
  {
    id: "print-silk-40x60",
    name: "In ảnh ép lụa 40x60cm",
    price: "150.000",
    description:
      "In ảnh ép lụa kích thước 40x60cm với chất lượng cao cấp, tạo điểm nhấn trang trí đẹp mắt.",
  },
  {
    id: "print-wood-20x30",
    name: "In ảnh ép gỗ 20x30cm",
    price: "180.000",
    description:
      "In ảnh trên chất liệu gỗ cao cấp 20x30cm, mang lại cảm giác ấm áp và tự nhiên cho không gian.",
  },
  {
    id: "print-wood-30x45",
    name: "In ảnh ép gỗ 30x45cm",
    price: "350.000",
    description:
      "In ảnh ép gỗ 30x45cm với công nghệ in hiện đại, bảo quản màu sắc tốt và độ bền cao.",
  },
  {
    id: "print-wood-40x60",
    name: "In ảnh ép gỗ 40x60cm",
    price: "650.000",
    description:
      "In ảnh ép gỗ kích thước 40x60cm, sản phẩm cao cấp phù hợp để trang trí phòng khách hoặc phòng ngủ.",
  },
  {
    id: "print-wood-60x90",
    name: "In ảnh ép gỗ 60x90cm",
    price: "1.200.000",
    description:
      "In ảnh ép gỗ khổ lớn 60x90cm, tạo điểm nhấn trang trí ấn tượng cho không gian rộng.",
  },
  {
    id: "print-wood-80x120",
    name: "In ảnh ép gỗ 80x120cm",
    price: "1.800.000",
    description:
      "In ảnh ép gỗ kích thước 80x120cm, sản phẩm cao cấp phù hợp cho các không gian lớn và sang trọng.",
  },
  {
    id: "print-wood-120x180",
    name: "In ảnh ép gỗ 120x180cm",
    price: "2.200.000",
    description:
      "In ảnh ép gỗ khổ đặc biệt 120x180cm, tạo điểm nhấn nghệ thuật độc đáo cho không gian.",
  },
  {
    id: "extra-album-page-small",
    name: "In thêm từ album (25x25cm hoặc 20x30cm)",
    price: "200.000/tờ",
    description:
      "Dịch vụ in thêm các trang album với kích thước 25x25cm hoặc 20x30cm theo yêu cầu khách hàng.",
  },
  {
    id: "extra-album-page-large",
    name: "In thêm từ album (30x30cm hoặc 25x35cm)",
    price: "250.000/tờ",
    description:
      "Dịch vụ in thêm các trang album với kích thước lớn hơn 30x30cm hoặc 25x35cm.",
  },
  {
    id: "album-size-upgrade",
    name: "Tăng size album lên (30x30cm hoặc 25x35cm)",
    price: "500.000",
    description:
      "Nâng cấp kích thước album từ size tiêu chuẩn lên size lớn hơn để có trải nghiệm xem ảnh tốt hơn.",
  },
  {
    id: "extra-album-small",
    name: "In thêm 1 quyển album cùng thiết kế 15 tờ (25x25cm)",
    price: "2.000.000",
    description:
      "Sản xuất thêm một quyển album hoàn chỉnh với cùng thiết kế, 15 tờ kích thước 25x25cm.",
  },
  {
    id: "extra-album-large",
    name: "In thêm 1 quyển album cùng thiết kế 15 tờ (30x30cm)",
    price: "2.500.000",
    description:
      "Sản xuất thêm một quyển album cao cấp với cùng thiết kế, 15 tờ kích thước 30x30cm.",
  },
  {
    id: "extra-photo-editing",
    name: "Chỉnh sửa thêm ảnh",
    price: "50.000/ảnh",
    description:
      "Dịch vụ chỉnh sửa và hoàn thiện thêm các bức ảnh ngoài số lượng trong gói, bao gồm điều chỉnh màu sắc và độ sáng.",
  },
  {
    id: "leather-cover",
    name: "Bìa giả da",
    price: "300.000",
    description:
      "Nâng cấp bìa album bằng chất liệu giả da cao cấp, tăng tính thẩm mỹ và độ bền cho album.",
  },
  {
    id: "engagement-ceremony-photo",
    name: "Phóng sự Lễ Hằng Thuận Lễ ăn hỏi (6 tiếng) - Chụp",
    price: "6.000.000",
    description:
      "Gói chụp ảnh phóng sự đầy đủ cho lễ ăn hỏi truyền thống trong 6 tiếng, ghi lại mọi khoảnh khắc quan trọng.",
  },
  {
    id: "engagement-ceremony-video",
    name: "Phóng sự Lễ Hằng Thuận Lễ ăn hỏi (6 tiếng) - Quay",
    price: "8.000.000",
    description:
      "Gói quay phim phóng sự hoàn chỉnh cho lễ ăn hỏi trong 6 tiếng, tạo video kỷ niệm đầy ý nghĩa.",
  },
  {
    id: "overtime-fee",
    name: "Phụ thu chụp ngoài 6 tiếng",
    price: "50% giá gói",
    description:
      "Phí phụ trội khi thời gian chụp vượt quá 6 tiếng quy định, tính theo tỷ lệ phần trăm của giá gói chính.",
  },
  {
    id: "bride-pickup-photo",
    name: "Chụp đón dâu (1 thợ)",
    price: "4.000.000",
    description:
      "Dịch vụ chụp ảnh nghi lễ đón dâu với 1 nhiếp ảnh gia, ghi lại những khoảnh khắc đặc biệt này.",
  },
  {
    id: "extra-camera-documentary",
    name: "Thêm 1 máy chụp gói phóng sự",
    price: "3.000.000",
    description:
      "Thêm một nhiếp ảnh gia và thiết bị chụp cho gói phóng sự để có góc chụp đa dạng hơn.",
  },
  {
    id: "extra-camera-traditional",
    name: "Thêm 1 máy chụp gói truyền thống",
    price: "2.000.000",
    description:
      "Bổ sung thêm một nhiếp ảnh gia cho gói chụp truyền thống để tăng chất lượng và số lượng ảnh.",
  },
  {
    id: "highlight-video",
    name: "Thêm 1 video highlight ăn hỏi (trả trong 3 ngày)",
    price: "3.000.000",
    description:
      "Dịch vụ làm video highlight ngắn cho lễ ăn hỏi, giao hàng nhanh trong vòng 3 ngày.",
  },
  {
    id: "outside-hanoi-day",
    name: "Phụ phí chụp ngoài Hà Nội (đi về trong ngày)",
    price: "500.000/thợ",
    description:
      "Phí di chuyển khi chụp ảnh ngoài khu vực Hà Nội trong cùng ngày, tính theo từng nhiếp ảnh gia.",
  },
  {
    id: "outside-hanoi-overnight",
    name: "Phụ phí chụp ngoài Hà Nội (qua đêm)",
    price: "1.000.000/thợ",
    description:
      "Phí di chuyển và lưu trú khi chụp ảnh ngoài Hà Nội qua đêm, bao gồm chi phí nghỉ ngơi cho ekip.",
  },
];

// Initial services data
const initialServicesData: ServicesData = {
  prewedding: [
    {
      id: "half-day",
      name: "Gói chụp nửa ngày",
      price: "6990000",
      originalPrice: null,
      duration: "4 tiếng",
      location: "Studio",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      description:
        "Gói chụp ảnh cưới cơ bản phù hợp cho các cặp đôi có ngân sách vừa phải, vẫn đảm bảo chất lượng ảnh đẹp và dịch vụ chuyên nghiệp.",
      features: [
        "Chụp tại studio của Plannie",
        "Thời gian chụp 4 tiếng (bao gồm cả makeup)",
        "01 váy cưới của Plannie",
        "Makeup và làm tóc theo trang phục",
        "02 ảnh ép gỗ 60x90cm",
        "15 ảnh chỉnh sửa hoàn thiện",
        "Toàn bộ files ảnh gốc",
      ],
      stats: {
        active: 5,
        completed: 32,
        totalRevenue: 223680000,
      },
    },
    {
      id: "studio",
      name: "Gói chụp tại studio",
      price: "11990000",
      originalPrice: null,
      duration: "1 ngày",
      location: "02 địa điểm studio",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
      description:
        "Gói tiêu chuẩn với dịch vụ hoàn chỉnh, bao gồm nhiều địa điểm chụp và sản phẩm đa dạng. Lựa chọn phổ biến nhất của khách hàng.",
      features: [
        "Áp dụng cho 02 địa điểm studio bất kỳ",
        "01 váy cưới tự chọn",
        "01 vest chú rể tự chọn",
        "Makeup và làm tóc theo trang phục",
        "01 album Hàn Quốc chất lượng cao (size 20x30cm, 15 tờ/30 trang)",
        "02 ảnh ép gỗ 60x90cm",
        "01 slideshow trình chiếu",
        "50 ảnh chỉnh sửa hoàn thiện",
        "Toàn bộ files ảnh gốc",
      ],
      stats: {
        active: 12,
        completed: 78,
        totalRevenue: 935220000,
      },
    },
  ],
  video: [
    {
      id: "video-1",
      name: "Gói quay Pre-wedding 1",
      price: "8000000",
      originalPrice: null,
      duration: "3-5 phút",
      location: "Tùy chọn",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
      description:
        "Gói quay video cơ bản với 1 camera, phù hợp cho các cặp đôi muốn có video kỷ niệm đơn giản nhưng chất lượng.",
      features: [
        "Ekip 01 Camera",
        "01 video thời lượng 03-05 phút",
        "Chỉnh sửa chuyên nghiệp",
        "Nhạc nền bản quyền",
        "File video Full HD",
        "Giao hàng trong 14 ngày",
      ],
      stats: {
        active: 4,
        completed: 22,
        totalRevenue: 176000000,
      },
    },
    {
      id: "video-2",
      name: "Gói quay Pre-wedding 2",
      price: "12000000",
      originalPrice: null,
      duration: "3-5 phút",
      location: "Tùy chọn",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
      description:
        "Gói quay video cao cấp với 2 camera, mang lại góc quay đa dạng và chất lượng hình ảnh tuyệt vời.",
      features: [
        "Ekip 02 Camera",
        "01 video thời lượng 03-05 phút",
        "Góc quay đa dạng",
        "Chỉnh sửa chuyên nghiệp",
        "Nhạc nền bản quyền",
        "File video 4K",
        "Trailer ngắn 30s",
        "Giao hàng trong 10 ngày",
      ],
      stats: {
        active: 7,
        completed: 35,
        totalRevenue: 420000000,
      },
    },
  ],
  family: [
    {
      id: "family-studio",
      name: "Gói chụp gia đình (trong studio)",
      price: "6000000",
      originalPrice: null,
      duration: "2-3 tiếng",
      location: "Studio",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600",
      description:
        "Gói chụp ảnh gia đình trong studio với không gian ấm cúng, phù hợp cho các gia đình có trẻ nhỏ.",
      features: [
        "01 thợ chụp",
        "Tặng 01 mặt trang điểm",
        "Toàn bộ files ảnh gốc",
        "30 ảnh chỉnh sửa",
        "01 album Hàn Quốc chất lượng cao (size 20x20cm, 10 tờ/20 trang) hoặc 01 ảnh phóng ép gỗ 60x90cm",
        "Áp dụng cho tối đa 06 người",
        "Phụ thu 500.000 VND/người nếu thêm người",
        "Phụ thu thêm 500.000 VND/mặt trang điểm",
      ],
      stats: {
        active: 6,
        completed: 48,
        totalRevenue: 288000000,
      },
    },
  ],
  documentary: [
    {
      id: "doc-photo-1day",
      name: "Gói 1 ngày (Chụp)",
      price: "10000000",
      originalPrice: null,
      duration: "1 ngày",
      location: "Cùng địa điểm",
      popular: false,
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
      description:
        "Gói chụp phóng sự cưới trong cùng 1 ngày cho các cặp đôi tổ chức tất cả nghi lễ tại một địa điểm.",
      features: [
        "Áp dụng: Cô dâu, chú rể tổ chức ăn hỏi, lễ cưới, và tiệc cưới trong cùng một ngày",
        "Ekip 02 thợ chụp",
        "01 album Photobook (size 30x30cm, 20 tờ/40 trang)",
        "Toàn bộ files ảnh gốc",
        "80 ảnh chỉnh sửa",
        "Backup dữ liệu an toàn",
      ],
      stats: {
        active: 8,
        completed: 42,
        totalRevenue: 420000000,
      },
    },
  ],
  combo: [
    {
      id: "combo-1",
      name: "Combo 1 (Pre-wedding Studio + PSC)",
      price: "32990000",
      originalPrice: "34990000",
      duration: "Combo tiết kiệm",
      location: "Studio + PSC",
      popular: true,
      image:
        "https://images.unsplash.com/photo-1594736797933-d0ab737b09bb?w=600",
      description:
        "Combo tiết kiệm bao gồm chụp pre-wedding tại studio và phóng sự cưới, phù hợp cho các cặp đôi muốn có trải nghiệm hoàn chỉnh với giá hợp lý.",
      features: [
        "Pre-wedding Studio: Ekip 01 thợ chính, 01 thợ phụ, 01 makeup",
        "Chụp 01 ngày; 01 váy cưới tự chọn, 01 vest chú rể tự chọn",
        "Makeup và làm tóc, 01 album Hàn Quốc (20x30cm, 15 tờ/30 trang)",
        "02 ảnh ép gỗ 60x90cm, 01 slideshow, 50 ảnh chỉnh sửa",
        "Chụp PSC: Ekip 02 thợ chụp; chụp Lễ cưới, Tiệc cưới",
        "01 album Photobook (30x30cm, 20 tờ/40 trang), 80 ảnh chỉnh sửa",
        "Quay PSC: Ekip 02 Camera; 01 video thời lượng 03-05 phút",
      ],
      stats: {
        active: 8,
        completed: 28,
        totalRevenue: 923720000,
      },
    },
  ],
  additional: initialAdditionalServices,
};

export function PricingProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServicesData>(initialServicesData);

  const addService = (category: keyof ServicesData, service: Service) => {
    setServices((prev) => ({
      ...prev,
      [category]: [service, ...prev[category]],
    }));
  };

  const editService = (
    category: keyof ServicesData,
    updatedService: Service
  ) => {
    setServices((prev) => ({
      ...prev,
      [category]: prev[category].map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    }));
  };

  const deleteService = (category: keyof ServicesData, serviceId: string) => {
    setServices((prev) => ({
      ...prev,
      [category]: prev[category].filter((service) => service.id !== serviceId),
    }));
  };

  const addAdditionalService = (service: AdditionalPricingService) => {
    setServices((prev) => ({
      ...prev,
      additional: [service, ...prev.additional],
    }));
  };

  const editAdditionalService = (updatedService: AdditionalPricingService) => {
    setServices((prev) => ({
      ...prev,
      additional: prev.additional.map((service) =>
        service.id === updatedService.id ? updatedService : service
      ),
    }));
  };

  const deleteAdditionalService = (serviceId: string) => {
    setServices((prev) => ({
      ...prev,
      additional: prev.additional.filter((service) => service.id !== serviceId),
    }));
  };

  const value: PricingContextType = {
    services,
    addService,
    editService,
    deleteService,
    addAdditionalService,
    editAdditionalService,
    deleteAdditionalService,
  };

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);
  if (context === undefined) {
    throw new Error("usePricing must be used within a PricingProvider");
  }
  return context;
}
