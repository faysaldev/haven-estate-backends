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
const scheduleView_model_1 = __importDefault(require("./scheduleView.model"));
// Service to create a new schedule view
const createScheduleView = (scheduleViewData) => __awaiter(void 0, void 0, void 0, function* () {
    const newScheduleView = new scheduleView_model_1.default(scheduleViewData);
    yield newScheduleView.save();
    return newScheduleView;
});
const getAllScheduleViews = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, status, property_id } = options;
    // Build filter object
    const filter = {};
    if (status) {
        filter.status = status;
    }
    if (property_id) {
        filter.property_id = property_id;
    }
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    const totalCount = yield scheduleView_model_1.default.countDocuments(filter);
    const scheduleViews = yield scheduleView_model_1.default.find(filter)
        .populate("property_id", "title location price status type createdAt image bedrooms bathrooms area")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const totalPages = Math.ceil(totalCount / limit);
    return {
        data: scheduleViews,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
        },
    };
});
// Service to get all schedule views with filtering and pagination
const getMyScheduleViews = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, status, property_id, userId } = options;
    // Build filter object
    const filter = { author: userId };
    if (status) {
        filter.status = status;
    }
    if (property_id) {
        filter.property_id = property_id;
    }
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;
    const totalCount = yield scheduleView_model_1.default.countDocuments(filter);
    const scheduleViews = yield scheduleView_model_1.default.find(filter)
        .populate("property_id", "title location price status type createdAt image bedrooms bathrooms area")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
    const totalPages = Math.ceil(totalCount / limit);
    return {
        data: scheduleViews,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
        },
    };
});
// Service to get a schedule view by its ID
const getScheduleViewById = (scheduleViewId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield scheduleView_model_1.default.findById(scheduleViewId).populate("property_id", "title location price status type createdAt image bedrooms bathrooms area");
});
// Service to update status of a schedule view
const updateScheduleViewStatus = (scheduleViewId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield scheduleView_model_1.default.findByIdAndUpdate(scheduleViewId, { status }, {
        new: true,
        runValidators: true,
    });
});
// Service to delete a schedule view
const deleteScheduleView = (scheduleViewId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield scheduleView_model_1.default.findByIdAndDelete(scheduleViewId);
});
exports.default = {
    createScheduleView,
    getAllScheduleViews,
    getScheduleViewById,
    deleteScheduleView,
    updateScheduleViewStatus,
    getMyScheduleViews,
};
