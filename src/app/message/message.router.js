import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { guard } from "../../lib/auth/guard.js";
export const messageRouter = new Router();

messageRouter.post("/", guard, messageController.sendMessage);
messageRouter.get("/get-all-messages", guard, messageController.getAllMessages);