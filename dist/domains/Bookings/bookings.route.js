"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookings_controller_1 = __importDefault(require("./bookings.controller"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Get all bookings
router.get("/", bookings_controller_1.default.getAllBookings);
// get my bookings
router.get("/my-bookings", auth_middleware_1.authMiddleware, bookings_controller_1.default.getMyBookings);
// Get a single booking by ID
router.get("/:id", bookings_controller_1.default.getBookingById);
// get stripe payments session
router.get("/payment-check/:sessionId", bookings_controller_1.default.checkPaymentStatus);
// Create a new booking
router.post("/", auth_middleware_1.authMiddleware, bookings_controller_1.default.createBooking);
// Update status of a booking by ID
router.patch("/:id/status", bookings_controller_1.default.updateBookingStatus);
// Update a booking by ID
router.put("/:id", bookings_controller_1.default.updateBooking);
// Delete a booking by ID
router.delete("/:id", bookings_controller_1.default.deleteBooking);
exports.default = router;
