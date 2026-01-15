"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth.controller"));
const validation_middleware_1 = __importDefault(require("../../middlewares/validation.middleware"));
const auth_validation_1 = __importDefault(require("./auth.validation"));
const router = (0, express_1.Router)();
// Auth Routes
router.post("/register", (0, validation_middleware_1.default)(auth_validation_1.default.registerValidation), auth_controller_1.default.register);
router.post("/verify-email", (0, validation_middleware_1.default)(auth_validation_1.default.verificationValidation), auth_controller_1.default.verifyEmail);
router.post("/login", (0, validation_middleware_1.default)(auth_validation_1.default.loginValidation), auth_controller_1.default.login);
router.post("/forgot-password", (0, validation_middleware_1.default)(auth_validation_1.default.forgotPasswordValidation), auth_controller_1.default.forgotPassword);
router.post("/reset-password", (0, validation_middleware_1.default)(auth_validation_1.default.resetPasswordValidation), auth_controller_1.default.resetPassword);
router.post("/resend-verification", (0, validation_middleware_1.default)(auth_validation_1.default.resendVerificationValidation), auth_controller_1.default.resendVerification);
router.delete("/delete/:userId", auth_controller_1.default.deleteUser);
router.post("/logout", auth_controller_1.default.logout);
exports.default = router;
