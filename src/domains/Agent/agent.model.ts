import mongoose, { Document, Model } from "mongoose";

export interface IAgent extends Document {
  name: string;
  number: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const agentSchema = new mongoose.Schema<IAgent>(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const Agent: Model<IAgent> = mongoose.model<IAgent>("Agent", agentSchema);

export default Agent;