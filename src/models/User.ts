import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String },
    role: {
      type: String,
      enum: ["admin", "agency", "code_manager", "mail_user"],
      required: true,
      index: true,
    },
    agencyId: { type: Schema.Types.ObjectId, ref: "Agency", default: null, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type UserDocument = InferSchemaType<typeof UserSchema> & { _id: mongoose.Types.ObjectId };

export const User: Model<UserDocument> =
  mongoose.models.User ?? mongoose.model<UserDocument>("User", UserSchema);
