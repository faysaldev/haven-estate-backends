import Property from "../Property/property.model";
import ScheduleView from "../ScheduleView/scheduleView.model";
import RequestInfo from "../RequestInfo/requestInfo.model";
import Booking from "../Bookings/bookings.model";
import User from "../User/user.model";

// Interface for recent activity
interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
}

// Service to get recent activities for a specific user
const getRecentActivity = async (userId: string): Promise<RecentActivity[]> => {
  // Get recent schedule views, request info, bookings, and properties for the specific user
  const [recentScheduleViews, recentRequestInfo, recentBookings] =
    await Promise.all([
      ScheduleView.find({ author: userId })
        .populate("property_id", "title")
        .lean()
        .exec(),
      RequestInfo.find({ author: userId })
        .populate("property_id", "title")
        .lean()
        .exec(),
      Booking.find({ author: userId })
        .populate("property", "title")
        .lean()
        .exec(),
    ]);

  // Combine and sort all activities by date
  const allActivities: RecentActivity[] = [];

  recentScheduleViews.forEach((view: any) => {
    allActivities.push({
      id: view._id.toString(),
      action: "Schedule View Created",
      user: view.name || "Unknown User",
      timestamp: view.createdAt,
      details: `Scheduled view for property: ${
        view.property_id?.title || "N/A"
      }`,
    });
  });

  recentRequestInfo.forEach((request: any) => {
    allActivities.push({
      id: request._id.toString(),
      action: "Info Request Created",
      user: request.name || "Unknown User",
      timestamp: request.createdAt,
      details: `Request for property: ${request.property_id?.title || "N/A"}`,
    });
  });

  recentBookings.forEach((booking: any) => {
    allActivities.push({
      id: booking._id.toString(),
      action: "Booking Created",
      user: booking.name || "Unknown User",
      timestamp: booking.createdAt,
      details: `Booking for property: ${
        booking.property?.title || "N/A"
      } - Status: ${booking.status}`,
    });
  });

  // Sort all activities by timestamp (newest first) and limit to 10
  return allActivities
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    .slice(0, 10);
};

export default {
  getRecentActivity,
};
