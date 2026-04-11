import type { ElectricBillPeriod } from "@/types/electric-bill";

export function periodsDtoToMongoSchema(periods: ElectricBillPeriod[]) {
  return periods.map((p) => ({
    ky: p.ky,
    amount: p.amount,
    paymentDeadline: p.paymentDeadline ? new Date(p.paymentDeadline) : null,
    scanDate: p.scanDate ? new Date(p.scanDate) : null,
    scanDdMm: p.scanDdMm ?? null,
    ca: p.ca ?? null,
    assignedAgencyId: p.assignedAgencyId ?? null,
    assignedAgencyName: p.assignedAgencyName ?? null,
    dlGiaoName: p.dlGiaoName ?? null,
    paymentConfirmed: Boolean(p.paymentConfirmed),
    cccdConfirmed: Boolean(p.cccdConfirmed),
    customerName: p.customerName ?? null,
    cardType: p.cardType ?? null,
    dealCompletedAt: p.dealCompletedAt ? new Date(p.dealCompletedAt) : null,
  }));
}
