import { Router } from "express";
import requestInfoController from "./requestInfo.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Get all request info
router.get("/", authMiddleware, requestInfoController.getAllRequestInfo);
router.get(
  "/my-request",
  authMiddleware,
  requestInfoController.getMyRequestInfo
);

// Get a single request info by ID
router.get("/:id", authMiddleware, requestInfoController.getRequestInfoById);

// Create a new request info
router.post("/", authMiddleware, requestInfoController.createRequestInfo);

// Update status of a request info by ID
router.patch(
  "/:id/status",
  authMiddleware,
  requestInfoController.updateRequestInfoStatus
);

// Delete a request info by ID
router.delete("/:id", authMiddleware, requestInfoController.deleteRequestInfo);

export default router;
