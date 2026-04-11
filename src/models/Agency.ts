import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

/** Cây đại lý: parentAgencyId = null là gốc */
const AgencySchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    parentAgencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      default: null,
      index: true,
    },
    path: { type: String, default: "", index: true },
    level: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AgencySchema.index({ parentAgencyId: 1, code: 1 });

export type AgencyDocument = InferSchemaType<typeof AgencySchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Agency: Model<AgencyDocument> =
  mongoose.models.Agency ?? mongoose.model<AgencyDocument>("Agency", AgencySchema);
