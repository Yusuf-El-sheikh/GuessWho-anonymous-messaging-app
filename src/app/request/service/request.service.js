import * as requestRepository from "../repository/request.repository.js";
import * as messageRepository from "../../message/repository/message.repository.js";
import { AppError } from "../../../lib/error/app.error.js";

export async function createRequest(messageId, receiverId) {
  // check user and message exist
  if (!(await messageRepository.getMessageByIdAndReceiver(messageId, receiverId))) {
    throw new AppError("Invalid action: Message doesn't exist", 404);
  }

  // check if request already exist
  if (await requestRepository.findRequestByMessageId(messageId)) {
    throw new AppError("Invalid action: Request already exists", 409);
  }

  await requestRepository.createRequest(messageId);
  return { message: "Request sent successfully" };
}
