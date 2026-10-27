import { requestModel } from "../model/request.model.js";
import { Types } from "mongoose";

export async function createRequest(messageId) {
  return await requestModel.create({ messageId });
}

export async function findRequestByMessageId(messageId) {
  return await requestModel.findOne({ messageId: messageId });
}

export async function getMyRequests(userId) {
  return await requestModel.aggregate([
    { $match: { status: "pending" } },
    {
      $lookup: {
        from: "messages",
        localField: "messageId",
        foreignField: "_id",
        as: "message",
      },
    },
    {
      $unwind: "$message",
    },
    {
      $match: {
        "message.sender": new Types.ObjectId(userId),
        "message.isDeleted": false,
      },
    },
    {
      $project: {
        "message.reciever": 1,
        "message.content": 1,
        createdAt: 1,
      },
    },
  ]);
}

export async function getMyPendingRequest(userId, requestId) {
  return await requestModel.aggregate([
    { $match: { _id: new Types.ObjectId(requestId), status: "pending" } },
    {
      $lookup: {
        from: "messages",
        localField: "messageId",
        foreignField: "_id",
        as: "message",
      },
    },
    {
      $unwind: "$message",
    },
    {
      $match: {
        "message.sender": new Types.ObjectId(userId),
        "message.isDeleted": false,
      },
    },
  ]);
}

export async function acceptRequest(requestId) {
  return await requestModel.updateOne(
    { _id: requestId, status: "pending" },
    { $set: { status: "accepted" } },
  );
}

export async function rejectRequest(requestId) {
  return await requestModel.deleteOne({ _id: requestId, status: "pending" });
}
