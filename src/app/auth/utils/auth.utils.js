import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { AppError } from "../../../pkg/error/app.error.js";
import {env} from "../../../lib/config/env.js"

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(incomingPassword, userPassword) {
  return await bcrypt.compare(incomingPassword, userPassword);
}

export function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: "6h",
  });
}

const client = new OAuth2Client();

export async function verifyGoogleToken(idToken) {
  try {
    const ticket = await client.verifyIdToken({ idToken: idToken, audience: env.google.clientId});
    return ticket.getPayload();
  } catch (error) {
    throw new AppError("Invalid action: Invalid google id token", 401);
  }
}
