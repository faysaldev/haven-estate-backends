import { Router } from "express";
import adminController from "./admin.controller";
import agentController from "../Agent/agent.controller";

const router = Router();

// Get dashboard statistics
router.get("/dashboard-stats", adminController.getDashboardStats);

// Get recent activities
router.get("/recent-activity", adminController.getRecentActivity);

// Get top properties by views
router.get("/top-properties-views", adminController.getTopPropertiesViews);

// Add agents - directly access from agents model
router.post("/agents", agentController.addAgents);

// Get agents - directly access from agents model
router.get("/agents", agentController.getAgents);

// Update terms and conditions
router.put("/terms-conditions", adminController.updateTermsAndConditions);

// Update privacy policy
router.put("/privacy-policy", adminController.updatePrivacyPolicy);

// Get terms and conditions
router.get("/terms-conditions", adminController.getTermsAndConditions);

// Get privacy policy
router.get("/privacy-policy", adminController.getPrivacyPolicy);

export default router;
