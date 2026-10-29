import {
  sendConversationMessageDTO,
  getConversationMessagesDTO,
} from "../dto/conversationMessages.dto.js";
import * as conversationMessagesService from "../service/conversationMessages.service.js";
import { validateBody } from "../../../lib/validation/validation.js";

export async function sendConversationMessage(req, res, next) {
  try {
    const userId = req.user.id;

    const { conversationId, content } = validateBody(
      sendConversationMessageDTO,
      { ...req.body, ...req.params },
    );

    const message = await conversationMessagesService.sendConversationMessage(
      conversationId,
      userId,
      content,
    );

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function getConversationMessages(req, res, next) {
  try {
    const userId = req.user.id;

    const { conversationId } = validateBody(
      getConversationMessagesDTO,
      req.params,
    );

    const message = await conversationMessagesService.getConversationMessages(
      conversationId,
      userId,
    );

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}
