import mongoose, { Document, Model } from "mongoose";

export interface IAgent {
  name: string;
  number: string;
  email: string;
}

export interface IAdmin extends Document {
  agents: IAgent[];
  termsAndConditions: string;
  privacyPolicy: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new mongoose.Schema<IAgent>({
  name: { type: String, required: true },
  number: { type: String, required: true },
  email: { type: String, required: true },
});

const adminSchema = new mongoose.Schema<IAdmin>(
  {
    agents: { type: [agentSchema], default: [] },
    termsAndConditions: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
  },
  { timestamps: true }
);

const Admin: Model<IAdmin> = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;
