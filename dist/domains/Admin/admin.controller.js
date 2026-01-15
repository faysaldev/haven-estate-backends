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
const admin_service_1 = __importDefault(require("./admin.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
// Controller to get dashboard statistics
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield admin_service_1.default.getDashboardStats();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Dashboard Statistics Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: stats,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get recent activities
const getRecentActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield admin_service_1.default.getRecentActivity();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Recent Activities Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: activities,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get top properties by views
const getTopPropertiesViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topProperties = yield admin_service_1.default.getTopPropertiesViews();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Top Properties Views Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: topProperties,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update terms and conditions
const updateTermsAndConditions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { terms } = req.body;
        const result = yield admin_service_1.default.updateTermsAndConditions(terms);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Terms and Conditions Updated Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update privacy policy
const updatePrivacyPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { privacy } = req.body;
        const result = yield admin_service_1.default.updatePrivacyPolicy(privacy);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Privacy Policy Updated Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get terms and conditions
const getTermsAndConditions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield admin_service_1.default.getTermsAndConditions();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Terms and Conditions Retrieved Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result.termsAndConditions,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get privacy policy
const getPrivacyPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield admin_service_1.default.getPrivacyPolicy();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Privacy Policy Retrieved Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result.privacyPolicy,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
exports.default = {
    getDashboardStats,
    getRecentActivity,
    getTopPropertiesViews,
    updateTermsAndConditions,
    updatePrivacyPolicy,
    getTermsAndConditions,
    getPrivacyPolicy,
};
