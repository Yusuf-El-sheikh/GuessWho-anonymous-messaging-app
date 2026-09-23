import { logger } from "../logger/logger";

export function globalErrorHandler(error, req, res, next) {

    logger.error(error.message, {stack: error.stack});
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Internal server error" });
}