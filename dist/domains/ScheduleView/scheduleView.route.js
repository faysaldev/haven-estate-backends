"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduleView_controller_1 = __importDefault(require("./scheduleView.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all schedule views
router.get("/", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.getAllScheduleViews);
router.get("/my-schedule", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.getMyScheduleViews);
// Get a single schedule view by ID
router.get("/:id", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.getScheduleViewById);
// Create a new schedule view
router.post("/", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.createScheduleView);
// Update status of a schedule view by ID
router.patch("/:id/status", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.updateScheduleViewStatus);
// Delete a schedule view by ID
router.delete("/:id", auth_middleware_1.authMiddleware, scheduleView_controller_1.default.deleteScheduleView);
exports.default = router;
