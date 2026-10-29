import "./lib/db/connection.js";
import express from "express";
import { authRouter } from "./app/auth/auth.router.js";
import { messageRouter } from "./app/message/message.router.js";
import { userRouter } from "./app/user/user.router.js";
import { requestRouter } from "./app/request/request.router.js";
import {conversationMessagesRouter} from "./app/conversation-messages/conversationMessages.router.js";
import { globalErrorHandler } from "./lib/error/globalErrorHandler.js";
import cors from "cors";
import { correlationId } from "./pkg/correlation/correlationId.js";
import cookieParser from "cookie-parser";

export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cookieParser());

  app.use(cors({ origin: "http://localhost:4200" }));

  app.use(correlationId);

  app.use("/guess-who/auth", authRouter);
  app.use("/guess-who/message", messageRouter);
  app.use("/guess-who/user", userRouter);
  app.use("/guess-who/request", requestRouter);
  app.use("/guess-who/conversation", conversationMessagesRouter);

  app.use(globalErrorHandler);

  return app;
}
