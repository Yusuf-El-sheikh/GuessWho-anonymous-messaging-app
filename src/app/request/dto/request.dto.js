import { z } from "zod";
import { Types } from "mongoose";

export const createRequestDTO = z.object({
  messageId: z
    .string()
    .trim()
    .refine(
      (id) => {
        return Types.ObjectId.isValid(id);
      },
      { message: "Invalid messageId" },
    ),
});

export const requestDTO = z.object({
  requestId: z
    .string()
    .trim()
    .refine(
      (id) => {
        return Types.ObjectId.isValid(id);
      },
      { message: "Invalid requestId" },
    ),
  action: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(
      z.enum(["accept", "reject"], {
        message: 'Values must be "accept" or "reject"',
      }),
    ),
});
