import { logger } from "../../pkg/logger/logger.js";

export function globalErrorHandler(error, req, res, next) {
  logger.error(error.message, {
    stack: error.stack,
    correlationId: req.correlationId,
  });
  const status = error.status || 500;
  res
    .status(status)
    .json({ message: error.message || "Internal server error" });
}
