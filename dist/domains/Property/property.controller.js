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
const property_service_1 = __importDefault(require("./property.service"));
const errorsHandle_1 = require("../../lib/errorsHandle");
const http_status_1 = __importDefault(require("http-status"));
const response_1 = require("../../lib/response");
const cloudinary_1 = require("../../lib/utils/cloudinary");
// Controller to create a new property
const createProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.files) {
            const files = req.files;
            const imageFiles = files["image"] || [];
            if (imageFiles.length > 0) {
                try {
                    // Upload images to Cloudinary
                    const uploadResults = yield (0, cloudinary_1.uploadMultipleToCloudinary)(imageFiles);
                    const imageUrls = uploadResults.map((result) => result.secure_url);
                    req.body.images = imageUrls;
                }
                catch (uploadError) {
                    return res.status(500).json({
                        success: false,
                        error: "Failed to upload images to Cloudinary",
                        details: uploadError instanceof Error
                            ? uploadError.message
                            : "Unknown upload error",
                    });
                }
            }
        }
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.features) {
            req.body.features = JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.features);
        }
        const propertyData = req.body;
        const property = yield property_service_1.default.createProperty(propertyData);
        res.status(201).json({
            message: "Property Created Successfully",
            data: property,
        });
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({
            success: false,
            error: handledError.message,
            details: error instanceof Error ? error.stack : "Unknown error",
        });
    }
});
// Controller to get all properties with filtering and pagination
const getAllProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, location, type, status, minPrice, maxPrice, search, } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            location: location,
            search: search,
            type: type,
            status: status,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        };
        const result = yield property_service_1.default.getAllProperties(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Properties",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
const featuredProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield property_service_1.default.featuredProperties();
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Featured Properties",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get all properties with filtering and pagination
const getAllAdminProperties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, location, type, status, minPrice, maxPrice, } = req.query;
        const options = {
            page: parseInt(page) || 1,
            limit: parseInt(limit) || 10,
            location: location,
            type: type,
            status: status,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        };
        const result = yield property_service_1.default.getAllAdminProperties(options);
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "All Properties",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: result,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to get a property by its ID
const getPropertyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const property = yield property_service_1.default.getPropertyById(propertyId);
        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Property Retrieved",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: property,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
// Controller to update a property
const updateProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (req.files) {
            const files = req.files;
            const imageFiles = files["image"] || [];
            if (imageFiles.length > 0) {
                try {
                    // Upload images to Cloudinary
                    const uploadResults = yield (0, cloudinary_1.uploadMultipleToCloudinary)(imageFiles);
                    const imageUrls = uploadResults.map((result) => result.secure_url);
                    req.body.images = imageUrls;
                }
                catch (uploadError) {
                    console.error("Cloudinary upload error during update:", uploadError);
                    return res.status(500).json({
                        success: false,
                        error: "Failed to upload images to Cloudinary",
                        details: uploadError instanceof Error
                            ? uploadError.message
                            : "Unknown upload error",
                    });
                }
            }
        }
        if ((_a = req.body) === null || _a === void 0 ? void 0 : _a.features) {
            req.body.features = JSON.parse((_b = req.body) === null || _b === void 0 ? void 0 : _b.features);
        }
        const propertyId = req.params.id;
        const propertyData = req.body;
        const updatedProperty = yield property_service_1.default.updateProperty(propertyId, propertyData);
        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Property Updated",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: updatedProperty,
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({
            success: false,
            error: handledError.message,
            details: error instanceof Error ? error.stack : "Unknown error",
        });
    }
});
// Controller to delete a property
const deleteProperty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const propertyId = req.params.id;
        const deletedProperty = yield property_service_1.default.deleteProperty(propertyId);
        if (!deletedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }
        res.status(http_status_1.default.OK).json((0, response_1.response)({
            message: "Property Deleted Successfully",
            status: "OK",
            statusCode: http_status_1.default.OK,
            data: {},
        }));
    }
    catch (error) {
        const handledError = (0, errorsHandle_1.handleError)(error); // Handle the error using the utility
        res.status(500).json({ error: handledError.message });
    }
});
exports.default = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getAllAdminProperties,
    featuredProperties,
};
