import { Router } from "express";
import * as messageController from "./controller/message.controller.js";

export const messageRouter = new Router();

messageRouter.post("/", messageController.createMessage);