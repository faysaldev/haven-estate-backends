import { Router } from "express";
import userRoutes from "../domains/User/user.route";
import authRoutes from "../domains/Auth/auth.route";
import propertyRoutes from "../domains/Property/property.route";
import scheduleViewRoutes from "../domains/ScheduleView/scheduleView.route";
import bookingRoutes from "../domains/Bookings/bookings.route";
import requestInfoRoutes from "../domains/RequestInfo/requestInfo.route";
import adminRoutes from "../domains/Admin/admin.route";
import buyersRoutes from "../domains/Buyers/buyers.route";
// Initialize the router
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/properties", propertyRoutes);
router.use("/schedule-views", scheduleViewRoutes);
router.use("/bookings", bookingRoutes);
router.use("/request-info", requestInfoRoutes);
router.use("/buyers", buyersRoutes);
router.use("/admin", adminRoutes);

export default router;
