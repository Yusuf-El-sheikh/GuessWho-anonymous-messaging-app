import { userModel } from "../../user/model/user.model.js";
import crypto from "node:crypto";

export async function userExists(email) {
  return !!(await userModel.findOne({ email: email }));
}

export async function createUser(userData) {
  const doc = await userModel.create(userData);
  doc.password = undefined;
  return doc;
}

export async function updateIsVerified(email) {
  const doc = await userModel.updateOne(
    { email: email },
    { $set: { isVerified: true } },
  );
  return doc;
}

export async function checkIsVerified(email) {
  return !!(await userModel.findOne({ email: email, isVerified: true }));
}

export async function getUser(email) {
  const doc = await userModel.findOne({ email: email });
  return doc;
}

export async function updatePassword(email, newPassword) {
  const doc = await userModel.updateOne(
    { email: email },
    { $set: { password: newPassword } },
  );
  return doc;
}
