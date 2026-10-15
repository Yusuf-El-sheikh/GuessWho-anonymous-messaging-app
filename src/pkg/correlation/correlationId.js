import crypto from "node:crypto";

export function correlationId(req, res, next) {
  const id = crypto.randomUUID();
  req.correlationId = id;
  res.setHeader("X-Correlation-Id", id);

  next();
}
