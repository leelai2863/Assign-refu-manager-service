import { Router, type Request, type Response } from "express";
import { agenciesAsTreeRoots } from "@/lib/agency-registry";
import { createAgency, isMongoDuplicateKeyError, listAgencyOptions } from "@/lib/agency-repository";

const router = Router();

async function listHandler(_req: Request, res: Response) {
  try {
    const data = await listAgencyOptions();
    res.json({ data });
  } catch (e) {
    console.error("GET /api/agencies error:", e);
    res.status(500).json({ error: "Lỗi đọc danh sách đại lý" });
  }
}

/** GET /api/agencies — danh sách đại lý (MongoDB) */
router.get("/", listHandler);

/** GET /api/agencies/options — cùng nội dung với GET / (tương thích UI cũ) */
router.get("/options", listHandler);

/** GET /api/agencies/tree — cây cho trang Đại lý */
router.get("/tree", async (_req: Request, res: Response) => {
  try {
    const opts = await listAgencyOptions();
    res.json({ data: agenciesAsTreeRoots(opts) });
  } catch (e) {
    console.error("GET /api/agencies/tree error:", e);
    res.status(500).json({ error: "Lỗi đọc cây đại lý" });
  }
});

/** POST /api/agencies — thêm đại lý (body: { name, code? }) */
router.post("/", async (req: Request, res: Response) => {
  const body = req.body as { name?: string; code?: string };
  const name = typeof body.name === "string" ? body.name : "";
  const code = typeof body.code === "string" ? body.code : undefined;
  try {
    const data = await createAgency({ name, code });
    res.json({ data });
  } catch (e) {
    if (e instanceof Error && e.message.includes("Không tạo được")) {
      res.status(400).json({ error: e.message });
      return;
    }
    if (e instanceof Error && e.message === "Tên đại lý không được để trống") {
      res.status(400).json({ error: e.message });
      return;
    }
    if (isMongoDuplicateKeyError(e)) {
      res.status(400).json({ error: "Mã đại lý đã tồn tại" });
      return;
    }
    console.error("POST /api/agencies error:", e);
    res.status(500).json({ error: "Lỗi lưu đại lý" });
  }
});

export default router;
