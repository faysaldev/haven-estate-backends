import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import buyersService from "./buyers.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";
import { sendEmail } from "../../lib/mail.service";
import { contactPageTemplates } from "../../lib/templates/contacts";

// Controller to get recent activities
const getRecentActivity = async (req: ProtectedRequest, res: Response) => {
  try {
    const activities = await buyersService.getRecentActivity(
      req.user?._id as string
    );
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
// Controller to get Sending Email
const sendingMailtoOwner = async (req: ProtectedRequest, res: Response) => {
  const { name, email, phone, message } = req.body;
  const templateBody = contactPageTemplates(name, phone, email, message);
  const sendingEmail = await sendEmail(
    email,
    "Thanks For Message to Haven Estate" + name,
    templateBody
  );
  try {
    res.status(httpStatus.OK).json(
      response({
        message: "Thanks For Sending The Mail. We will contact with you soon!",
        status: "OK",
        statusCode: httpStatus.OK,
        data: {},
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    res.status(500).json({ error: handledError.message });
  }
};

export default {
  getRecentActivity,
  sendingMailtoOwner,
};
