import "./lib/db/connection.js";
import express from "express";
import { authRouter } from "./app/auth/auth.router.js";
import { globalErrorHandler } from "./lib/error/globalErrorHandler.js";
import cors from "cors";
import { env } from "./lib/config/env.js";
import { correlationId } from "./lib/correlation/correlationId.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use(cors({ origin: "http://localhost:4200" }));

  app.use(correlationId);

  app.use("/guess-who/auth", authRouter);

  app.use(globalErrorHandler);

  return app;
}
