/* eslint-disable @typescript-eslint/no-explicit-any */

// types/menu.ts
import type { LucideIcon } from "lucide-react";

export type MenuKey =
  | "dashboard"
  | "appointments"
  | "schedule"
  | "contracts"
  | "accounting"
  | "pricing"
  | "retouch"
  | "staff"
  | "crm"
  | "permissions"
  | "studio-info"
  | "settings";

export interface MenuItem {
  name: string;
  key: MenuKey;
  icon: LucideIcon;
  path: string;
  //   children?: MenuItem[];
  //   badgeCount?: number;
}

export type AppointmentStatus =
  | "staff_assignment"
  | "waiting_confirmation"
  | "confirmed"
  | "shooting"
  | "completed";

export interface Appointment {
  id: number;
  contractId: number;
  contractNumber: string;
  couple: string;
  date: string;
  time: string;
  location: string;
  package: string;
  status:
    | "staff_assignment"
    | "waiting_confirmation"
    | "confirmed"
    | "shooting"
    | "completed";
  createdAt: string;

  // Staff assignment data
  photographer?: string;
  assistant?: string;
  makeup?: string;
  dressCode?: string;
  equipment?: string[];
  notes?: string;

  // Client confirmation data
  confirmedAt?: string;
  clientNotes?: string;

  // Shooting completion data
  completedAt?: string;
  originalImagesUrl?: string;
  shotCount?: number;
  shootingNotes?: string;

  // Status history
  statusHistory?: Array<{
    from: string;
    to: string;
    timestamp: string;
    data?: any;
  }>;

  // Additional info
  duration?: number; // in hours
  totalAmount?: number;
  customerPhone?: string;
  customerEmail?: string;
}

export interface AdditionalService {
  id: number;
  name: string;
  description?: string;
  price: number;
  addedDate: string;
}

export interface NoteHistory {
  id: number;
  content: string;
  author: string;
  timestamp: string; // ISO 8601 string
  type: "note" | "action" | "contract";
  source: "crm" | "contract";
}

export interface Contract {
  id: number;
  contractNumber: string;
  couple: string;
  package: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  progress: number;
  signedDate: string;
  weddingDate: string;
  status:
    | "waiting_schedule"
    | "scheduled"
    | "original_images" // Gửi ảnh gốc
    | "retouch"
    | "handover"
    | "completed"
    | "cancelled";
  services: string[];
  additionalServices?: AdditionalService[]; // New field for additional services
  paymentSchedule: Array<{
    phase: string;
    amount: number;
    dueDate: string;
    status: "paid" | "pending" | "overdue";
    paidDate?: string;
  }>;
  // Customer info from CRM
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  assignedTo: string;
  source: string;
  // New contract fields
  contractImage?: string;
  note?: string;
  // Note history from CRM
  noteHistory?: NoteHistory[];
  // AI summary status
  aiSummaryStatus?: "pending" | "processing" | "completed" | "failed";
  aiSummaryGeneratedAt?: string;

  // Status tracking and related data
  statusHistory?: Array<{
    from: string;
    to: string;
    timestamp: string;
    data?: any;
  }>;

  // Appointment data (when status is scheduled)
  appointment?: {
    date: string;
    time: string;
    location: string;
    photographer?: string;
    notes?: string;
    contractId: number;
    createdAt: string;
  };

  // Retouch project data (when status is retouch)
  retouchProject?: {
    type: "basic" | "advanced" | "premium" | "custom";
    estimatedDays: number;
    specialRequests?: string;
    contractId: number;
    startDate: string;
    status: "in_progress" | "completed" | "paused";
  };

  // Handover data (when status is handover)
  handover?: {
    readyDate: string;
    deliveryMethod: "drive" | "usb" | "print" | "online";
    notes?: string;
    handoverAt: string;
  };

  // Completion data (when status is completed)
  completion?: {
    deliveryMethod: "drive" | "usb" | "print" | "online";
    deliveryDate: string;
    customerFeedback?: string;
    completedAt: string;
  };

  // Cancellation data (when status is cancelled)
  cancellation?: {
    reason: string;
    refundAmount: number;
    notes?: string;
    cancelledAt: string;
  };

  // External links for images
  originalImagesUrl?: string;
  retouchImagesUrl?: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  originalPrice?: string | null;
  duration?: string;
  location: string;
  image: string;
  description: string;
  features: string[];
  stats?: {
    active: number;
    completed: number;
    totalRevenue: number;
  };
}

export interface AdditionalPricingService {
  id: string;
  name: string;
  price: string;
  description?: string;
}

export interface ServicesData {
  prewedding: Service[];
  video: Service[];
  family: Service[];
  documentary: Service[];
  combo: Service[];
  additional: AdditionalPricingService[];
}

export interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  avatar: string;
  joinDate: string;
  currentTasks: number;
  completedTasks: number;
}

export interface Customer {
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
  notesSummary?: string;
}
