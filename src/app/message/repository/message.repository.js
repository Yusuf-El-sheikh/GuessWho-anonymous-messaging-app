import { messageModel } from "../model/message.model.js";
export async function createMessage(sender, reciever, content) {
  await messageModel.create({
    sender: sender,
    reciever: reciever,
    content: content,
  });

  return {message: "Message sent successfully."}
}

export async function getAllMessages(userId) {
  //everything but user id
  return await messageModel.find(
    { reciever: userId , isDeleted: false},
    { content: 1, createdAt: 1, updatedAt: 1},
  );

}
