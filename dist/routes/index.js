"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = __importDefault(require("../domains/User/user.route"));
const auth_route_1 = __importDefault(require("../domains/Auth/auth.route"));
const property_route_1 = __importDefault(require("../domains/Property/property.route"));
const scheduleView_route_1 = __importDefault(require("../domains/ScheduleView/scheduleView.route"));
const bookings_route_1 = __importDefault(require("../domains/Bookings/bookings.route"));
const requestInfo_route_1 = __importDefault(require("../domains/RequestInfo/requestInfo.route"));
const admin_route_1 = __importDefault(require("../domains/Admin/admin.route"));
const buyers_route_1 = __importDefault(require("../domains/Buyers/buyers.route"));
// Initialize the router
const router = (0, express_1.Router)();
router.use("/users", user_route_1.default);
router.use("/auth", auth_route_1.default);
router.use("/properties", property_route_1.default);
router.use("/schedule-views", scheduleView_route_1.default);
router.use("/bookings", bookings_route_1.default);
router.use("/request-info", requestInfo_route_1.default);
router.use("/buyers", buyers_route_1.default);
router.use("/admin", admin_route_1.default);
exports.default = router;
