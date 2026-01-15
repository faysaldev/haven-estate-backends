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
const requestInfo_model_1 = __importDefault(require("./requestInfo.model"));
// Service to create a new request info
const createRequestInfo = (requestInfoData) => __awaiter(void 0, void 0, void 0, function* () {
    const newRequestInfo = new requestInfo_model_1.default(requestInfoData);
    yield newRequestInfo.save();
    return newRequestInfo;
});
// Service to get all request info with filtering and pagination
const getAllRequestInfo = (options) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Get total count for pagination metadata
    const totalCount = yield requestInfo_model_1.default.countDocuments(filter);
    // Get filtered and paginated results
    const requestInfoList = yield requestInfo_model_1.default.find(filter)
        .populate("property_id", "title location price status type createdAt image bedrooms bathrooms area")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    return {
        data: requestInfoList,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
        },
    };
});
// Service to get all request info with filtering and pagination
const getMyRequestInfo = (options) => __awaiter(void 0, void 0, void 0, function* () {
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
    // Get total count for pagination metadata
    const totalCount = yield requestInfo_model_1.default.countDocuments(filter);
    // Get filtered and paginated results
    const requestInfoList = yield requestInfo_model_1.default.find(filter)
        .populate("property_id", "title location price status type createdAt image bedrooms bathrooms area")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }); // Sort by newest first
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);
    return {
        data: requestInfoList,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limit,
        },
    };
});
// Service to get a request info by its ID
const getRequestInfoById = (requestInfoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield requestInfo_model_1.default.findById(requestInfoId).populate("property_id", "title location price status type createdAt image bedrooms bathrooms area");
});
// Service to update status of a request info
const updateRequestInfoStatus = (requestInfoId, status) => __awaiter(void 0, void 0, void 0, function* () {
    return yield requestInfo_model_1.default.findByIdAndUpdate(requestInfoId, { status }, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validators are run
    });
});
// Service to delete a request info
const deleteRequestInfo = (requestInfoId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield requestInfo_model_1.default.findByIdAndDelete(requestInfoId);
});
exports.default = {
    createRequestInfo,
    getAllRequestInfo,
    getRequestInfoById,
    deleteRequestInfo,
    updateRequestInfoStatus,
    getMyRequestInfo,
};
