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
const bookings_service_1 = __importDefault(require("./bookings.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
const stripe_healper_1 = require("../../lib/Payments/stripe.healper");
const mail_service_1 = require("../../lib/mail.service");
// Controller to create a new booking
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user } = req;
        const bookingData = Object.assign({ author: user === null || user === void 0 ? void 0 : user._id }, req.body);
        const booking = yield bookings_service_1.default.createBooking(bookingData);
        if (booking) {
            const { author, amount, _id, name } = booking;
            const paymentLink = yield (0, stripe_healper_1.createStripePaymentLink)({
                amount,
                author_id: typeof author === "string" ? author : author.toString(),
                booking_id: typeof _id === "string" ? _id : _id.toString(),
                name,
            });
            res.status(201).json({
                message: "Booking Created Successfully",
                data: { url: paymentLink },
            });
        }
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get all bookings with filtering and pagination
const getAllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, status, property } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status: status,
            property: property,
        };
        const result = yield bookings_service_1.default.getAllBookings(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Bookings",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get MY bookings with filtering and pagination
const getMyBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { page = 1, limit = 10, status, property } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            status: status,
            property: property,
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id,
        };
        const result = yield bookings_service_1.default.getMyBookings(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "My Bookings",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get a booking by its ID
const getBookingById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = req.params.id;
        const booking = yield bookings_service_1.default.getBookingById(bookingId);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Booking Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: booking,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update status of a booking
const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ error: "Status is required" });
        }
        const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        const updatedBooking = yield bookings_service_1.default.updateBookingStatus(id, status);
        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Booking Status Updated",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: updatedBooking,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update a booking
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = req.params.id;
        const updateData = req.body;
        const updatedBooking = yield bookings_service_1.default.updateBooking(bookingId, updateData);
        if (!updatedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Booking Updated",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: updatedBooking,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to delete a booking
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookingId = req.params.id;
        const deletedBooking = yield bookings_service_1.default.deleteBooking(bookingId);
        if (!deletedBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Booking Deleted Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to check payment status
const checkPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const sessionId = req.params.sessionId;
        // Check the payment status using the Stripe helper
        const paymentStatus = yield (0, stripe_healper_1.checkPaymentStatusHelper)(sessionId);
        if (paymentStatus.status == "paid") {
            const updatedBooking = yield bookings_service_1.default.updateBookingAfterPayment((_a = paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.metadata) === null || _a === void 0 ? void 0 : _a.booking_id, "confirmed");
            yield (0, mail_service_1.sendEmail)((_b = paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.sessionData) === null || _b === void 0 ? void 0 : _b.customer_email, `Payment Received Successful - $${Math.floor(((_c = paymentStatus === null || paymentStatus === void 0 ? void 0 : paymentStatus.sessionData) === null || _c === void 0 ? void 0 : _c.amount_total) / 100)}`, `Thanks For your Order We had Received Your order. Our agents will contact with  you sooner with your contact number`);
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Payment Status Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
exports.default = {
    createBooking,
    getAllBookings,
    getBookingById,
    deleteBooking,
    updateBookingStatus,
    updateBooking,
    getMyBookings,
    checkPaymentStatus,
};
