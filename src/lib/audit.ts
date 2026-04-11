import type { Types } from "mongoose";
import { AuditLog } from "@/models/AuditLog";

export type AuditAction =
  | "voucher.assign"
  | "voucher.upload_ocr"
  | "voucher.profile_update"
  | "voucher.approve"
  | "voucher.mail_sent"
  | "voucher.status_change"
  | "billing_scan.start"
  | "billing_scan.complete"
  | "electric.assign_agency"
  | "electric.invoice_patch"
  | "agency.create"
  | "auth.login";

export async function writeAuditLog(params: {
  actorUserId: Types.ObjectId | string;
  action: AuditAction;
  entityType: string;
  entityId: Types.ObjectId | string;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}) {
  await AuditLog.create({
    actorUserId: params.actorUserId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId,
    metadata: params.metadata ?? {},
    ip: params.ip ?? null,
    userAgent: params.userAgent ?? null,
  });
}
