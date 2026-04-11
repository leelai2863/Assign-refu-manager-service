import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BillingScanHistorySchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: "BillingScanJob", default: null, index: true },
    customerCode: { type: String, required: true, index: true },
    amount: { type: Number, default: null },
    status: { type: String, enum: ["has_bill", "no_bill"], required: true },
    scannedAt: { type: Date, required: true, index: true },
    note: { type: String, default: null },
  },
  { timestamps: true }
);

BillingScanHistorySchema.index({ scannedAt: -1 });

export type BillingScanHistoryDocument = InferSchemaType<typeof BillingScanHistorySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BillingScanHistory: Model<BillingScanHistoryDocument> =
  mongoose.models.BillingScanHistory ??
  mongoose.model<BillingScanHistoryDocument>("BillingScanHistory", BillingScanHistorySchema);
