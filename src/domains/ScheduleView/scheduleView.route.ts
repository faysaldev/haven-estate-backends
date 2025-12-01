import { Router } from "express";
import scheduleViewController from "./scheduleView.controller";

const router = Router();

// Get all schedule views
router.get("/", scheduleViewController.getAllScheduleViews);

// Get a single schedule view by ID
router.get("/:id", scheduleViewController.getScheduleViewById);

// Create a new schedule view
router.post("/", scheduleViewController.createScheduleView);
// Update status of a schedule view by ID
router.patch("/:id/status", scheduleViewController.updateScheduleViewStatus);

// Delete a schedule view by ID
router.delete("/:id", scheduleViewController.deleteScheduleView);

export default router;
