"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAgentsQuerySchema = exports.createAgentSchema = void 0;
const zod_1 = require("zod");
// Zod schema for validating agent data (based on existing agentSchema)
exports.createAgentSchema = zod_1.z.object({
    email: zod_1.z.email({ message: "Invalid Email" }),
    name: zod_1.z.string().min(1, "Name is required").max(100, "Name is too long"),
    number: zod_1.z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number is too long"),
});
// Zod schema for validating query parameters
exports.getAgentsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default(1),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).optional().default(10),
    search: zod_1.z.string().optional(),
});
