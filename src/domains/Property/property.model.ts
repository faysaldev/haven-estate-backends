import mongoose, { Document, Model, Types } from "mongoose";

export interface IProperty extends Document {
  title: string;
  price: number;
  location: string;
  type: "residential" | "commercial" | "land" | "luxury";
  status: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  images?: string[];
  description: string;
  features: string[];
  views: number;
  agent: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<IProperty>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      enum: ["land", "condo", "apartment", "house"],
      required: true,
    },
    status: {
      type: String,
      enum: ["sale", "rent"],
      required: true,
    },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    area: { type: Number, required: true },
    images: { type: [String] },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    views: { type: Number, default: 0 },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: true,
    },
  },
  { timestamps: true }
);

const Property: Model<IProperty> = mongoose.model<IProperty>(
  "Property",
  propertySchema
);

export default Property;
