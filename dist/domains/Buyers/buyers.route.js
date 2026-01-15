"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const buyers_controller_1 = __importDefault(require("./buyers.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get recent activities
router.get("/recent-activity", auth_middleware_1.authMiddleware, buyers_controller_1.default.getRecentActivity);
router.post("/send_email", buyers_controller_1.default.sendingMailtoOwner);
exports.default = router;
