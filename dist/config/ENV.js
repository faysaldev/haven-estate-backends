"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FRONT_END_URL = exports.STRIPE_SECRET_KEY = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.JWT_SECRET = exports.MONGODB_URI = exports.PORT = exports.BACKEND_IP = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.BACKEND_IP = process.env.BACKEND_IP;
exports.PORT = parseInt(process.env.PORT, 10);
exports.MONGODB_URI = process.env.MONGODB_URI;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.CLOUDINARY_CLOUD_NAME = process.env
    .CLOUDINARY_CLOUD_NAME;
exports.CLOUDINARY_API_KEY = process.env
    .CLOUDINARY_API_KEY;
exports.CLOUDINARY_API_SECRET = process.env
    .CLOUDINARY_API_SECRET;
exports.STRIPE_SECRET_KEY = process.env
    .STRIPE_SECRET_KEY;
exports.FRONT_END_URL = process.env.FRONT_END_URL;
