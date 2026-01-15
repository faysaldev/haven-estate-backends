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
const auth_service_1 = __importDefault(require("./auth.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
// console log
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.register(req.body);
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "User Created Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, code } = req.body;
        yield auth_service_1.default.verifyEmail(email, Number(code));
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Verification Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield auth_service_1.default.loginUser(email, password);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Login User Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.forgotPassword(req.body.email);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Verification Sended Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { code, newPassword, email } = req.body;
        const user = yield auth_service_1.default.resetPassword(email, code, newPassword);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Password Reset Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const resendVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.resendVerificationEmail(req.body.email);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Resend Verification Code Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield auth_service_1.default.deleteUser(req.params.userId);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "User Delete Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const refreshToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!refreshToken)
            return res.status(400).json({ error: "Refresh token required" });
        const user = yield auth_service_1.default.logout(refreshToken);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "User Created Successful",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: user,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const authController = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    resendVerification,
    deleteUser,
    logout,
};
exports.default = authController;
