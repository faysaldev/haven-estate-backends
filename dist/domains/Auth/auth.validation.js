"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const registerValidation = joi_1.default.object({
    name: joi_1.default.string().min(3).required(),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .min(8)
        .pattern(/[a-zA-Z]/)
        .pattern(/\d/)
        .required(),
    phoneNumber: joi_1.default.string().min(10).required(),
    role: joi_1.default.string().required().valid("user", "admin"),
});
const verificationValidation = joi_1.default.object({
    code: joi_1.default.number().required(),
    email: joi_1.default.string().email().required(),
});
const loginValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    fcmToken: joi_1.default.string(),
});
const forgotPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
// Reset Password Validation Schema
const resetPasswordValidation = joi_1.default.object({
    code: joi_1.default.string().length(6).required(),
    email: joi_1.default.string().email().required(),
    newPassword: joi_1.default.string()
        .min(8)
        .pattern(/[a-zA-Z]/)
        .pattern(/\d/)
        .required(),
});
// Resend Verification Email Validation Schema
const resendVerificationValidation = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
const authValidator = {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    resendVerificationValidation,
    verificationValidation,
};
exports.default = authValidator;
