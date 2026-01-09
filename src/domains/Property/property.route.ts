import { Router } from "express";
import propertyController from "./property.controller";
import { cloudinaryFileUploadMiddleware } from "../../middlewares/fileUpload.middleware";

const router = Router();

// Get all properties
router.get("/", propertyController.getAllProperties);
router.get("/admin", propertyController.getAllAdminProperties);

// Get a single property by ID
router.get("/:id", propertyController.getPropertyById);

// Create a new property
router.post(
  "/",
  cloudinaryFileUploadMiddleware().fields([
    { name: "image", maxCount: 8 },
  ]),
  propertyController.createProperty
);

// Update a property by ID
router.put(
  "/:id",
  cloudinaryFileUploadMiddleware().fields([
    { name: "image", maxCount: 8 },
  ]),
  propertyController.updateProperty
);

// Delete a property by ID
router.delete("/:id", propertyController.deleteProperty);

export default router;
