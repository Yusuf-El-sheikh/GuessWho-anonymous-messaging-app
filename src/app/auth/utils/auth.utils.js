import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { AppError } from "../../../pkg/error/app.error.js";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(incomingPassword, userPassword) {
  return await bcrypt.compare(incomingPassword, userPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {
    expiresIn: "6h",
  });
}

const client = new OAuth2Client();

export async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({ idToken: idToken, audience: process.env.GOOGLE_CLIENT_ID});
    return ticket.getPayload();
  } catch (error) {
    throw new AppError("Invalid action: Invalid google id token", 401);
  }
}
