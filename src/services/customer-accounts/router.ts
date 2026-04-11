import { Router, type Request, type Response } from "express";
import { connectDB } from "@/lib/mongodb";
import { CustomerAccount } from "@/models/CustomerAccount";

const router = Router();

// ─── GET /api/customer-accounts ──────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    await connectDB();

    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(500, Math.max(1, Number(req.query.limit) || 100));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [
        { customerCode: re },
        { companyName: re },
        { stationCode: re },
        { evnUser: re },
        { evnRegion: re },
      ];
    }

    const [docs, total] = await Promise.all([
      CustomerAccount.find(filter).sort({ customerCode: 1 }).skip(skip).limit(limit).lean(),
      CustomerAccount.countDocuments(filter),
    ]);

    res.json({
      data: docs.map((d) => ({
        _id: String(d._id),
        customerCode: d.customerCode,
        companyName: d.companyName ?? null,
        stationCode: d.stationCode ?? null,
        evnUser: d.evnUser ?? null,
        evnPass: d.evnPass ?? null,
        evnRegion: d.evnRegion ?? null,
        active: d.active,
        note: d.note ?? null,
        createdAt: (d as unknown as { createdAt: Date }).createdAt,
        updatedAt: (d as unknown as { updatedAt: Date }).updatedAt,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("GET /customer-accounts error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ─── POST /api/customer-accounts/import ──────────────────────────────────────
// Body: { rows: Array<{ customerCode, companyName?, stationCode?, evnUser?, evnPass?, evnRegion? }> }
router.post("/import", async (req: Request, res: Response) => {
  const { rows } = req.body as {
    rows: {
      customerCode: string;
      companyName?: string;
      stationCode?: string;
      evnUser?: string;
      evnPass?: string;
      evnRegion?: string;
    }[];
  };

  if (!Array.isArray(rows) || rows.length === 0) {
    res.status(400).json({ error: "rows không hợp lệ hoặc rỗng" });
    return;
  }

  if (rows.length > 5000) {
    res.status(400).json({ error: "Tối đa 5000 dòng mỗi lần import" });
    return;
  }

  try {
    await connectDB();

    const ops = rows
      .map((r) => {
        const code = typeof r.customerCode === "string" ? r.customerCode.trim() : "";
        if (!code) return null;
        return {
          updateOne: {
            filter: { customerCode: code },
            update: {
              $set: {
                customerCode: code,
                companyName: r.companyName?.trim() ?? null,
                stationCode: r.stationCode?.trim() ?? null,
                evnUser: r.evnUser?.trim() ?? null,
                evnPass: r.evnPass ?? null,
                evnRegion: r.evnRegion?.trim() ?? null,
              },
              $setOnInsert: { active: true },
            },
            upsert: true,
          },
        };
      })
      .filter(Boolean) as Parameters<typeof CustomerAccount.bulkWrite>[0];

    const result = await CustomerAccount.bulkWrite(ops, { ordered: false });

    res.json({
      ok: true,
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: ops.length,
    });
  } catch (err) {
    console.error("POST /customer-accounts/import error:", err);
    res.status(500).json({ error: "Lỗi server khi import" });
  }
});

// ─── DELETE /api/customer-accounts/:id ───────────────────────────────────────
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const deleted = await CustomerAccount.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Không tìm thấy" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /customer-accounts/:id error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

// ─── PATCH /api/customer-accounts/:id (toggle active) ────────────────────────
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    await connectDB();
    const { active, note, evnPass } = req.body as {
      active?: boolean;
      note?: string;
      evnPass?: string;
    };
    const update: Record<string, unknown> = {};
    if (active !== undefined) update.active = active;
    if (note !== undefined) update.note = note;
    if (evnPass !== undefined) update.evnPass = evnPass;

    const doc = await CustomerAccount.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    ).lean();
    if (!doc) {
      res.status(404).json({ error: "Không tìm thấy" });
      return;
    }
    res.json({ ok: true, data: doc });
  } catch (err) {
    console.error("PATCH /customer-accounts/:id error:", err);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
