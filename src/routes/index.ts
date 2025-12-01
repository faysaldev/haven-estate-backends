import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import propertyRoutes from "../domains/Property/property.route";
import scheduleViewRoutes from "../domains/ScheduleView/scheduleView.route";
import requestInfoRoutes from "../domains/RequestInfo/requestInfo.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/schedule-views", scheduleViewRoutes);
router.use("/request-info", requestInfoRoutes);

export default router;
