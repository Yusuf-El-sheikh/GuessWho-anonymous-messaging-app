import * as requestController from "./controller/request.controller.js";
import { Router } from "express";
import { guard } from "../../lib/auth/guard.js";

export const requestRouter = new Router();

requestRouter.post(
  "/request-info/:messageId",
  guard,
  requestController.createRequest,
);
requestRouter.get("/my-requests", guard, requestController.getMyRequests);
requestRouter.patch(
  "/respond/:requestId",
  guard,
  requestController.respondToRequest,
);
