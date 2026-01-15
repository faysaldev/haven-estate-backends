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
const agent_service_1 = __importDefault(require("./agent.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
// Controller to add agents
const addAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield agent_service_1.default.addAgents(req.body);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Agents Added Successfully",
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
// Controller to get agents
const getAgents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield agent_service_1.default.getAgents();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Agents Retrieved Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result.agents,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error);
        res.status(500).json({ error: handledError.message });
    }
});
exports.default = {
    addAgents,
    getAgents,
};
