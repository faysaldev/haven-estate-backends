import Property from "../Property/property.model";
import ScheduleView from "../ScheduleView/scheduleView.model";
import RequestInfo from "../RequestInfo/requestInfo.model";
import User from "../User/user.model";

// Interface for recent activity
interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
}

// Service to get recent activities
const getRecentActivity = async (userId: string): Promise<RecentActivity[]> => {
  // Get recent schedule views, request info, and properties
  const [recentScheduleViews, recentRequestInfo, recentProperties] =
    await Promise.all([
      ScheduleView.find().populate("property_id", "title").lean().exec(),
      RequestInfo.find().populate("property_id", "title").lean().exec(),
      Property.find().lean().exec(),
    ]);

  // Get the 5 most recent of each
  const scheduleViewActivities = recentScheduleViews
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const requestInfoActivities = recentRequestInfo
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const propertyActivities = recentProperties
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  // Combine and sort all activities by date
  const allActivities: RecentActivity[] = [];

  scheduleViewActivities.forEach((view: any) => {
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

  requestInfoActivities.forEach((request: any) => {
    allActivities.push({
      id: request._id.toString(),
      action: "Info Request Created",
      user: request.name || "Unknown User",
      timestamp: request.createdAt,
      details: `Request for property: ${request.property_id?.title || "N/A"}`,
    });
  });

  propertyActivities.forEach((property: any) => {
    allActivities.push({
      id: property._id.toString(),
      action: "Property Added",
      user: "Admin",
      timestamp: property.createdAt,
      details: `New property: ${property.title}`,
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
