import { Router } from "express";
import scheduleViewController from "./scheduleView.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// Get all schedule views
router.get("/", authMiddleware, scheduleViewController.getAllScheduleViews);
router.get(
  "/my-schedule",
  authMiddleware,
  scheduleViewController.getMyScheduleViews
);

// Get a single schedule view by ID
router.get("/:id", authMiddleware, scheduleViewController.getScheduleViewById);
// Create a new schedule view
router.post("/", authMiddleware, scheduleViewController.createScheduleView);
// Update status of a schedule view by ID
router.patch(
  "/:id/status",
  authMiddleware,
  scheduleViewController.updateScheduleViewStatus
);

// Delete a schedule view by ID
router.delete(
  "/:id",
  authMiddleware,
  scheduleViewController.deleteScheduleView
);

export default router;
