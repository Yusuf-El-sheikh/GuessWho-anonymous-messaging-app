import { userModel } from "../../user/model/user.model.js"
import crypto from "node:crypto"

export async function userExists(email) {
    return !!await userModel.findOne({ email: email });
}

export async function createUser(name, email, password) {
    const doc = await userModel.create({ name: name, email: email, password: password });
    doc.password = undefined;
    return doc;
}

export async function updateIsVerified(email) {
    const doc = await userModel.updateOne({ email: email }, { $set: { isVerified: true } });
    return doc;
}

export async function checkIsVerified(email) {
    return !!await userModel.findOne({ email: email, isVerified: true });
}

export async function getUser(email) {
    const doc = await userModel.findOne({ email: email });
    return doc;
}