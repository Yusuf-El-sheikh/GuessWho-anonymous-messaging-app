import * as conversationRepository from "../repository/conversation.repository.js";

export async function createConversation(messageId, senderId, recieverId) {
  return await conversationRepository.createConversation(
    messageId,
    senderId,
    recieverId,
  );
}

export async function findConversationById(conversationId){
  return await conversationRepository.findConversationById(conversationId);
}