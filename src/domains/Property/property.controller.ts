import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import propertyService from "./property.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to create a new property
const createProperty = async (req: ProtectedRequest, res: Response) => {
  try {
    console.log(req.files);
    const propertyData = req.body;
    const property = await propertyService.createProperty(propertyData);
    res.status(201).json({
      message: "Property Created Successfully",
      data: property,
    });
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
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
    res.status(500).json({ error: handledError.message });
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
};
