import { Router } from "express";
import * as messageController from "./controller/message.controller.js";
import { guard } from "../../lib/auth/guard.js";
export const messageRouter = new Router();

messageRouter.post("/", messageController.sendMessage); //anonymous message
messageRouter.post("/public", guard, messageController.sendMessage); //known sender
