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
const property_model_1 = __importDefault(require("../Property/property.model"));
const scheduleView_model_1 = __importDefault(require("../ScheduleView/scheduleView.model"));
const requestInfo_model_1 = __importDefault(require("../RequestInfo/requestInfo.model"));
const user_model_1 = __importDefault(require("../User/user.model"));
const admin_model_1 = __importDefault(require("./admin.model"));
// Service to get dashboard statistics
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalProperties, totalScheduleViewings, totalInfoRequests, totalUsers,] = yield Promise.all([
        property_model_1.default.estimatedDocumentCount(),
        scheduleView_model_1.default.estimatedDocumentCount(),
        requestInfo_model_1.default.estimatedDocumentCount(),
        user_model_1.default.estimatedDocumentCount(),
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
});
// Service to get recent activities
const getRecentActivity = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get recent schedule views, request info, and properties
    const [recentScheduleViews, recentRequestInfo, recentProperties] = yield Promise.all([
        scheduleView_model_1.default.find().populate("property_id", "title").lean().exec(),
        requestInfo_model_1.default.find().populate("property_id", "title").lean().exec(),
        property_model_1.default.find().lean().exec(),
    ]);
    // Get the 5 most recent of each
    const scheduleViewActivities = recentScheduleViews
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    const requestInfoActivities = recentRequestInfo
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    const propertyActivities = recentProperties
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
    // Combine and sort all activities by date
    const allActivities = [];
    scheduleViewActivities.forEach((view) => {
        var _a;
        allActivities.push({
            id: view._id.toString(),
            action: "Schedule View Created",
            user: view.name || "Unknown User",
            timestamp: view.createdAt,
            details: `Scheduled view for property: ${((_a = view.property_id) === null || _a === void 0 ? void 0 : _a.title) || "N/A"}`,
        });
    });
    requestInfoActivities.forEach((request) => {
        var _a;
        allActivities.push({
            id: request._id.toString(),
            action: "Info Request Created",
            user: request.name || "Unknown User",
            timestamp: request.createdAt,
            details: `Request for property: ${((_a = request.property_id) === null || _a === void 0 ? void 0 : _a.title) || "N/A"}`,
        });
    });
    propertyActivities.forEach((property) => {
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
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
});
// Service to get top properties by view count
const getTopPropertiesViews = () => __awaiter(void 0, void 0, void 0, function* () {
    const propertiesWithViews = yield property_model_1.default.aggregate([
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
});
// Service to update terms and conditions
const updateTermsAndConditions = (terms) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to find the existing admin document, create one if it doesn't exist
        let admin = yield admin_model_1.default.findOne();
        if (!admin) {
            admin = yield admin_model_1.default.create({ termsAndConditions: terms });
        }
        else {
            admin.termsAndConditions = terms;
            yield admin.save();
        }
        return admin;
    }
    catch (error) {
        throw error;
    }
});
// Service to update privacy policy
const updatePrivacyPolicy = (privacy) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to find the existing admin document, create one if it doesn't exist
        let admin = yield admin_model_1.default.findOne();
        if (!admin) {
            admin = yield admin_model_1.default.create({ privacyPolicy: privacy });
        }
        else {
            admin.privacyPolicy = privacy;
            yield admin.save();
        }
        return admin;
    }
    catch (error) {
        throw error;
    }
});
// Service to get terms and conditions
const getTermsAndConditions = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to find the existing admin document, create one if it doesn't exist
        let admin = yield admin_model_1.default.findOne();
        if (!admin) {
            admin = yield admin_model_1.default.create({});
        }
        return admin;
    }
    catch (error) {
        throw error;
    }
});
// Service to get privacy policy
const getPrivacyPolicy = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to find the existing admin document, create one if it doesn't exist
        let admin = yield admin_model_1.default.findOne();
        if (!admin) {
            admin = yield admin_model_1.default.create({});
        }
        return admin;
    }
    catch (error) {
        throw error;
    }
});
exports.default = {
    getDashboardStats,
    getRecentActivity,
    getTopPropertiesViews,
    updateTermsAndConditions,
    updatePrivacyPolicy,
    getTermsAndConditions,
    getPrivacyPolicy,
};
