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
const bookings_model_1 = __importDefault(require("./bookings.model"));
// Service to get Checking my bookings if it's exists
const isBookingExist = (userId, property) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Build filter object
        const filter = { author: userId, property: property };
        const bookings = yield bookings_model_1.default.find(filter);
        return bookings;
    }
    catch (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
});
// Service to create a new booking
const createBooking = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if a booking already exists for this user and property
        const bookingExisting = yield isBookingExist(bookingData === null || bookingData === void 0 ? void 0 : bookingData.author, bookingData === null || bookingData === void 0 ? void 0 : bookingData.property);
        // If booking already exists, throw an error
        if (bookingExisting.length > 0) {
            throw new Error("You have already booked this property");
        }
        const bookingId = bookingData.id || `BK${Date.now()}`;
        const booking = new bookings_model_1.default(Object.assign(Object.assign({}, bookingData), { id: bookingId }));
        return yield booking.save();
    }
    catch (error) {
        if (error.message === "You have already booked this property") {
            throw error;
        }
        throw new Error(`Failed to create booking: ${error.message}`);
    }
});
// Service to get all bookings with filtering and pagination
const getAllBookings = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, status, property } = options;
        // Build filter object
        const filter = {};
        if (status) {
            filter.status = status;
        }
        if (property) {
            filter.property = property;
        }
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Get total count for pagination metadata
        const totalCount = yield bookings_model_1.default.countDocuments(filter);
        // Get filtered and paginated results
        const bookings = yield bookings_model_1.default.find(filter)
            .populate("property", "title location price status type createdAt image bedrooms bathrooms area")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);
        return {
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
});
// Service to get all bookings with filtering and pagination
const getMyBookings = (options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, status, property, userId } = options;
        // Build filter object
        const filter = { author: userId };
        if (status) {
            filter.status = status;
        }
        if (property) {
            filter.property = property;
        }
        // Calculate skip value for pagination
        const skip = (page - 1) * limit;
        // Get total count for pagination metadata
        const totalCount = yield bookings_model_1.default.countDocuments(filter);
        // Get filtered and paginated results
        const bookings = yield bookings_model_1.default.find(filter)
            .populate("property", "title location price status type createdAt image bedrooms bathrooms area")
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limit);
        return {
            data: bookings,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalCount,
                itemsPerPage: limit,
            },
        };
    }
    catch (error) {
        throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
});
// Service to get a booking by its ID
const getBookingById = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bookings_model_1.default.findOne({ id: bookingId }).populate("property", "title location price status type createdAt image bedrooms bathrooms area");
    }
    catch (error) {
        throw new Error(`Failed to fetch booking: ${error.message}`);
    }
});
// Service to update status of a booking
const updateBookingStatus = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bookings_model_1.default.findOneAndUpdate({ id: bookingId }, { status });
    }
    catch (error) {
        throw new Error(`Failed to update booking status: ${error.message}`);
    }
});
// Service to update a booking
const updateBooking = (bookingId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bookings_model_1.default.findOneAndUpdate({ id: bookingId }, Object.assign({}, updateData), {
            new: true, // Return the updated document
            runValidators: true, // Ensure validators are run
        }).populate("property", "title location price status type createdAt image bedrooms bathrooms area");
    }
    catch (error) {
        throw new Error(`Failed to update booking: ${error.message}`);
    }
});
// update after payments
const updateBookingAfterPayment = (bookingId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedBooking = yield bookings_model_1.default.findByIdAndUpdate(bookingId, {
            status,
        });
        return {};
    }
    catch (error) {
        throw new Error(`Failed to update booking: ${error.message}`);
    }
});
// Service to delete a booking
const deleteBooking = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield bookings_model_1.default.findOneAndDelete({ id: bookingId });
    }
    catch (error) {
        throw new Error(`Failed to delete booking: ${error.message}`);
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
    updateBookingAfterPayment,
};
