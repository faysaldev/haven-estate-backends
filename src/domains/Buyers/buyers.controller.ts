import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import buyersService from "./buyers.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to get recent activities
const getRecentActivity = async (req: ProtectedRequest, res: Response) => {
  try {
    const activities = await buyersService.getRecentActivity();
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

export default {
  getRecentActivity,
};
