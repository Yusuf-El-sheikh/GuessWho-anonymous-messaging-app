export function globalErrorHandler(error, req, res, next) {
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Internal server error" });
}