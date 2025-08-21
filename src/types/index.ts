// types/menu.ts
import type { LucideIcon } from "lucide-react";

export type MenuKey =
  | "dashboard"
  | "appointments"
  | "schedule"
  | "contracts"
  | "accounting"
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
