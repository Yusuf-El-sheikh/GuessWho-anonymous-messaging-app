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
