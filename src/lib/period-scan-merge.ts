import type { ElectricBillPeriod } from "@/types/electric-bill";

const emptyPeriod = (ky: 1 | 2 | 3, prev?: ElectricBillPeriod): ElectricBillPeriod => ({
  ky,
  amount: prev?.amount ?? null,
  paymentDeadline: prev?.paymentDeadline ?? null,
  scanDate: prev?.scanDate ?? null,
  scanDdMm: prev?.scanDdMm ?? null,
  ca: prev?.ca ?? null,
  assignedAgencyId: prev?.assignedAgencyId ?? null,
  assignedAgencyName: prev?.assignedAgencyName ?? null,
  dlGiaoName: prev?.dlGiaoName ?? null,
  paymentConfirmed: prev?.paymentConfirmed ?? false,
  cccdConfirmed: prev?.cccdConfirmed ?? false,
  customerName: prev?.customerName ?? null,
  cardType: prev?.cardType ?? null,
  dealCompletedAt: prev?.dealCompletedAt ?? null,
});

/**
 * Mỗi lần quét có số tiền: điền vào kỳ 1 → 2 → 3 lần lượt (ô còn trống).
 * Nếu cả 3 đã có số tiền, lần quét mới ghi đè kỳ 3 (lần quét gần nhất).
 */
export function mergeScanAmountIntoPeriods(
  existing: ElectricBillPeriod[] | undefined,
  params: { amount: number | null; deadlineIso: string | null; scanIso: string }
): ElectricBillPeriod[] {
  const base: ElectricBillPeriod[] = [1, 2, 3].map((ky) => {
    const prev = existing?.find((p) => p.ky === ky);
    return emptyPeriod(ky as 1 | 2 | 3, prev);
  });

  if (params.amount == null) return base;

  const emptyIdx = base.findIndex((p) => p.amount == null);
  const idx = emptyIdx >= 0 ? emptyIdx : 2;
  const cur = base[idx];
  base[idx] = {
    ...cur,
    amount: params.amount,
    paymentDeadline: params.deadlineIso ?? cur.paymentDeadline,
    scanDate: params.scanIso,
  };
  return base;
}
