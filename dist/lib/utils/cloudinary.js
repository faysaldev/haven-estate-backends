"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromCloudinary = exports.uploadMultipleToCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
/**
 * Uploads a single file to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param options - Cloudinary upload options
 * @returns The result of the upload
 */
const uploadToCloudinary = (fileBuffer, options) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const uploadOptions = Object.assign({ resource_type: "image" }, options);
        cloudinary_1.v2.uploader
            .upload_stream(uploadOptions, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        })
            .end(fileBuffer);
    });
});
exports.uploadToCloudinary = uploadToCloudinary;
/**
 * Uploads multiple files to Cloudinary
 * @param files - Array of file buffers to upload
 * @param options - Cloudinary upload options
 * @returns Array of upload results
 */
const uploadMultipleToCloudinary = (files, options) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadPromises = files.map((file) => (0, exports.uploadToCloudinary)(file.buffer, options));
    return Promise.all(uploadPromises);
});
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
/**
 * Deletes a file from Cloudinary
 * @param publicId - The public ID of the file to delete
 * @returns The result of the deletion
 */
const deleteFromCloudinary = (publicId) => __awaiter(void 0, void 0, void 0, function* () {
    return cloudinary_1.v2.uploader.destroy(publicId);
});
exports.deleteFromCloudinary = deleteFromCloudinary;
