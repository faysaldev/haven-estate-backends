import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import propertyService from "./property.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { uploadMultipleToCloudinary } from "../../lib/utils/cloudinary";

// Controller to create a new property
const createProperty = async (req: ProtectedRequest, res: Response) => {
  try {
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const imageFiles = files["image"] || [];

      if (imageFiles.length > 0) {
        try {
          // Upload images to Cloudinary
          const uploadResults = await uploadMultipleToCloudinary(imageFiles);
          const imageUrls = uploadResults.map((result) => result.secure_url);
          req.body.images = imageUrls;
        } catch (uploadError) {
          return res.status(500).json({
            success: false,
            error: "Failed to upload images to Cloudinary",
            details:
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown upload error",
          });
        }
      }
    }

    if (req.body?.features) {
      req.body.features = JSON.parse(req.body?.features);
    }
    const propertyData = req.body;
    const property = await propertyService.createProperty(propertyData);
    res.status(201).json({
      message: "Property Created Successfully",
      data: property,
    });
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({
      success: false,
      error: handledError.message,
      details: error instanceof Error ? error.stack : "Unknown error",
    });
  }
};

// Controller to get all properties with filtering and pagination
const getAllProperties = async (req: ProtectedRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      type,
      status,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      location: location as string | undefined,
      search: search as string | undefined,
      type: type as string | undefined,
      status: status as string | undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };

    const result = await propertyService.getAllProperties(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Properties",
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

const featuredProperties = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await propertyService.featuredProperties();
    res.status(httpStatus.OK).json(
      response({
        message: "Featured Properties",
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
// Controller to get all properties with filtering and pagination
const getAllAdminProperties = async (req: ProtectedRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      location,
      type,
      status,
      minPrice,
      maxPrice,
    } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      location: location as string | undefined,
      type: type as string | undefined,
      status: status as string | undefined,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
    };

    const result = await propertyService.getAllAdminProperties(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Properties",
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

// Controller to get a property by its ID
const getPropertyById = async (req: ProtectedRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const property = await propertyService.getPropertyById(propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Property Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: property,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update a property
const updateProperty = async (req: ProtectedRequest, res: Response) => {
  try {
    if (req.files) {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };
      const imageFiles = files["image"] || [];

      if (imageFiles.length > 0) {
        try {
          // Upload images to Cloudinary
          const uploadResults = await uploadMultipleToCloudinary(imageFiles);
          const imageUrls = uploadResults.map((result) => result.secure_url);
          req.body.images = imageUrls;
        } catch (uploadError) {
          console.error("Cloudinary upload error during update:", uploadError);
          return res.status(500).json({
            success: false,
            error: "Failed to upload images to Cloudinary",
            details:
              uploadError instanceof Error
                ? uploadError.message
                : "Unknown upload error",
          });
        }
      }
    }

    if (req.body?.features) {
      req.body.features = JSON.parse(req.body?.features);
    }
    const propertyId = req.params.id;
    const propertyData = req.body;
    const updatedProperty = await propertyService.updateProperty(
      propertyId,
      propertyData
    );
    if (!updatedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Property Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedProperty,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({
      success: false,
      error: handledError.message,
      details: error instanceof Error ? error.stack : "Unknown error",
    });
  }
};

// Controller to delete a property
const deleteProperty = async (req: ProtectedRequest, res: Response) => {
  try {
    const propertyId = req.params.id;
    const deletedProperty = await propertyService.deleteProperty(propertyId);
    if (!deletedProperty) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Property Deleted Successfully",
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

export default {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getAllAdminProperties,
  featuredProperties,
};
