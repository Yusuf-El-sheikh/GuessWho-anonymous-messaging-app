import * as requestService from "../service/request.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import { createRequestDTO } from "../dto/request.dto.js";
export async function createRequest(req, res, next) {
  try {
    const {messageId} = validateBody(createRequestDTO, req.params);
    const recieverId = req.user.id;

    const message = await requestService.createRequest(messageId, recieverId);

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}
