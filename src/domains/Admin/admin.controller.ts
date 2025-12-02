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

// Controller to add agents
const addAgents = async (req: ProtectedRequest, res: Response) => {
  try {
    const { agents } = req.body;
    const result = await adminService.addAgents(agents);
    res.status(httpStatus.OK).json(
      response({
        message: "Agents Added Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get agents
const getAgents = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await adminService.getAgents();
    res.status(httpStatus.OK).json(
      response({
        message: "Agents Retrieved Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result.agents,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update terms and conditions
const updateTermsAndConditions = async (req: ProtectedRequest, res: Response) => {
  try {
    const { terms } = req.body;
    const result = await adminService.updateTermsAndConditions(terms);
    res.status(httpStatus.OK).json(
      response({
        message: "Terms and Conditions Updated Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update privacy policy
const updatePrivacyPolicy = async (req: ProtectedRequest, res: Response) => {
  try {
    const { privacy } = req.body;
    const result = await adminService.updatePrivacyPolicy(privacy);
    res.status(httpStatus.OK).json(
      response({
        message: "Privacy Policy Updated Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get terms and conditions
const getTermsAndConditions = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await adminService.getTermsAndConditions();
    res.status(httpStatus.OK).json(
      response({
        message: "Terms and Conditions Retrieved Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result.termsAndConditions,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get privacy policy
const getPrivacyPolicy = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await adminService.getPrivacyPolicy();
    res.status(httpStatus.OK).json(
      response({
        message: "Privacy Policy Retrieved Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result.privacyPolicy,
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
  addAgents,
  getAgents,
  updateTermsAndConditions,
  updatePrivacyPolicy,
  getTermsAndConditions,
  getPrivacyPolicy,
};
