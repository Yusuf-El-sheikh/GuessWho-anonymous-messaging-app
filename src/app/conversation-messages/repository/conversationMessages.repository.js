import { conversationMessageModel } from "../model/conversationMessages.model.js";

export async function createConversationMessage(
  conversationId,
  sender,
  content,
) {
  return await conversationMessageModel.create({
    conversationId: conversationId,
    sender: sender,
    content: content,
  });
}

export async function getConversationMessages(conversationId) {
  return await conversationMessageModel.find({
    conversationId: conversationId,
  }).sort({createdAt: 1});
}
