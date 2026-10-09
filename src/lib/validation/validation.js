import { z } from "zod";
import { AppError } from "../../lib/error/app.error.js";

export function validateBody(dto, body) {
  const result = z.safeParse(dto, body);
  if (result.success === false) {
    const errMessages = result.error.issues.map((issue) => {
      return `${issue.path[0]}: ${issue.message}`;
    });
    throw new AppError(`Invalid action: ${errMessages.join(", ")}`, 400);
  }
  return result.data;
}
