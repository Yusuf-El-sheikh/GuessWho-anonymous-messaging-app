import { conversationModel } from "../model/conversation.model.js";

export async function createConversation(messageId, senderId, recieverId) {
  return await conversationModel.create({
    messageId: messageId,
    sender: senderId,
    reciever: recieverId,
  });
}

export async function findConversationById(conversationId) {
  return await conversationModel.findOne({ _id: conversationId });
}

export async function findConversationByMessageId(messageId) {
  return await conversationModel.findOne({ messageId: messageId });
}
