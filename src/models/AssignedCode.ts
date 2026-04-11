import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const AssignedCodeSchema = new Schema(
  {
    customerCode: { type: String, required: true, trim: true, index: true },
    amount: { type: Number, required: true, index: true },
    year: { type: Number, required: true, index: true },
    month: { type: Number, required: true, min: 1, max: 12, index: true },
    agencyId: { type: String, required: true, index: true },
    agencyName: { type: String, required: true },
    billId: { type: String, required: true },
    ky: { type: Number, enum: [1, 2, 3], required: true },
    assignedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

AssignedCodeSchema.index({ customerCode: 1, amount: 1, year: 1, month: 1 }, { unique: true });

export type AssignedCodeDocument = InferSchemaType<typeof AssignedCodeSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const AssignedCode: Model<AssignedCodeDocument> =
  mongoose.models.AssignedCode ??
  mongoose.model<AssignedCodeDocument>("AssignedCode", AssignedCodeSchema);
