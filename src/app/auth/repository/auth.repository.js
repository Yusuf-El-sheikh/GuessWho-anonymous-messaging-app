import { userModel } from "../../user/model/user.model"
import crypto from "node:crypto"

export async function userExists(email) {
    return !!await userModel.findOne({ email: email });
}

export async function createUser(name, email, password) {
    return await userModel.create({ name: name, email: email, password: password });
}