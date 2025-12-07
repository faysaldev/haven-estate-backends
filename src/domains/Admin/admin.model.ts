import mongoose, { Document, Model } from "mongoose";

export interface IAdmin extends Document {
  termsAndConditions: string;
  privacyPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    termsAndConditions: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
