import { Types } from "mongoose";
import { z } from "zod";

export const sendMessageDto = z.object({
  reciever: z
    .string()
    .trim()
    .refine((id) => {
      return Types.ObjectId.isValid(id);
    }),
  content: z.string().trim().min(2).max(500),
});
