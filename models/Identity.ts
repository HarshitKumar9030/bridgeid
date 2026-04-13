import mongoose, { Schema, type Document, type Model } from "mongoose";

export type NeedCategory = "Food" | "Job" | "Healthcare" | "Shelter" | "Other";
export type UrgencyLevel = "Low" | "Medium" | "High";

export interface IIdentity extends Document {
  identityId: string;
  alias: string;
  ageRange: string;
  skills: string[];
  needs: NeedCategory[];
  needDescription: string;
  urgency: UrgencyLevel;
  photoUrl?: string;
  photoKey?: string;
  location: string;
  trustScore: number;
  ngoVerified: boolean;
  communityConfirmations: number;
  interactionsCount: number;
  qrCodeDataUrl: string;
  createdByUserId: string;
  createdAt: Date;
  updatedAt: Date;
}

const IdentitySchema = new Schema<IIdentity>(
  {
    identityId: { type: String, required: true, unique: true, index: true },
    alias: { type: String, required: true, trim: true },
    ageRange: { type: String, required: true },
    skills: { type: [String], default: [] },
    needs: { type: [String], default: [] },
    needDescription: { type: String, default: "" },
    urgency: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    photoUrl: { type: String },
    photoKey: { type: String },
    location: { type: String, default: "Unspecified" },
    trustScore: { type: Number, default: 0 },
    ngoVerified: { type: Boolean, default: false },
    communityConfirmations: { type: Number, default: 0 },
    interactionsCount: { type: Number, default: 0 },
    qrCodeDataUrl: { type: String, required: true },
    createdByUserId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

IdentitySchema.index({ trustScore: -1, createdAt: -1 });

const Identity = (mongoose.models.Identity as Model<IIdentity>) || mongoose.model<IIdentity>("Identity", IdentitySchema);

export default Identity;
