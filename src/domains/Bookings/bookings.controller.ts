import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import bookingService from "./bookings.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import {
  createStripePaymentLink,
  checkPaymentStatusHelper,
} from "../../lib/Payments/stripe.healper";

// Controller to create a new booking
const createBooking = async (req: ProtectedRequest, res: Response) => {
  try {
    const { user } = req;
    const bookingData = { author: user?._id as string, ...req.body };
    const booking = await bookingService.createBooking(bookingData);
    console.log(booking);

    if (booking) {
      const { author, amount, _id, name } = booking;
      const paymentLink = await createStripePaymentLink({
        amount,
        author_id: typeof author === "string" ? author : author.toString(),
        booking_id: typeof _id === "string" ? _id : _id.toString(),
        name,
      });
      console.log(paymentLink);
      res.status(201).json({
        message: "Booking Created Successfully",
        data: {},
      });
    }
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get all bookings with filtering and pagination
const getAllBookings = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, property } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      status: status as string | undefined,
      property: property as string | undefined,
    };

    const result = await bookingService.getAllBookings(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Bookings",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};
// Controller to get MY bookings with filtering and pagination
const getMyBookings = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, property } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      status: status as string | undefined,
      property: property as string | undefined,
      userId: req.user?._id as string,
    };

    const result = await bookingService.getMyBookings(options);
    res.status(httpStatus.OK).json(
      response({
        message: "My Bookings",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get a booking by its ID
const getBookingById = async (req: ProtectedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const booking = await bookingService.getBookingById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Booking Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: booking,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update status of a booking
const updateBookingStatus = async (req: ProtectedRequest, res: Response) => {
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

    const updatedBooking = await bookingService.updateBookingStatus(
      id,
      status as "pending" | "confirmed" | "completed" | "cancelled"
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Booking Status Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedBooking,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update a booking
const updateBooking = async (req: ProtectedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const updateData = req.body;

    const updatedBooking = await bookingService.updateBooking(
      bookingId,
      updateData
    );
    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Booking Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedBooking,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to delete a booking
const deleteBooking = async (req: ProtectedRequest, res: Response) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await bookingService.deleteBooking(bookingId);
    if (!deletedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Booking Deleted Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to check payment status
const checkPaymentStatus = async (req: ProtectedRequest, res: Response) => {
  try {
    const sessionId = req.params.sessionId;

    // Check the payment status using the Stripe helper
    const paymentStatus = await checkPaymentStatusHelper(sessionId);

    // Log the values as requested
    console.log("Payment Status:", paymentStatus.status);
    console.log("Metadata:", paymentStatus.metadata);
    console.log("Session Data:", paymentStatus.sessionData);

    res.status(httpStatus.OK).json(
      response({
        message: "Payment Status Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: paymentStatus,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

export default {
  createBooking,
  getAllBookings,
  getBookingById,
  deleteBooking,
  updateBookingStatus,
  updateBooking,
  getMyBookings,
  checkPaymentStatus,
};
