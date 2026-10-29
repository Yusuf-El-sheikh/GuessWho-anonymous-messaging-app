import { Router } from "express";
import { guard } from "../../lib/auth/guard.js";
import * as conversationMessagesController from "./controller/conversationMessages.controller.js";

export const conversationMessagesRouter = new Router();

conversationMessagesRouter.post(
  "/:conversationId/messages",
  guard,
  conversationMessagesController.sendConversationMessage,
);
conversationMessagesRouter.get(
  "/:conversationId/messages",
  guard,
  conversationMessagesController.getConversationMessages,
);
