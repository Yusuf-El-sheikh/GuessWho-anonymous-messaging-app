import * as userRepository from "../../user/repository/user.repository.js";
import * as messageRepository from "../repository/message.repository.js";

import { AppError } from "../../../lib/error/app.error.js";

export async function sendMessage(sender, reciever, content) {
  //check reciever exists

  const user = await userRepository.getUserById(reciever);

  if (!user) {
    throw new AppError("Invalid action: Reciever not found", 404);
  }

  //save message into my db
  const message = await messageRepository.createMessage(sender, reciever, content);

  return message;
}
