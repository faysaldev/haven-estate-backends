"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Agent",
        required: true,
    },
}, { timestamps: true });
const Property = mongoose_1.default.model("Property", propertySchema);
exports.default = Property;
