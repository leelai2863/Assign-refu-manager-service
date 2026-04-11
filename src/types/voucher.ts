/** Trạng thái mã theo spec */
export const VoucherStatus = {
  New: 0,
  Scanned_Has_Bill: 1,
  Agency_Uploaded: 2,
  Manager_Approved: 3,
  Mailed: 4,
} as const;

export type VoucherStatusValue = (typeof VoucherStatus)[keyof typeof VoucherStatus];

export const VOUCHER_STATUS_LABELS: Record<VoucherStatusValue, string> = {
  0: "Chờ quét",
  1: "Chờ upload",
  2: "Chờ duyệt",
  3: "Đã duyệt",
  4: "Hoàn thành",
};

export type UserRole = "admin" | "agency" | "code_manager" | "mail_user";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Admin / Hệ thống",
  agency: "Đại lý",
  code_manager: "Quản lý mã",
  mail_user: "Gửi mail",
};

export interface CustomerProfileDraft {
  fullName?: string;
  idNumber?: string;
  dateOfBirth?: string;
  address?: string;
  billAmount?: number;
  billReference?: string;
  rawOcrNotes?: string;
}

export interface VoucherRow {
  _id: string;
  code: string;
  status: VoucherStatusValue;
  agencyId?: string | null;
  agencyName?: string;
  billingScanHasBill?: boolean | null;
  customerProfile?: CustomerProfileDraft;
  cccdImageKey?: string;
  billImageKey?: string;
  approvedAt?: string | null;
  mailedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
