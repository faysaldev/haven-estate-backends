const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
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
    agent: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Create the model
const Property = mongoose.model("Property", propertySchema);

export default Property;
