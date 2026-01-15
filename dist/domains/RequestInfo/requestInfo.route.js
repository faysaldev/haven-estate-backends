"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestInfo_controller_1 = __importDefault(require("./requestInfo.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all request info
router.get("/", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.getAllRequestInfo);
router.get("/my-request", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.getMyRequestInfo);
// Get a single request info by ID
router.get("/:id", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.getRequestInfoById);
// Create a new request info
router.post("/", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.createRequestInfo);
// Update status of a request info by ID
router.patch("/:id/status", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.updateRequestInfoStatus);
// Delete a request info by ID
router.delete("/:id", auth_middleware_1.authMiddleware, requestInfo_controller_1.default.deleteRequestInfo);
exports.default = router;
