"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const agent_controller_1 = __importDefault(require("./agent.controller"));
const agent_validation_1 = require("./agent.validation");
const zodValidation_middleware_1 = require("../../middlewares/validations/zodValidation.middleware");
const router = (0, express_1.Router)();
// Add agents with validation
router.post("/", (0, zodValidation_middleware_1.zodValidate)(agent_validation_1.createAgentSchema, "body"), agent_controller_1.default.addAgents);
// Get agents
router.get("/", agent_controller_1.default.getAgents);
exports.default = router;
