import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import scheduleViewService from "./scheduleView.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to create a new schedule view
const createScheduleView = async (req: ProtectedRequest, res: Response) => {
  try {
    const scheduleViewData = req.body;
    const scheduleView = await scheduleViewService.createScheduleView(
      scheduleViewData
    );
    res.status(201).json({
      message: "Schedule View Created Successfully",
      data: scheduleView,
    });
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to get all schedule views with filtering and pagination
const getAllScheduleViews = async (req: ProtectedRequest, res: Response) => {
  try {
    const { page = 1, limit = 10, status, property_id } = req.query;

    const options = {
      page: parseInt(page as string) || 1,
      limit: parseInt(limit as string) || 10,
      status: status as string | undefined,
      property_id: property_id as string | undefined,
    };

    const result = await scheduleViewService.getAllScheduleViews(options);
    res.status(httpStatus.OK).json(
      response({
        message: "All Schedule Views",
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

// Controller to get a schedule view by its ID
const getScheduleViewById = async (req: ProtectedRequest, res: Response) => {
  try {
    const scheduleViewId = req.params.id;
    const scheduleView = await scheduleViewService.getScheduleViewById(
      scheduleViewId
    );
    if (!scheduleView) {
      return res.status(404).json({ error: "Schedule View not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Schedule View Retrieved",
        status: "OK",
        statusCode: httpStatus.OK,
        data: scheduleView,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to update status of a schedule view
const updateScheduleViewStatus = async (
  req: ProtectedRequest,
  res: Response
) => {
  try {
    const scheduleViewId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const validStatuses = ["Scheduled", "Completed", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedScheduleView =
      await scheduleViewService.updateScheduleViewStatus(
        scheduleViewId,
        status
      );
    if (!updatedScheduleView) {
      return res.status(404).json({ error: "Schedule View not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Schedule View Status Updated",
        status: "OK",
        statusCode: httpStatus.OK,
        data: updatedScheduleView,
      })
    );
  } catch (error) {
    const handledError = handleError(error); // Handle the error using the utility
    res.status(500).json({ error: handledError.message });
  }
};

// Controller to delete a schedule view
const deleteScheduleView = async (req: ProtectedRequest, res: Response) => {
  try {
    const scheduleViewId = req.params.id;
    const deletedScheduleView = await scheduleViewService.deleteScheduleView(
      scheduleViewId
    );
    if (!deletedScheduleView) {
      return res.status(404).json({ error: "Schedule View not found" });
    }
    res.status(httpStatus.OK).json(
      response({
        message: "Schedule View Deleted Successfully",
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
  createScheduleView,
  getAllScheduleViews,
  getScheduleViewById,
  deleteScheduleView,
  updateScheduleViewStatus,
};
