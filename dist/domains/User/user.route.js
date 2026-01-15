"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = __importDefault(require("./user.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const fileUpload_middleware_1 = __importDefault(require("../../middlewares/fileUpload.middleware"));
const router = (0, express_1.Router)();
const USER_PICTURES = "./public/uploads/users";
router.get("/self/in", auth_middleware_1.authMiddleware, user_controller_1.default.userDetails);
router.patch("/self/update", auth_middleware_1.authMiddleware, user_controller_1.default.userDetailsUpdated);
router.post("/upload-single", auth_middleware_1.authMiddleware, (0, fileUpload_middleware_1.default)(USER_PICTURES).single("image"), user_controller_1.default.singleFileUpload);
router.post("/upload-multiple", auth_middleware_1.authMiddleware, (0, fileUpload_middleware_1.default)(USER_PICTURES).fields([
    { name: "image", maxCount: 2 },
]), user_controller_1.default.multipleFileUpload);
exports.default = router;
