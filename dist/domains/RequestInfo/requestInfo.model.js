"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const requestInfoSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    property_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Property",
        required: true,
    },
    status: {
        type: String,
        default: "unread",
        enum: ["unread", "read", "archived"],
    },
}, { timestamps: true });
const RequestInfo = mongoose_1.default.model("RequestInfo", requestInfoSchema);
exports.default = RequestInfo;
