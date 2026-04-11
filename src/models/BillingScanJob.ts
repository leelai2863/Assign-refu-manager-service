import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const BillingScanJobSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "running", "completed", "failed"],
      default: "pending",
      index: true,
    },
    totalCodes: { type: Number, default: 0 },
    withBillCount: { type: Number, default: 0 },
    withoutBillCount: { type: Number, default: 0 },
    errorMessage: { type: String, default: null },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    triggeredByUserId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

export type BillingScanJobDocument = InferSchemaType<typeof BillingScanJobSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const BillingScanJob: Model<BillingScanJobDocument> =
  mongoose.models.BillingScanJob ??
  mongoose.model<BillingScanJobDocument>("BillingScanJob", BillingScanJobSchema);
