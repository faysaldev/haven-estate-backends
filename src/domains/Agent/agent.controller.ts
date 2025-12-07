import { Response } from "express";
import { ProtectedRequest } from "../../types/protected-request";
import agentService from "./agent.service";
import { handleError } from "../../lib/errorsHandle";
import httpStatus from "http-status";
import { response } from "../../lib/response";

// Controller to add agents
const addAgents = async (req: ProtectedRequest, res: Response) => {
  try {
    const result = await agentService.addAgents(req.body);
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
    const result = await agentService.getAgents();
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

export default {
  addAgents,
  getAgents,
};
