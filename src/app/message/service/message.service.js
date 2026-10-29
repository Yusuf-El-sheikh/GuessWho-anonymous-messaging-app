import * as userRepository from "../../user/repository/user.repository.js";
import * as messageRepository from "../repository/message.repository.js";

import { AppError } from "../../../lib/error/app.error.js";

export async function sendMessage(sender, reciever, content) {
  
  // check if the sender is the reciever
  if(sender === reciever){
    throw new AppError("Invalid action: You cant message yourself", 400);
  }
  
  //check reciever exists
  const user = await userRepository.getUserById(reciever);

  if (!user || user.isDeleted || !user.isVerified) {
    throw new AppError("Invalid action: Reciever not found", 404);
  }


  //save message into my db
  const message = await messageRepository.createMessage(
    sender,
    reciever,
    content,
  );

  return message;
}

export async function getAllMessages(userId) {
  const userMessages = await messageRepository.getAllMessages(userId);

  return userMessages;
}
