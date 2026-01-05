import mongoose, { Document, Model } from "mongoose";

export interface IRequestInfo extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  status: "unread" | "read" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const requestInfoSchema = new mongoose.Schema<IRequestInfo>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "read", "archived"],
    },
  },
  { timestamps: true }
);

const RequestInfo: Model<IRequestInfo> = mongoose.model<IRequestInfo>(
  "RequestInfo",
  requestInfoSchema
);
export default RequestInfo;
