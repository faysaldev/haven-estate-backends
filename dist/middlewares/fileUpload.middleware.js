"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinaryFileUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const ENV_1 = require("../config/ENV");
// Configure Cloudinary
cloudinary_1.v2.config({
    cloud_name: ENV_1.CLOUDINARY_CLOUD_NAME,
    api_key: ENV_1.CLOUDINARY_API_KEY,
    api_secret: ENV_1.CLOUDINARY_API_SECRET,
});
// Middleware for local file upload
const userFileUploadMiddleware = (uploadFolder) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadFolder); // Set the destination folder
        },
        filename: (req, file, cb) => {
            const extname = path_1.default.extname(file.originalname);
            const filename = Date.now() + "-" + file.fieldname + extname; // Unique file name
            cb(null, filename);
        },
    });
    return (0, multer_1.default)({
        storage,
        limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png/;
            const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);
            if (extname && mimetype) {
                return cb(null, true); // If file is valid, allow it
            }
            else {
                const error = new Error("Only image files are allowed!");
                error.code = "INVALID_FILE_TYPE";
                return cb(error, false);
            }
        },
    });
};
// Middleware for Cloudinary file upload
const cloudinaryFileUploadMiddleware = () => {
    return (0, multer_1.default)({
        limits: { fileSize: 10 * 1024 * 1024 }, // Max file size: 10MB
        fileFilter: (req, file, cb) => {
            const fileTypes = /jpeg|jpg|png/;
            const extname = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
            const mimetype = fileTypes.test(file.mimetype);
            if (extname && mimetype) {
                return cb(null, true); // If file is valid, allow it
            }
            else {
                const error = new Error("Only image files are allowed!");
                error.code = "INVALID_FILE_TYPE";
                return cb(error, false);
            }
        },
    });
};
exports.cloudinaryFileUploadMiddleware = cloudinaryFileUploadMiddleware;
exports.default = userFileUploadMiddleware;
