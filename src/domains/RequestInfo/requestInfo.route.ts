import { Router } from "express";
import requestInfoController from "./requestInfo.controller";

const router = Router();

// Get all request info
router.get("/", requestInfoController.getAllRequestInfo);

// Get a single request info by ID
router.get("/:id", requestInfoController.getRequestInfoById);

// Create a new request info
router.post("/", requestInfoController.createRequestInfo);

// Update status of a request info by ID
router.patch("/:id/status", requestInfoController.updateRequestInfoStatus);

// Delete a request info by ID
router.delete("/:id", requestInfoController.deleteRequestInfo);

export default router;
