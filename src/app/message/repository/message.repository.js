import { messageModel } from "../model/message.model.js";
import { Types } from "mongoose";
export async function createMessage(sender, reciever, content) {
  await messageModel.create({
    sender: sender,
    reciever: reciever,
    content: content,
  });

  return { message: "Message sent successfully." };
}

export async function getAllMessages(userId) {
  return await messageModel.aggregate([
    { $match: { reciever: new Types.ObjectId(userId), isDeleted: false } },
    {
      $lookup: {
        from: "requests",
        localField: "_id",
        foreignField: "messageId",
        as: "request",
      },
    },
    {
      $set: {
        sender: {
          $cond: {
            if: { $in: ["accepted", "$request.status"] },
            then: "$sender",
            else: null,
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "sender",
        foreignField: "_id",
        as: "sender",
      },
    },
    { $unwind: { path: "$sender", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        "sender.name": 1,
        "sender.profilePicturePath": 1,
        content: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ]);
}
export async function getMessageByIdAndReceiver(messageId, recieverId) {
  return await messageModel.findOne(
    { _id: messageId, reciever: recieverId, isDeleted: false },
    { _id: 1 },
  );
}
