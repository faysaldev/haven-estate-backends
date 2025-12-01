import { Router } from "express";
import adminController from "./admin.controller";

const router = Router();

// Get dashboard statistics
router.get("/dashboard-stats", adminController.getDashboardStats);

// Get recent activities
router.get("/recent-activity", adminController.getRecentActivity);

// Get top properties by views
router.get("/top-properties-views", adminController.getTopPropertiesViews);

export default router;
