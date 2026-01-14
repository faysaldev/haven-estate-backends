import { z } from "zod";

// Zod schema for validating agent data (based on existing agentSchema)
export const createAgentSchema = z.object({
  email: z.email({ message: "Invalid Email" }),
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
});
// Zod schema for validating query parameters
export const getAgentsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(10),
  search: z.string().optional(),
});
