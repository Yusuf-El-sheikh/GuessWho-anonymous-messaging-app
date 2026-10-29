import * as conversationMessagesRepository from "../repository/conversationMessages.repository.js";
import * as conversationService from "../../conversation/service/conversation.service.js";
import { AppError } from "../../../lib/error/app.error.js";

export async function sendConversationMessage(conversationId, userId, content) {
  const conversation =
    await conversationService.findConversationById(conversationId);

  if (!conversation) {
    throw new AppError("Invalid action: Conversation not found", 404);
  }

  if (
    userId !== String(conversation.sender) &&
    userId !== String(conversation.reciever)
  ) {
    throw new AppError("Invalid action: Conversation not found", 404);
  }

  await conversationMessagesRepository.createConversationMessage(
    conversationId,
    userId,
    content,
  );

  return { message: "Message sent successfully" };
}

export async function getConversationMessages(conversationId, userId) {
  const conversation =
    await conversationService.findConversationById(conversationId);
  
    if (!conversation) {
    throw new AppError("Invalid action: Conversation not found", 404);
  }

  if (
    userId !== String(conversation.sender) &&
    userId !== String(conversation.reciever)
  ) {
    throw new AppError("Invalid action: Conversation not found", 404);
  }

  const conversationMessages = await conversationMessagesRepository.getConversationMessages(conversationId);
  return conversationMessages;
}
