import { Router } from "express";
import propertyController from "./property.controller";
import userFileUploadMiddleware from "../../middlewares/fileUpload.middleware";

const router = Router();

const USER_PROPERTIES = "./public/uploads";

// Get all properties
router.get("/", propertyController.getAllProperties);
router.get("/admin", propertyController.getAllAdminProperties);

// Get a single property by ID
router.get("/:id", propertyController.getPropertyById);

// Create a new property
router.post(
  "/",
  userFileUploadMiddleware(USER_PROPERTIES).fields([
    { name: "image", maxCount: 8 },
  ]),
  propertyController.createProperty
);

// Update a property by ID
router.put(
  "/:id",
  userFileUploadMiddleware(USER_PROPERTIES).fields([
    { name: "image", maxCount: 8 },
  ]),
  propertyController.updateProperty
);

// Delete a property by ID
router.delete("/:id", propertyController.deleteProperty);

export default router;
