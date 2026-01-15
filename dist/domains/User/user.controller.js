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
const user_services_1 = __importDefault(require("./user.services"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_services_1.default.getAllUsers();
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "Create Notification",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: users,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
const userDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const users = yield user_services_1.default.userDetails(user === null || user === void 0 ? void 0 : user._id);
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "User Details",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: users,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
const userDetailsUpdated = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const users = yield user_services_1.default.userDetailsUpdated(user === null || user === void 0 ? void 0 : user._id, req.body);
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "User Details",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: users,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
const singleFileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "User Details",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
const multipleFileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(http_status_1.default.CREATED).json((0, response_1.response)({
            message: "User Details",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
const userController = {
    getAllUsers,
    userDetails,
    singleFileUpload,
    multipleFileUpload,
    userDetailsUpdated,
};
exports.default = userController;
