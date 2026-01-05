import mongoose, { Document, Model } from "mongoose";

export interface IBooking extends Document {
  id: string;
  property: mongoose.Types.ObjectId;
  date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  amount: number;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new mongoose.Schema<IBooking>(
  {
    id: { type: String, required: true, unique: true },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking: Model<IBooking> = mongoose.model<IBooking>(
  "Booking",
  bookingSchema
);
export default Booking;
