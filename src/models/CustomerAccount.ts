import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const CustomerAccountSchema = new Schema(
  {
    customerCode: { type: String, required: true, trim: true, unique: true, index: true },
    companyName: { type: String, default: null },
    stationCode: { type: String, default: null },
    evnUser: { type: String, default: null },
    evnPass: { type: String, default: null },
    evnRegion: { type: String, default: null },
    active: { type: Boolean, default: true, index: true },
    note: { type: String, default: null },
  },
  { timestamps: true }
);

export type CustomerAccountDocument = InferSchemaType<typeof CustomerAccountSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const CustomerAccount: Model<CustomerAccountDocument> =
  mongoose.models.CustomerAccount ??
  mongoose.model<CustomerAccountDocument>("CustomerAccount", CustomerAccountSchema);
