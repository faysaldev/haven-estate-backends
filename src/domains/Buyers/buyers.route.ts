import { Router } from "express";
import buyersController from "./buyers.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
const router = Router();

// Get recent activities
router.get(
  "/recent-activity",
  authMiddleware,
  buyersController.getRecentActivity
);

router.post("/send_email", buyersController.sendingMailtoOwner);

export default router;
