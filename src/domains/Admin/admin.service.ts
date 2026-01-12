import Property from "../Property/property.model";
import ScheduleView from "../ScheduleView/scheduleView.model";
import RequestInfo from "../RequestInfo/requestInfo.model";
import User from "../User/user.model";
import Admin from "./admin.model";
import Agent from "../Agent/agent.model";

// Interface for dashboard statistics
export interface DashboardStats {
  totalProperties: number;
  totalScheduleViewings: number;
  totalInfoRequests: number;
  totalImpressions: number;
}

// Interface for recent activity
export interface RecentActivity {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  details: string;
}

// Interface for top property view
export interface TopPropertyView {
  id: string;
  title: string;
  location: string;
  image: string;
  numberOfViews: number;
}

// Service to get dashboard statistics
const getDashboardStats = async (): Promise<DashboardStats> => {
  const [
    totalProperties,
    totalScheduleViewings,
    totalInfoRequests,
    totalUsers,
  ] = await Promise.all([
    Property.estimatedDocumentCount(),
    ScheduleView.estimatedDocumentCount(),
    RequestInfo.estimatedDocumentCount(),
    User.estimatedDocumentCount(),
  ]);

  // For total impressions, we'll use total users as a proxy for now
  // In a real application, you might track actual page views/impressions
  const totalImpressions = totalUsers * 10; // Aproximate calculation

  return {
    totalProperties,
    totalScheduleViewings,
    totalInfoRequests,
    totalImpressions,
  };
};

// Service to get recent activities
const getRecentActivity = async (): Promise<RecentActivity[]> => {
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

// Service to get top properties by view count
const getTopPropertiesViews = async (): Promise<TopPropertyView[]> => {
  const propertiesWithViews = await Property.aggregate([
    {
      $lookup: {
        from: "scheduleviews", // collection name for ScheduleView
        localField: "_id",
        foreignField: "property_id",
        as: "scheduleViews",
      },
    },
    {
      $lookup: {
        from: "requestinfo", // collection name for RequestInfo
        localField: "_id",
        foreignField: "property_id",
        as: "requestInfo",
      },
    },
    {
      $addFields: {
        numberOfViews: {
          $add: [{ $size: "$scheduleViews" }, { $size: "$requestInfo" }],
        },
      },
    },
    {
      $project: {
        id: "$_id",
        title: 1,
        location: 1,
        image: { $arrayElemAt: ["$images", 0] }, // Get the first image from the images array
        numberOfViews: 1,
      },
    },
    { $sort: { numberOfViews: -1 } },
    { $limit: 10 },
  ]);

  return propertiesWithViews;
};

// Service to update terms and conditions
const updateTermsAndConditions = async (terms: string): Promise<any> => {
  try {
    // Try to find the existing admin document, create one if it doesn't exist
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({ termsAndConditions: terms });
    } else {
      admin.termsAndConditions = terms;
      await admin.save();
    }
    return admin;
  } catch (error) {
    throw error;
  }
};

// Service to update privacy policy
const updatePrivacyPolicy = async (privacy: string): Promise<any> => {
  try {
    // Try to find the existing admin document, create one if it doesn't exist
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({ privacyPolicy: privacy });
    } else {
      admin.privacyPolicy = privacy;
      await admin.save();
    }
    return admin;
  } catch (error) {
    throw error;
  }
};

// Service to get terms and conditions
const getTermsAndConditions = async (): Promise<any> => {
  try {
    // Try to find the existing admin document, create one if it doesn't exist
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({});
    }
    return admin;
  } catch (error) {
    throw error;
  }
};

// Service to get privacy policy
const getPrivacyPolicy = async (): Promise<any> => {
  try {
    // Try to find the existing admin document, create one if it doesn't exist
    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({});
    }
    return admin;
  } catch (error) {
    throw error;
  }
};

export default {
  getDashboardStats,
  getRecentActivity,
  getTopPropertiesViews,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  getTermsAndConditions,
  getPrivacyPolicy,
};
