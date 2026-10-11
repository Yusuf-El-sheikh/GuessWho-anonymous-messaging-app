import * as messageService from "../service/message.service.js";
import { validateBody } from "../../../lib/validation/validation.js";
import { sendMessageDto } from "../dto/message.dto.js";
export async function sendMessage(req, res, next) {
  try {
    const data = validateBody(sendMessageDto, req.body);

    const { reciever, content } = data;
    const sender = req.user?.id;

    const message = await messageService.sendMessage(sender, reciever, content);

    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
}

export async function getAllMessages(req, res, next) {
  try {
    const messages = await messageService.getAllMessages(req.user.id);

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
}
