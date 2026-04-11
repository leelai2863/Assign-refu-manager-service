import type { ElectricBillPeriod } from "@/types/electric-bill";
import { isValidScanDdMm } from "@/lib/scan-ddmm";

/** Đủ điều kiện ✓ hoàn tất cho một kỳ (chuyển Đi mail). */
export function isPeriodReadyForDealCompletion(p: ElectricBillPeriod): boolean {
  if (p.dealCompletedAt) return false;
  if (p.amount == null) return false;
  if (!p.assignedAgencyId?.trim()) return false;
  if (!p.customerName?.trim()) return false;
  if (!p.paymentConfirmed || !p.cccdConfirmed) return false;
  if (!isValidScanDdMm(p.scanDdMm)) return false;
  if (p.ca !== "10h" && p.ca !== "16h" && p.ca !== "24h") return false;
  return true;
}
