import { Router } from "express";
import scheduleViewController from "./scheduleView.controller";

const router = Router();

// Get all properties
router.get("/", scheduleViewController.getAllProperties);

// Get a single property by ID
router.get("/:id", scheduleViewController.getPropertyById);

// Create a new property
router.post("/", scheduleViewController.createProperty);

// Update a property by ID
router.put("/:id", scheduleViewController.updateProperty);

// Delete a property by ID
router.delete("/:id", scheduleViewController.deleteProperty);

export default router;
