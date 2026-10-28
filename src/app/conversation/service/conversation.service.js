import * as conversationRepository from "../repository/conversation.repository.js";

export async function createConversation(messageId, senderId, recieverId) {
  return await conversationRepository.createConversation(
    messageId,
    senderId,
    recieverId,
  );
}
