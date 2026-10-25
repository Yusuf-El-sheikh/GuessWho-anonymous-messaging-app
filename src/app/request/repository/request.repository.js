import { requestModel } from "../model/request.model.js";

export async function createRequest(messageId){
    return await requestModel.create({messageId});
}

export async function findRequestByMessageId(messageId){
    return await requestModel.findOne({messageId: messageId});
}