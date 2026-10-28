import * as requestRepository from "../repository/request.repository.js";
import * as messageRepository from "../../message/repository/message.repository.js";
import * as conversationService from "../../conversation/service/conversation.service.js";
import { AppError } from "../../../lib/error/app.error.js";

export async function createRequest(messageId, receiverId) {
  // check user and message exist
  if (
    !(await messageRepository.getMessageByIdAndReceiver(messageId, receiverId))
  ) {
    throw new AppError("Invalid action: Message doesn't exist", 404);
  }

  // check if request already exist
  if (await requestRepository.findRequestByMessageId(messageId)) {
    throw new AppError("Invalid action: Request already exists", 409);
  }

  await requestRepository.createRequest(messageId);
  return { message: "Request sent successfully" };
}

export async function getMyRequests(userId) {
  return await requestRepository.getMyRequests(userId);
}

export async function respondToRequest(requestId, userId, action) {
  // check THIS user has a request that matches the request id
  const pendingRequests = await requestRepository.getMyPendingRequest(
    userId,
    requestId,
  );

  if (pendingRequests.length === 0) {
    throw new AppError("Invalid action: Request not found", 404);
  }

  // if it goes well check the action type
  if (action === "accept") {
    const messageId = pendingRequests[0].message._id;
    const senderId = pendingRequests[0].message.sender;
    const recieverId = pendingRequests[0].message.reciever;

    const conversation = await conversationService.createConversation(
      messageId,
      senderId,
      recieverId,
    );

    const request = await requestRepository.acceptRequest(requestId);

    if (request.matchedCount === 0) {
      throw new AppError("Invalid action: Request not found", 404);
    }


    return { message: "Request accepted successfully", conversationId: conversation._id};
  } else {
    const request = await requestRepository.rejectRequest(requestId);

    if (request.deletedCount === 0) {
      throw new AppError("Invalid action: Request not found", 404);
    }

    return { message: "Request rejected successfully" };
  }
}
