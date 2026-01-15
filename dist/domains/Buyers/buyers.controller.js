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
const buyers_service_1 = __importDefault(require("./buyers.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
const mail_service_1 = require("../../lib/mail.service");
const contacts_1 = require("../../lib/templates/contacts");
// Controller to get recent activities
const getRecentActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const activities = yield buyers_service_1.default.getRecentActivity((_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
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
// Controller to get Sending Email
const sendingMailtoOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, phone, message } = req.body;
    const templateBody = (0, contacts_1.contactPageTemplates)(name, phone, email, message);
    const sendingEmail = yield (0, mail_service_1.sendEmail)(email, "Thanks For Message to Haven Estate" + name, templateBody);
    try {
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Thanks For Sending The Mail. We will contact with you soon!",
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
exports.default = {
    getRecentActivity,
    sendingMailtoOwner,
};
