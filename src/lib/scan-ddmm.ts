/** DD/MM (không năm) — ngày thanh toán theo kỳ */
export function isValidScanDdMm(v: string | null | undefined): boolean {
  if (v == null || !String(v).trim()) return false;
  const s = String(v).trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!m) return false;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  return mo >= 1 && mo <= 12 && d >= 1 && d <= 31;
}

export function normalizeScanDdMm(v: string): string {
  return v.trim();
}

/** Chuẩn hoá nhập tay (1/5, 01-03, …) → dd/mm; null nếu rỗng hoặc không hợp lệ. */
export function normalizeScanDdMmInput(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const m = t.match(/^(\d{1,2})\s*[/.\-]\s*(\d{1,2})$/);
  if (!m) return null;
  const d = Number(m[1]);
  const mo = Number(m[2]);
  const out = `${String(d).padStart(2, "0")}/${String(mo).padStart(2, "0")}`;
  return isValidScanDdMm(out) ? out : null;
}

/** Không cho ngày dd/mm (năm hiện tại) sau hôm nay. */
export function scanDdMmIsNotFuture(ddmm: string): boolean {
  const m = ddmm.trim().match(/^(\d{2})\/(\d{2})$/);
  if (!m) return false;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = new Date().getFullYear();
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return false;
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return d.getTime() <= now.getTime();
}
