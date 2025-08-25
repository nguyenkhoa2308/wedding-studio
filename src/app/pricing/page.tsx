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

const preweddingServices = [
  {
    id: "half-day",
    name: "Gói chụp nửa ngày",
    price: "6.990.000",
    originalPrice: null,
    duration: "4 tiếng",
    location: "Studio",
    popular: false,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
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
    price: "11.990.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "02 địa điểm studio",
    popular: true,
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600",
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
  {
    id: "inner-city",
    name: "Gói chụp nội thành",
    price: "15.990.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Nội thành",
    popular: false,
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600",
    description:
      "Gói chụp với nhiều lựa chọn trang phục và địa điểm nội thành, mang lại sự đa dạng và phong phú trong bộ ảnh cưới.",
    features: [
      "Chụp trong 01 ngày",
      "01 váy Plannie, 01 váy đối tác, và 01 vest chú rể tự chọn",
      "Makeup và làm tóc theo trang phục",
      "01 album Hàn Quốc chất lượng cao (size 20x30cm, 15 tờ/30 trang)",
      "02 ảnh ép gỗ 60x90cm",
      "01 slideshow trình chiếu",
      "Toàn bộ files ảnh gốc",
      "50 ảnh chỉnh sửa hoàn thiện",
    ],
    stats: {
      active: 8,
      completed: 45,
      totalRevenue: 719550000,
    },
  },
  {
    id: "outer-city",
    name: "Gói chụp ngoại thành",
    price: "18.990.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Ngoại thành",
    popular: false,
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    description:
      "Gói cao cấp với địa điểm chụp ngoại thành xinh đẹp, bao gồm thêm nhiều sản phẩm in ảnh và phụ thu địa điểm.",
    features: [
      "Chụp trong 01 ngày",
      "01 váy Plannie, 01 váy đối tác, và 01 vest chú rể tự chọn",
      "Makeup và làm tóc theo trang phục",
      "01 album Hàn Quốc chất lượng cao (size 20x30cm, 15 tờ/30 trang)",
      "02 ảnh ép gỗ 60x90cm và 03 ảnh để bàn",
      "01 slideshow trình chiếu",
      "Toàn bộ files ảnh gốc",
      "50 ảnh chỉnh sửa hoàn thiện",
      "Chi phí thuê địa điểm ngày chụp (tối đa 1.000.000 VND)",
    ],
    stats: {
      active: 6,
      completed: 28,
      totalRevenue: 531720000,
    },
  },
  {
    id: "north-region",
    name: "Gói chụp miền Bắc",
    price: "21.990.000",
    originalPrice: null,
    duration: "2 ngày",
    location: "Miền Bắc",
    popular: false,
    image: "https://images.unsplash.com/photo-1594736797933-d0ab737b09bb?w=600",
    description:
      "Gói dịch vụ chụp ảnh cưới tại miền Bắc với thời gian 2 ngày, phù hợp cho những cặp đôi muốn có trải nghiệm đặc biệt.",
    features: [
      "Chụp trong 02 ngày",
      "01 váy Plannie, 01 váy đối tác",
      "02 vest chú rể tự chọn",
      "Makeup và làm tóc theo trang phục",
      "01 album Hàn Quốc chất lượng cao (size 20x30cm, 15 tờ/30 trang)",
      "02 ảnh ép gỗ 60x90cm và 03 ảnh để bàn",
      "01 slideshow trình chiếu",
      "Toàn bộ files ảnh gốc",
      "50 ảnh chỉnh sửa hoàn thiện",
      "Chi phí thuê địa điểm ngày chụp (tối đa 1.000.000 VND)",
    ],
    stats: {
      active: 3,
      completed: 15,
      totalRevenue: 329850000,
    },
  },
  {
    id: "central-south",
    name: "Gói chụp miền Trung & Nam",
    price: "25.990.000",
    originalPrice: null,
    duration: "2-3 ngày",
    location: "Miền Trung & Nam",
    popular: false,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
    description:
      "Gói dịch vụ cao cấp nhất với thời gian chụp dài và nhiều địa điểm đẹp tại miền Trung và miền Nam.",
    features: [
      "Chụp trong 02-03 ngày",
      "01 váy Plannie, 01 váy đối tác",
      "02 vest chú rể tự chọn",
      "Makeup và làm tóc theo trang phục",
      "01 album Hàn Quốc chất lượng cao (size 20x30cm, 15 tờ/30 trang)",
      "02 ảnh ép gỗ 60x90cm và 03 ảnh để bàn",
      "01 slideshow trình chiếu",
      "Toàn bộ files ảnh gốc",
      "50 ảnh chỉnh sửa hoàn thiện",
      "Chi phí thuê địa điểm ngày chụp (tối đa 1.000.000 VND)",
    ],
    stats: {
      active: 2,
      completed: 8,
      totalRevenue: 207920000,
    },
  },
];

const videoServices = [
  {
    id: "video-1",
    name: "Gói quay Pre-wedding 1",
    price: "8.000.000",
    originalPrice: null,
    duration: "3-5 phút",
    location: "Tùy chọn",
    popular: false,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600",
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
    price: "12.000.000",
    originalPrice: null,
    duration: "3-5 phút",
    location: "Tùy chọn",
    popular: true,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
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
];

const familyPortraitServices = [
  {
    id: "family-studio",
    name: "Gói chụp gia đình (trong studio)",
    price: "6.000.000",
    originalPrice: null,
    duration: "2-3 tiếng",
    location: "Studio",
    popular: false,
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600",
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
  {
    id: "family-outdoor",
    name: "Gói chụp gia đình ngoại cảnh",
    price: "8.000.000",
    originalPrice: null,
    duration: "3-4 tiếng",
    location: "Ngoại cảnh",
    popular: true,
    image: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=600",
    description:
      "Gói chụp ảnh gia đình tại các địa điểm ngoại cảnh đẹp, tạo nên những kỷ niệm tự nhiên và sinh động.",
    features: [
      "02 thợ chụp",
      "Tặng 01 mặt trang điểm",
      "Toàn bộ files ảnh gốc",
      "30 ảnh chỉnh sửa",
      "01 album Hàn Quốc chất lượng cao (size 20x20cm, 10 tờ/20 trang) hoặc 01 ảnh phóng ép gỗ 60x90cm",
      "Áp dụng cho tối đa 06 người",
      "Phụ thu 500.000 VND/người nếu thêm người",
      "Phụ thu thêm 500.000 VND/mặt trang điểm",
    ],
    stats: {
      active: 9,
      completed: 38,
      totalRevenue: 304000000,
    },
  },
  {
    id: "portrait-1",
    name: "Gói chụp chân dung - Studio",
    price: "5.000.000",
    originalPrice: null,
    duration: "2 tiếng",
    location: "Studio",
    popular: false,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600",
    description:
      "Gói chụp chân dung cá nhân trong studio với ánh sáng chuyên nghiệp và không gian đa dạng.",
    features: [
      "Tặng 01 mặt trang điểm",
      "15 ảnh chỉnh sửa chọn lọc",
      "Toàn bộ files ảnh gốc",
      "Không gian studio đa dạng",
      "Hỗ trợ tư vấn trang phục",
      "Giao hàng trong 7 ngày",
    ],
    stats: {
      active: 3,
      completed: 25,
      totalRevenue: 125000000,
    },
  },
  {
    id: "portrait-2",
    name: "Gói chụp chân dung - Ngoại cảnh",
    price: "9.000.000",
    originalPrice: null,
    duration: "3 tiếng",
    location: "01 điểm tự chọn nội thành Hà Nội",
    popular: false,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600",
    description:
      "Gói chụp chân dung tại địa điểm ngoại cảnh theo lựa chọn, tạo nên phong cách chụp ảnh độc đáo.",
    features: [
      "Tặng 01 mặt trang điểm",
      "15 ảnh chỉnh sửa chọn lọc",
      "Toàn bộ files ảnh gốc",
      "Chi phí thuê địa điểm ngày chụp (tối đa 500.000 VND)",
      "Tư vấn chọn địa điểm",
      "Hỗ trợ trang phục và phụ kiện",
    ],
    stats: {
      active: 2,
      completed: 18,
      totalRevenue: 162000000,
    },
  },
];

const weddingDocumentaryServices = [
  {
    id: "doc-photo-1day",
    name: "Gói 1 ngày (Chụp)",
    price: "10.000.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Cùng địa điểm",
    popular: false,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
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
  {
    id: "doc-video-1day",
    name: "Gói 1 ngày (Quay)",
    price: "12.000.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Cùng địa điểm",
    popular: true,
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=600",
    description:
      "Gói quay phim phóng sự cưới với ekip chuyên nghiệp, ghi lại đầy đủ những khoảnh khắc quan trọng.",
    features: [
      "Ekip 02 Camera",
      "01 video thời lượng 05-07 phút",
      "Highlight các khoảnh khắc quan trọng",
      "Chỉnh sửa chuyên nghiệp",
      "Nhạc nền phù hợp",
      "File video 4K",
      "Trailer ngắn cho social media",
    ],
    stats: {
      active: 6,
      completed: 28,
      totalRevenue: 336000000,
    },
  },
  {
    id: "doc-photo-separate",
    name: "Gói (Chụp) Lễ cưới, Tiệc cưới",
    price: "8.000.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Khác ngày với ăn hỏi",
    popular: false,
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600",
    description:
      "Gói chụp ảnh cho lễ cưới và tiệc cưới dành cho các cặp đôi tổ chức ăn hỏi vào ngày khác.",
    features: [
      "Áp dụng: Cô dâu, chú rể tổ chức ăn hỏi và lễ cưới khác ngày",
      "Ekip 02 thợ chụp",
      "01 album Photobook (size 30x30cm, 15 tờ/30 trang)",
      "Toàn bộ files ảnh gốc",
      "60 ảnh chỉnh sửa",
      "Timeline chụp linh hoạt",
    ],
    stats: {
      active: 5,
      completed: 35,
      totalRevenue: 280000000,
    },
  },
  {
    id: "doc-photo-full",
    name: "Gói (Chụp) Ăn hỏi, Lễ cưới, Tiệc cưới",
    price: "12.000.000",
    originalPrice: null,
    duration: "2-3 ngày",
    location: "Khác ngày",
    popular: false,
    image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600",
    description:
      "Gói chụp ảnh toàn diện cho tất cả các nghi lễ trong đám cưới, từ ăn hỏi đến tiệc cưới.",
    features: [
      "Ekip 02 thợ chụp",
      "01 album Photobook (size 30x30cm, 20 tờ/40 trang)",
      "Toàn bộ files ảnh gốc",
      "80 ảnh chỉnh sửa",
      "Coverage đầy đủ tất cả nghi lễ",
      "Coordination với các vendor khác",
    ],
    stats: {
      active: 4,
      completed: 22,
      totalRevenue: 264000000,
    },
  },
  {
    id: "doc-video-separate",
    name: "Gói (Quay) Lễ cưới, Tiệc cưới",
    price: "10.000.000",
    originalPrice: null,
    duration: "1 ngày",
    location: "Khác ngày",
    popular: false,
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600",
    description:
      "Gói quay phim cho lễ cưới và tiệc cưới, tạo nên video kỷ niệm đầy cảm xúc.",
    features: [
      "Ekip 02 Camera",
      "01 video thời lượng 03-05 phút",
      "Multi-angle coverage",
      "Professional editing",
      "Color grading",
      "Sound optimization",
    ],
    stats: {
      active: 3,
      completed: 18,
      totalRevenue: 180000000,
    },
  },
  {
    id: "doc-video-full",
    name: "Gói (Quay) Ăn hỏi, Lễ cưới, Tiệc cưới",
    price: "15.000.000",
    originalPrice: null,
    duration: "2-3 ngày",
    location: "Khác ngày",
    popular: false,
    image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600",
    description:
      "Gói quay phim toàn diện cho tất cả các sự kiện trong đám cưới, từ ăn hỏi đến tiệc cưới.",
    features: [
      "Ekip 02 Camera",
      "01 video thời lượng 05-07 phút",
      "Complete wedding story",
      "Multiple video formats",
      "Social media highlights",
      "Extended storage",
    ],
    stats: {
      active: 2,
      completed: 12,
      totalRevenue: 180000000,
    },
  },
];

const comboServices = [
  {
    id: "combo-1",
    name: "Combo 1 (Pre-wedding Studio + PSC)",
    price: "32.990.000",
    originalPrice: "34.990.000",
    duration: "Combo tiết kiệm",
    location: "Studio + PSC",
    popular: true,
    image: "https://images.unsplash.com/photo-1594736797933-d0ab737b09bb?w=600",
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
  {
    id: "combo-2",
    name: "Combo 2 (Pre-wedding Nội thành + PSC)",
    price: "41.990.000",
    originalPrice: "43.990.000",
    duration: "Combo premium",
    location: "Nội thành + PSC",
    popular: false,
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600",
    description:
      "Combo cao cấp bao gồm chụp pre-wedding nội thành và phóng sự cưới đầy đủ, mang đến trải nghiệm premium hoàn hảo.",
    features: [
      "Pre-wedding Nội thành: Ekip 01 thợ chính, 01 thợ phụ, 01 makeup",
      "Chụp 01 ngày; 01 váy Plannie, 01 váy đối tác, 01 vest chú rể",
      "Makeup và làm tóc, 01 album Hàn Quốc (20x30cm, 15 tờ/30 trang)",
      "02 ảnh ép gỗ 60x90cm, 01 slideshow, 50 ảnh chỉnh sửa",
      "Chụp PSC: Ekip 02 thợ chụp; chụp Ăn hỏi, Lễ cưới, Tiệc cưới",
      "01 album Photobook (30x30cm, 20 tờ/40 trang), 80 ảnh chỉnh sửa",
      "Quay PSC: Ekip 02 Camera; 01 video thời lượng 05-07 phút",
    ],
    stats: {
      active: 5,
      completed: 18,
      totalRevenue: 755820000,
    },
  },
];

const allServices = [
  ...preweddingServices,
  ...videoServices,
  ...familyPortraitServices,
  ...weddingDocumentaryServices,
  ...comboServices,
];

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
    if (dialogMode === "add")
      addService(selectedServiceCategory as any, service);
    else if (dialogMode === "edit")
      editService(selectedServiceCategory as any, service);
  };
  const handleServiceDelete = (serviceId: string) => {
    deleteService(selectedServiceCategory as any, serviceId);
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
                    {allServices.length} gói dịch vụ
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
              {allServices.map((service) => (
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
