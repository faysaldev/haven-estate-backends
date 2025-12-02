import mongoose, { Document, Model } from "mongoose";

export interface IProperty extends Document {
  title: string;
  price: number;
  location: string;
  type: "residential" | "commercial" | "land" | "luxury";
  status: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  image: string;
  images?: string[];
  description: string;
  features: string[];
  views: number;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
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
      enum: ["residential", "commercial", "land", "luxury"],
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
    image: { type: String, required: true },
    images: { type: [String] },
    description: { type: String, required: true },
    features: { type: [String], required: true },
    views: { type: Number, default: 0 },
    agent: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Property: Model<IProperty> = mongoose.model<IProperty>(
  "Property",
  propertySchema
);

export default Property;
