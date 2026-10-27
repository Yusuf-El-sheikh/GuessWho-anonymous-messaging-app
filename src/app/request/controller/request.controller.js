import * as requestService from "../service/request.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import { createRequestDTO, requestDTO } from "../dto/request.dto.js";

export async function createRequest(req, res, next) {
  try {
    const { messageId } = validateBody(createRequestDTO, req.params);
    const recieverId = req.user.id;

    const message = await requestService.createRequest(messageId, recieverId);

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function getMyRequests(req, res, next) {
  try {
    const userId = req.user.id;
    const requests = await requestService.getMyRequests(userId);

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
}

export async function respondToRequest(req, res, next) {
  try {
    const userId = req.user.id;
    const { requestId, action } = validateBody(requestDTO, {
      ...req.body,
      ...req.params,
    });
    const message = await requestService.respondToRequest(requestId, userId, action);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}
