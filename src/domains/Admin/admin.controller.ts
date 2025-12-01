import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import adminService from "./admin.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to get dashboard statistics
const getDashboardStats = async (req: ProtectedRequest, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(httpStatus.OK).json(
      response({
        message: "Dashboard Statistics Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: stats,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get recent activities
const getRecentActivity = async (req: ProtectedRequest, res: Response) => {
  try {
    const activities = await adminService.getRecentActivity();
    res.status(httpStatus.OK).json(
      response({
        message: "Recent Activities Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: activities,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get top properties by views
const getTopPropertiesViews = async (req: ProtectedRequest, res: Response) => {
  try {
    const topProperties = await adminService.getTopPropertiesViews();
    res.status(httpStatus.OK).json(
      response({
        message: "Top Properties Views Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: topProperties,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

export default {
  getDashboardStats,
  getRecentActivity,
  getTopPropertiesViews,
};
