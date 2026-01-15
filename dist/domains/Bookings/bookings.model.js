"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bookingSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    id: { type: String, required: true, unique: true },
    property: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    date: { type: Date, default: Date.now() },
    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },
    amount: { type: Number, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
}, { timestamps: true });
const Booking = mongoose_1.default.model("Booking", bookingSchema);
exports.default = Booking;
