export type StaffRole = "photographer" | "assistant" | "makeup";

export interface StaffBasic {
  id: number;
  name: string;
  phone?: string;
  role: StaffRole;
}

// Simple shared staff dataset for pickers
export const staffDirectory: StaffBasic[] = [
  { id: 1, name: "Nguyễn Văn Photographer", phone: "0123456789", role: "photographer" },
  { id: 2, name: "Hoàng Văn Assistant", phone: "0123456793", role: "assistant" },
  { id: 3, name: "Lê Thị Makeup", phone: "0911222333", role: "makeup" },
  { id: 4, name: "Trần Thị Makeup", phone: "0933444555", role: "makeup" },
  { id: 5, name: "Lê Văn Photographer", phone: "0909009009", role: "photographer" },
];

export const getStaffByRole = (role: StaffRole) =>
  staffDirectory.filter((s) => s.role === role);

