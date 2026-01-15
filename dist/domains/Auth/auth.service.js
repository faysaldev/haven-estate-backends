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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_service_1 = require("../../lib/mail.service");
const user_model_1 = __importDefault(require("../User/user.model"));
const auth_token_services_1 = require("./auth.token.services");
// Register User
const register = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, phoneNumber, name } = userData;
    // Check if email or phone number already exists
    const existingUser = yield user_model_1.default.findOne({
        $or: [{ email }, { phoneNumber }],
    });
    if (existingUser)
        throw new Error("Email or Phone number is already taken");
    const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    const newUser = new user_model_1.default({
        name,
        email,
        password,
        phoneNumber,
        oneTimeCode: oneTimeCode, // Generate a one-time code for email verification
    });
    // Save User to DB
    yield newUser.save();
    // Send Email Verification
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${newUser.oneTimeCode}`;
    const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
    yield (0, mail_service_1.sendEmail)(newUser.email, "Verify Your Email Address", emailText);
    return newUser;
});
const verifyEmail = (email, code) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email
    const user = yield user_model_1.default.findOne({ email }).select("name email oneTimeCode");
    if (!user)
        throw new Error("User not found");
    if (user.oneTimeCode !== code)
        throw new Error("Invalid verification code");
    user.isEmailVerified = true;
    user.oneTimeCode = null;
    yield user.save();
    return "Email Verification SuccessFul";
});
// Login User
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email }).select("name email image password phoneNumber role isEmailVerified");
    if (!user)
        throw new Error("User not found");
    // Check if the user's email is verified
    if (!user.isEmailVerified)
        throw new Error("Email is not verified. Please check your email to verify.");
    const isMatch = yield user.isPasswordMatch(password);
    if (!isMatch)
        throw new Error("Invalid credentials");
    // Generate JWT tokens
    const userDetails = {
        userId: user._id.toString(),
        role: user.role,
        name: user.name,
        email: user.email,
        image: user.image,
        password: user.password,
        phoneNumber: user.phoneNumber,
    };
    // Generate JWT tokens
    const accessToken = (0, auth_token_services_1.createToken)(userDetails, process.env.JWT_SECRET, process.env.JWT_EXPIRE_TIME);
    const refreshToken = (0, auth_token_services_1.createRefreshToken)(userDetails);
    return { user, accessToken, refreshToken };
});
// Forgot Password
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.default.findOne({ email }));
    if (!user)
        throw new Error("User not found");
    const resetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    user.oneTimeCode = resetCode;
    yield user.save();
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?code=${resetCode}`;
    const emailText = `Please click the following link to reset your password: ${resetLink}`;
    (0, mail_service_1.sendEmail)(user.email, "Reset Your Password", emailText);
    return { message: "Password reset email sent" };
});
// Reset Password
const resetPassword = (email, code, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.default.findOne({
        email,
        oneTimeCode: Number(code),
    }));
    if (!user) {
        throw new Error("Invalid reset code");
    }
    else {
        user.password = newPassword;
        user.isResetPassword = true;
        user.oneTimeCode = null;
        yield user.save();
        return { message: "Password successfully reset" };
    }
});
// Resend Verification Email
const resendVerificationEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.default.findOne({ email }));
    if (!user)
        throw new Error("User not found");
    const oneTimeCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    user.oneTimeCode = oneTimeCode;
    user.save();
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?code=${oneTimeCode}`;
    const emailText = `Please click the following link to verify your email address: ${verificationLink}`;
    (0, mail_service_1.sendEmail)(user.email, "Verify Your Email Address", emailText);
    return { message: "Verification email resent" };
});
// Delete User
const deleteUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = (yield user_model_1.default.findById(userId));
    if (!user)
        throw new Error("User not found");
    user.isDeleted = true;
    yield user.save();
    return { message: "User deleted successfully" };
});
// Logout
const logout = (refreshToken) => {
    return { message: "User logged out" };
};
const userService = {
    register,
    verifyEmail,
    loginUser,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    deleteUser,
    logout,
};
exports.default = userService;
