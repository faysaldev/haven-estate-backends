import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import requestInfoService from "./requestInfo.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to create a new request info
const createRequestInfo = async (req: ProtectedRequest, res: Response) => {
  try {
    const requestInfoData = req.body;
    const requestInfo = await requestInfoService.createRequestInfo({
      ...requestInfoData,
      author: req.user?._id as string,
    });
    res.status(201).json({
      message: "Request Info Created Successfully",
      data: requestInfo,
    });
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get all request info with filtering and pagination
const getAllRequestInfo = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, property_id } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      status: status as string | undefined,
      property_id: property_id as string | undefined,
    };

    const result = await requestInfoService.getAllRequestInfo(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Request Info",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};
// Controller to get all request info with filtering and pagination
const getMyRequestInfo = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, property_id } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      status: status as string | undefined,
      property_id: property_id as string | undefined,
      userId: req.user?._id as string,
    };

    const result = await requestInfoService.getMyRequestInfo(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Request Info",
        status: "OK",
        statusCode: httpStatus.OK,
        data: result,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get a request info by its ID
const getRequestInfoById = async (req: ProtectedRequest, res: Response) => {
  try {
    const requestInfoId = req.params.id;
    const requestInfo = await requestInfoService.getRequestInfoById(
      requestInfoId
    );
    if (!requestInfo) {
      return res.status(404).json({ error: "Request Info not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Request Info Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: requestInfo,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update status of a request info
const updateRequestInfoStatus = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const requestInfoId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["unread", "read", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedRequestInfo = await requestInfoService.updateRequestInfoStatus(
      requestInfoId,
      status
    );
    if (!updatedRequestInfo) {
      return res.status(404).json({ error: "Request Info not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Request Info Status Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedRequestInfo,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to delete a request info
const deleteRequestInfo = async (req: ProtectedRequest, res: Response) => {
  try {
    const requestInfoId = req.params.id;
    const deletedRequestInfo = await requestInfoService.deleteRequestInfo(
      requestInfoId
    );
    if (!deletedRequestInfo) {
      return res.status(404).json({ error: "Request Info not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Request Info Deleted Successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

export default {
  createRequestInfo,
  getAllRequestInfo,
  getRequestInfoById,
  deleteRequestInfo,
  updateRequestInfoStatus,
  getMyRequestInfo,
};
