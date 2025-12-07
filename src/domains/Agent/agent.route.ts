import { Router } from "express";
import agentController from "./agent.controller";

const router = Router();

// Add agents
router.post("/", agentController.addAgents);

// Get agents
router.get("/", agentController.getAgents);

export default router;