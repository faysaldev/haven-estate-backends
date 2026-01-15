"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_1 = __importDefault(require("./property.controller"));
const fileUpload_middleware_1 = require("../../middlewares/fileUpload.middleware");
const router = (0, express_1.Router)();
// Get all properties
router.get("/", property_controller_1.default.getAllProperties);
router.get("/featured-properties", property_controller_1.default.featuredProperties);
router.get("/admin", property_controller_1.default.getAllAdminProperties);
// Get a single property by ID
router.get("/:id", property_controller_1.default.getPropertyById);
// Create a new property
router.post("/", (0, fileUpload_middleware_1.cloudinaryFileUploadMiddleware)().fields([{ name: "image", maxCount: 8 }]), property_controller_1.default.createProperty);
// Update a property by ID
router.put("/:id", (0, fileUpload_middleware_1.cloudinaryFileUploadMiddleware)().fields([{ name: "image", maxCount: 8 }]), property_controller_1.default.updateProperty);
// Delete a property by ID
router.delete("/:id", property_controller_1.default.deleteProperty);
exports.default = router;
