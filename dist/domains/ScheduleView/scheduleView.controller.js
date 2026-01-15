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
const scheduleView_service_1 = __importDefault(require("./scheduleView.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
// Controller to create a new schedule view
const createScheduleView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const scheduleViewData = req.body;
        const scheduleView = yield scheduleView_service_1.default.createScheduleView(Object.assign({ author: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, scheduleViewData));
        res.status(201).json({
            message: "Schedule View Created Successfully",
            data: scheduleView,
        });
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get all schedule views with filtering and pagination
const getAllScheduleViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, status, property_id } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status: status,
            property_id: property_id,
        };
        const result = yield scheduleView_service_1.default.getAllScheduleViews(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Schedule Views",
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
// Controller to get all schedule views with filtering and pagination
const getMyScheduleViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const result = yield scheduleView_service_1.default.getMyScheduleViews(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Schedule Views",
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
// Controller to get a schedule view by its ID
const getScheduleViewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleViewId = req.params.id;
        const scheduleView = yield scheduleView_service_1.default.getScheduleViewById(scheduleViewId);
        if (!scheduleView) {
            return res.status(404).json({ error: "Schedule View not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Schedule View Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: scheduleView,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update status of a schedule view
const updateScheduleViewStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleViewId = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        const validStatuses = ["Scheduled", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        const updatedScheduleView = yield scheduleView_service_1.default.updateScheduleViewStatus(scheduleViewId, status);
        if (!updatedScheduleView) {
            return res.status(404).json({ error: "Schedule View not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Schedule View Status Updated",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: updatedScheduleView,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to delete a schedule view
const deleteScheduleView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scheduleViewId = req.params.id;
        const deletedScheduleView = yield scheduleView_service_1.default.deleteScheduleView(scheduleViewId);
        if (!deletedScheduleView) {
            return res.status(404).json({ error: "Schedule View not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Schedule View Deleted Successfully",
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
    createScheduleView,
    getAllScheduleViews,
    getScheduleViewById,
    deleteScheduleView,
    updateScheduleViewStatus,
    getMyScheduleViews,
};
