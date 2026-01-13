import { Router } from "express";
import buyersController from "./buyers.controller";
const router = Router();
// Get recent activities
router.get("/recent-activity", buyersController.getRecentActivity);

export default router;
