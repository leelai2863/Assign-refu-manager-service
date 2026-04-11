import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CustomerProfileSchema = new Schema(
  {
    fullName: String,
    idNumber: String,
    dateOfBirth: String,
    address: String,
    billAmount: Number,
    billReference: String,
    rawOcrNotes: String,
  },
  { _id: false }
);

/**
 * Ảnh CCCD/Bill: chỉ lưu object key / URL đã ký — không lưu binary trong MongoDB.
 * Trường nhạy cảm có thể mã hóa application-level trước khi ghi (xem docs bảo mật).
 */
const VoucherCodeSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, index: true },
    status: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: 0,
      index: true,
    },
    agencyId: { type: Schema.Types.ObjectId, ref: "Agency", default: null, index: true },
    assignedByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    assignedAt: { type: Date, default: null },

    billingScanJobId: { type: Schema.Types.ObjectId, ref: "BillingScanJob", default: null },
    billingScanHasBill: { type: Boolean, default: null },
    billingScanMeta: { type: Schema.Types.Mixed, default: {} },

    cccdImageKey: { type: String, default: null },
    billImageKey: { type: String, default: null },
    /** URL ký tạm cho preview (TTL ngắn) — không lưu lâu dài nếu policy yêu cầu */
    cccdPreviewUrl: { type: String, default: null },
    billPreviewUrl: { type: String, default: null },

    customerProfile: { type: CustomerProfileSchema, default: {} },
    ocrModel: { type: String, default: null },
    ocrConfidence: { type: Number, default: null },

    approvedAt: { type: Date, default: null },
    approvedByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    mailedAt: { type: Date, default: null },
    mailedByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    mailMessageId: { type: String, default: null },
  },
  { timestamps: true }
);

VoucherCodeSchema.index({ status: 1, agencyId: 1 });
VoucherCodeSchema.index({ createdAt: -1 });

export type VoucherCodeDocument = InferSchemaType<typeof VoucherCodeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const VoucherCode: Model<VoucherCodeDocument> =
  mongoose.models.VoucherCode ??
  mongoose.model<VoucherCodeDocument>("VoucherCode", VoucherCodeSchema);
