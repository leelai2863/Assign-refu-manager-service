import { Router, type Request, type Response } from "express";
import { connectDB } from "@/lib/mongodb";
import { BillingScanHistory } from "@/models/BillingScanHistory";
import { ElectricBillRecord } from "@/models/ElectricBillRecord";
import { serializeElectricBill, billHasIncompletePeriod } from "@/lib/electric-bill-serialize";
import { VGREEN_SCANNED_ORDER } from "@/data/vgreen-scanned-batch";
import type { ElectricBillDto } from "@/types/electric-bill";
import { serializeHistory } from "@/lib/electric-bill-serialize";

const router = Router();

/** GET /api/billing-scan/jobs */
router.get("/jobs", async (_req: Request, res: Response) => {
  res.status(410).json({
    error: "Billing scan job đã ngừng sử dụng.",
    data: [],
  });
});

/** POST /api/billing-scan/jobs */
router.post("/jobs", async (_req: Request, res: Response) => {
  res.status(410).json({
    error: "Billing scan job đã ngừng sử dụng.",
  });
});

/** GET /api/billing-scan/history */
router.get("/history", async (_req: Request, res: Response) => {
  try {
    await connectDB();
    const rows = await BillingScanHistory.find().sort({ scannedAt: -1 }).limit(500).lean();
    res.json({
      data: rows.map((r) => serializeHistory(r as Record<string, unknown>)),
      source: "mongodb",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Không đọc được MongoDB";
    res.status(503).json({ error: message, data: [] });
  }
});

/** GET /api/billing-scan/scanned-codes */
router.get("/scanned-codes", async (_req: Request, res: Response) => {
  function sortVgreen(a: ElectricBillDto, b: ElectricBillDto) {
    const ia = VGREEN_SCANNED_ORDER.indexOf(a.customerCode);
    const ib = VGREEN_SCANNED_ORDER.indexOf(b.customerCode);
    if (ia === -1 && ib === -1) return a.customerCode.localeCompare(b.customerCode);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  }

  try {
    await connectDB();
    // Chỉ lấy bill chưa dealCompletedAt (bill-level) để tránh tải toàn bộ
    const docs = await ElectricBillRecord.find({
      company: "V-GREEN",
      $or: [{ dealCompletedAt: null }, { dealCompletedAt: { $exists: false } }],
    }).lean();
    const data = (docs as unknown as Record<string, unknown>[])
      .map((d) => serializeElectricBill(d))
      // Lọc thêm cấp period: bỏ bill không còn kỳ nào chưa hoàn tất
      .filter(billHasIncompletePeriod)
      .sort(sortVgreen);
    res.json({ data, source: "mongodb" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Không đọc được MongoDB";
    res.status(503).json({ error: message, data: [] });
  }
});

export default router;
