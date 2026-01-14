import { Router } from "express";
import agentController from "./agent.controller";

import { createAgentSchema } from "./agent.validation";
import { zodValidate } from "../../middlewares/validations/zodValidation.middleware";

const router = Router();

// Add agents with validation
router.post(
  "/",
  zodValidate(createAgentSchema, "body"),
  agentController.addAgents
);

// Get agents
router.get("/", agentController.getAgents);

export default router;
