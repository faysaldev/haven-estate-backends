import { Router } from "express";
import propertyController from "./property.controller";

const router = Router();

// Get all properties
router.get("/", propertyController.getAllProperties);

// Get a single property by ID
router.get("/:id", propertyController.getPropertyById);

// Create a new property
router.post("/", propertyController.createProperty);

// Update a property by ID
router.put("/:id", propertyController.updateProperty);

// Delete a property by ID
router.delete("/:id", propertyController.deleteProperty);

export default router;
