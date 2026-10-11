import { messageModel } from "../model/message.model.js";
export async function createMessage(sender, reciever, content) {
  return await messageModel.create({
    sender: sender,
    reciever: reciever,
    content: content,
  });
}
