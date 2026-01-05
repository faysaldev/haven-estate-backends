import { Router } from "express";
import bookingController from "./bookings.controller";

const router = Router();

// Get all bookings
router.get("/", bookingController.getAllBookings);

// Get a single booking by ID
router.get("/:id", bookingController.getBookingById);

// Create a new booking
router.post("/", bookingController.createBooking);

// Update status of a booking by ID
router.patch("/:id/status", bookingController.updateBookingStatus);

// Update a booking by ID
router.put("/:id", bookingController.updateBooking);

// Delete a booking by ID
router.delete("/:id", bookingController.deleteBooking);

export default router;
