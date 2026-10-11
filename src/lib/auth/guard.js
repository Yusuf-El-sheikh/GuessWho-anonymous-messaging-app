import { AppError } from "../error/app.error.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function guard(req, res, next) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      throw new AppError("Invalid action: No access token", 403);
    }

    req.user = jwt.verify(token, env.jwt.secret);

    next();
  } catch (error) {
    next(error);
  }
}
