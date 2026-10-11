import { messageModel } from "../model/message.model.js";
export async function createMessage(sender, reciever, content) {
  return await messageModel.create({
    sender: sender,
    reciever: reciever,
    content: content,
  });
}

export async function getAllMessages(userId) {
  return await messageModel.find(
    { reciever: userId },
    {},
    { populate: { path: "sender", select: ["-password", "-email"] } },
  );
}
