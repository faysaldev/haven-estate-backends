import mongoose, { Document, Model } from "mongoose";

export interface IScheduleView extends Document {
  name: string;
  email: string;
  phone: string;
  view_date: Date;
  view_time: string;
  property_id: mongoose.Types.ObjectId;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const scheduleViewSchema = new mongoose.Schema<IScheduleView>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    view_date: { type: Date, required: true },
    view_time: { type: String, required: true },
    property_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    status: {
      type: String,
      default: "Scheduled",
      enum: ["Scheduled", "Completed", "Cancelled"],
    },
  },
  { timestamps: true }
);

const ScheduleView: Model<IScheduleView> = mongoose.model<IScheduleView>("ScheduleView", scheduleViewSchema);
export default ScheduleView;
