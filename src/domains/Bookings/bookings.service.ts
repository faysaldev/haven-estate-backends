import { Types } from "mongoose";
import Booking, { IBooking } from "./bookings.model";

interface GetBookingOptions {
  page: number;
  limit: number;
  status?: string;
  property?: string;
  userId?: string;
}

// Service to get Checking my bookings if it's exists
const isBookingExist = async (userId: string, property: string) => {
  try {
    // Build filter object
    const filter: any = { author: userId, property: property };
    const bookings = await Booking.find(filter);
    return bookings;
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
};

// Service to create a new booking
const createBooking = async (bookingData: any) => {
  try {
    // Check if a booking already exists for this user and property
    const bookingExisting = await isBookingExist(
      bookingData?.author,
      bookingData?.property
    );

    // If booking already exists, throw an error
    if (bookingExisting.length > 0) {
      throw new Error("You have already booked this property");
    }

    const bookingId = bookingData.id || `BK${Date.now()}`;
    const booking = new Booking({
      ...bookingData,
      id: bookingId,
    });

    return await booking.save();
  } catch (error) {
    if ((error as Error).message === "You have already booked this property") {
      throw error;
    }
    throw new Error(`Failed to create booking: ${(error as Error).message}`);
  }
};

// Service to get all bookings with filtering and pagination
const getAllBookings = async (
  options: GetBookingOptions
): Promise<{
  data: IBooking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}> => {
  try {
    const { page, limit, status, property } = options;

    // Build filter object
    const filter: any = {};

    if (status) {
      filter.status = status;
    }

    if (property) {
      filter.property = property;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Booking.countDocuments(filter);

    // Get filtered and paginated results
    const bookings = await Booking.find(filter)
      .populate(
        "property",
        "title location price status type createdAt image bedrooms bathrooms area"
      )
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
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
};
// Service to get all bookings with filtering and pagination
const getMyBookings = async (
  options: GetBookingOptions
): Promise<{
  data: IBooking[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}> => {
  try {
    const { page, limit, status, property, userId } = options;

    // Build filter object
    const filter: any = { author: userId };

    if (status) {
      filter.status = status;
    }

    if (property) {
      filter.property = property;
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await Booking.countDocuments(filter);

    // Get filtered and paginated results
    const bookings = await Booking.find(filter)
      .populate(
        "property",
        "title location price status type createdAt image bedrooms bathrooms area"
      )
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
  } catch (error) {
    throw new Error(`Failed to fetch bookings: ${(error as Error).message}`);
  }
};

// Service to get a booking by its ID
const getBookingById = async (bookingId: string): Promise<IBooking | null> => {
  try {
    return await Booking.findOne({ id: bookingId }).populate(
      "property",
      "title location price status type createdAt image bedrooms bathrooms area"
    );
  } catch (error) {
    throw new Error(`Failed to fetch booking: ${(error as Error).message}`);
  }
};

// Service to update status of a booking
const updateBookingStatus = async (
  bookingId: string,
  status: "pending" | "confirmed" | "completed" | "cancelled"
): Promise<IBooking | null> => {
  try {
    return await Booking.findOneAndUpdate({ id: bookingId }, { status });
  } catch (error) {
    throw new Error(
      `Failed to update booking status: ${(error as Error).message}`
    );
  }
};

// Service to update a booking
const updateBooking = async (
  bookingId: string,
  updateData: Partial<IBooking>
): Promise<IBooking | null> => {
  try {
    return await Booking.findOneAndUpdate(
      { id: bookingId },
      { ...updateData },
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run
      }
    ).populate(
      "property",
      "title location price status type createdAt image bedrooms bathrooms area"
    );
  } catch (error) {
    throw new Error(`Failed to update booking: ${(error as Error).message}`);
  }
};

// update after payments
const updateBookingAfterPayment = async (bookingId: string, status: string) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
      status,
    });

    return {};
  } catch (error) {
    throw new Error(`Failed to update booking: ${(error as Error).message}`);
  }
};

// Service to delete a booking
const deleteBooking = async (bookingId: string): Promise<IBooking | null> => {
  try {
    return await Booking.findOneAndDelete({ id: bookingId });
  } catch (error) {
    throw new Error(`Failed to delete booking: ${(error as Error).message}`);
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
  updateBookingAfterPayment,
};
