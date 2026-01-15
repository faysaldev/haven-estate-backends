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
const scheduleView_model_1 = __importDefault(require("../ScheduleView/scheduleView.model"));
const requestInfo_model_1 = __importDefault(require("../RequestInfo/requestInfo.model"));
const bookings_model_1 = __importDefault(require("../Bookings/bookings.model"));
// Service to get recent activities for a specific user
const getRecentActivity = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const [recentScheduleViews, recentRequestInfo, recentBookings] = yield Promise.all([
        scheduleView_model_1.default.find({ author: userId })
            .populate("property_id", "title")
            .lean()
            .exec(),
        requestInfo_model_1.default.find({ author: userId })
            .populate("property_id", "title")
            .lean()
            .exec(),
        bookings_model_1.default.find({ author: userId })
            .populate("property", "title")
            .lean()
            .exec(),
    ]);
    // Combine and sort all activities by date
    const allActivities = [];
    recentScheduleViews.forEach((view) => {
        var _a;
        allActivities.push({
            id: view._id.toString(),
            action: "Schedule View Created",
            user: view.name || "Unknown User",
            timestamp: view.createdAt,
            details: `Scheduled view for property: ${((_a = view.property_id) === null || _a === void 0 ? void 0 : _a.title) || "N/A"}`,
        });
    });
    recentRequestInfo.forEach((request) => {
        var _a;
        allActivities.push({
            id: request._id.toString(),
            action: "Info Request Created",
            user: request.name || "Unknown User",
            timestamp: request.createdAt,
            details: `Request for property: ${((_a = request.property_id) === null || _a === void 0 ? void 0 : _a.title) || "N/A"}`,
        });
    });
    recentBookings.forEach((booking) => {
        var _a;
        allActivities.push({
            id: booking._id.toString(),
            action: "Booking Created",
            user: booking.name || "Unknown User",
            timestamp: booking.createdAt,
            details: `Booking for property: ${((_a = booking.property) === null || _a === void 0 ? void 0 : _a.title) || "N/A"} - Status: ${booking.status}`,
        });
    });
    return allActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
});
exports.default = {
    getRecentActivity,
};
