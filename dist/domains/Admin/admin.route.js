"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = __importDefault(require("./admin.controller"));
const agent_controller_1 = __importDefault(require("../Agent/agent.controller"));
const agent_validation_1 = require("../Agent/agent.validation");
const zodValidation_middleware_1 = require("../../middlewares/validations/zodValidation.middleware");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get dashboard statistics
router.get("/dashboard-stats", admin_controller_1.default.getDashboardStats);
// Get recent activities
router.get("/recent-activity", admin_controller_1.default.getRecentActivity);
// Get top properties by views
router.get("/top-properties-views", admin_controller_1.default.getTopPropertiesViews);
// Add agents - directly access from agents model
router.post("/agents", (0, zodValidation_middleware_1.zodValidate)(agent_validation_1.createAgentSchema, "body"), auth_middleware_1.authMiddleware, agent_controller_1.default.addAgents);
// Get agents - directly access from agents model
router.get("/agents", agent_controller_1.default.getAgents);
// Update terms and conditions
router.put("/terms-conditions", admin_controller_1.default.updateTermsAndConditions);
// Update privacy policy
router.put("/privacy-policy", admin_controller_1.default.updatePrivacyPolicy);
// Get terms and conditions
router.get("/terms-conditions", admin_controller_1.default.getTermsAndConditions);
// Get privacy policy
router.get("/privacy-policy", admin_controller_1.default.getPrivacyPolicy);
exports.default = router;
