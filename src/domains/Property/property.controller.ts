import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import propertyService from "./property.service";
import { handleError } from "../../lib/errorsHandle";

// Controller to create a new property
const createProperty = async (req: ProtectedRequest, res: Response) => {
  try {
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

// Controller to get all properties
const getAllProperties = async (req: ProtectedRequest, res: Response) => {
  try {
    const properties = await propertyService.getAllProperties();
    res.status(200).json({ data: properties });
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
    res.status(200).json({ data: property });
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
    res.status(200).json({
      message: "Property updated successfully",
      data: updatedProperty,
    });
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
    res.status(200).json({ message: "Property deleted successfully" });
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
