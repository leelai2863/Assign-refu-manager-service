import { randomUUID } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { Agency } from "@/models/Agency";
import type { AgencyOption } from "@/types/electric-bill";

function docToOption(d: { _id: unknown; name: string; code: string }): AgencyOption {
  return { id: String(d._id), name: d.name, code: d.code };
}

/** Danh sách đại lý đang hoạt động (dùng cho Giao mã, cây đại lý, …). */
export async function listAgencyOptions(): Promise<AgencyOption[]> {
  await connectDB();
  const docs = await Agency.find({ isActive: true }).sort({ name: 1 }).lean();
  return docs.map(docToOption);
}

function suggestUniqueCode(): string {
  return `DL-${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
}

export async function createAgency(input: { name: string; code?: string }): Promise<AgencyOption> {
  await connectDB();
  const name = input.name.trim();
  if (!name) throw new Error("Tên đại lý không được để trống");

  let code = input.code?.trim() ?? "";
  if (!code) {
    for (let i = 0; i < 8; i++) {
      const candidate = suggestUniqueCode();
      const exists = await Agency.exists({ code: candidate });
      if (!exists) {
        code = candidate;
        break;
      }
    }
    if (!code) throw new Error("Không tạo được mã đại lý, thử lại");
  } else {
    code = code.toUpperCase();
  }

  const doc = await Agency.create({
    name,
    code,
    parentAgencyId: null,
    path: "",
    level: 0,
    isActive: true,
  });
  return docToOption(doc);
}

export function isMongoDuplicateKeyError(e: unknown): boolean {
  return typeof e === "object" && e !== null && "code" in e && (e as { code: number }).code === 11000;
}
