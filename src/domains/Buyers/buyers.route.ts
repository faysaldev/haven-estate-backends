import { Router } from "express";
import adminController from "./buyers.controller";
const router = Router();
// Get recent activities
router.get("/recent-activity", adminController.getRecentActivity);

export default router;
