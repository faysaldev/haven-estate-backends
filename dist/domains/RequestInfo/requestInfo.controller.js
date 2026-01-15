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
const requestInfo_service_1 = __importDefault(require("./requestInfo.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
// Controller to create a new request info
const createRequestInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const requestInfoData = req.body;
        const requestInfo = yield requestInfo_service_1.default.createRequestInfo(Object.assign(Object.assign({}, requestInfoData), { author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
        res.status(201).json({
            message: "Request Info Created Successfully",
            data: requestInfo,
        });
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get all request info with filtering and pagination
const getAllRequestInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, status, property_id } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status: status,
            property_id: property_id,
        };
        const result = yield requestInfo_service_1.default.getAllRequestInfo(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Request Info",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get all request info with filtering and pagination
const getMyRequestInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { page = 1, limit = 10, status, property_id } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status: status,
            property_id: property_id,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        };
        const result = yield requestInfo_service_1.default.getMyRequestInfo(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Request Info",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get a request info by its ID
const getRequestInfoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestInfoId = req.params.id;
        const requestInfo = yield requestInfo_service_1.default.getRequestInfoById(requestInfoId);
        if (!requestInfo) {
            return res.status(404).json({ error: "Request Info not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Request Info Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: requestInfo,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update status of a request info
const updateRequestInfoStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestInfoId = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        const validStatuses = ["unread", "read", "archived"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        const updatedRequestInfo = yield requestInfo_service_1.default.updateRequestInfoStatus(requestInfoId, status);
        if (!updatedRequestInfo) {
            return res.status(404).json({ error: "Request Info not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Request Info Status Updated",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: updatedRequestInfo,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to delete a request info
const deleteRequestInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestInfoId = req.params.id;
        const deletedRequestInfo = yield requestInfo_service_1.default.deleteRequestInfo(requestInfoId);
        if (!deletedRequestInfo) {
            return res.status(404).json({ error: "Request Info not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Request Info Deleted Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
exports.default = {
    createRequestInfo,
    getAllRequestInfo,
    getRequestInfoById,
    deleteRequestInfo,
    updateRequestInfoStatus,
    getMyRequestInfo,
};
