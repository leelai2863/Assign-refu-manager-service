import OpenAI from "openai";
import { z } from "zod";

const ExtractedSchema = z.object({
  fullName: z.string().optional(),
  idNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  billAmount: z.number().optional(),
  billReference: z.string().optional(),
  rawOcrNotes: z.string().optional(),
});

export type OcrExtractedFields = z.infer<typeof ExtractedSchema>;

/**
 * Gọi OpenAI Vision để trích xuất trường từ ảnh CCCD hoá đơn (tiếng Việt).
 * Ảnh nên là URL công khai tạm hoặc base64 data URL — tuân policy lưu trữ.
 */
export async function extractFieldsFromImage(params: {
  imageUrl?: string;
  base64DataUrl?: string;
  promptHint: "cccd" | "bill";
}): Promise<{ fields: OcrExtractedFields; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const client = new OpenAI({ apiKey });

  const imageContent =
    params.base64DataUrl != null
      ? ({ type: "image_url" as const, image_url: { url: params.base64DataUrl } })
      : params.imageUrl != null
        ? ({ type: "image_url" as const, image_url: { url: params.imageUrl } })
        : null;

  if (!imageContent) {
    throw new Error("Provide imageUrl or base64DataUrl");
  }

  const system =
    params.promptHint === "cccd"
      ? "Bạn là OCR chuyên gia CCCD Việt Nam. Trả về JSON thuần các trường: fullName, idNumber (số CCCD), dateOfBirth (dd/mm/yyyy), address. Không thêm markdown."
      : "Bạn là OCR hoá đơn điện. Trả về JSON thuần: billAmount (số), billReference (mã tham chiếu nếu có), fullName nếu thấy. Không thêm markdown.";

  const res = await client.chat.completions.create({
    model: process.env.OPENAI_VISION_MODEL ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      {
        role: "user",
        content: [
          { type: "text", text: "Trích xuất và chỉ trả về một object JSON hợp lệ." },
          imageContent,
        ],
      },
    ],
    max_tokens: 800,
  });

  const text = res.choices[0]?.message?.content?.trim() ?? "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
  const fields = ExtractedSchema.parse(raw);
  return { fields, model: res.model };
}

/**
 * Quét cước: xác định mã có tồn tại bản ghi cước hay không (theo batch logic nghiệp vụ).
 * Ở đây là stub có cấu trúc — thực tế map với file cước / API nhà mạng.
 */
export async function aiBillingPresenceCheck(params: {
  code: string;
  contextSnippet?: string;
}): Promise<{ hasBill: boolean; confidence: number; notes?: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  const client = new OpenAI({ apiKey });
  const res = await client.chat.completions.create({
    model: process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          'Trả lời JSON duy nhất: {"hasBill": boolean, "confidence": number 0-1, "notes": string}. ' +
          "hasBill=true nếu dữ liệu cho thấy mã có cước/hoá đơn hợp lệ trong ngữ cảnh.",
      },
      {
        role: "user",
        content: `Mã: ${params.code}\nNgữ cảnh: ${params.contextSnippet ?? "(không có)"}`,
      },
    ],
    max_tokens: 200,
  });
  const text = res.choices[0]?.message?.content?.trim() ?? "{}";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  const raw = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
  return {
    hasBill: Boolean(raw.hasBill),
    confidence: typeof raw.confidence === "number" ? raw.confidence : 0.5,
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}
