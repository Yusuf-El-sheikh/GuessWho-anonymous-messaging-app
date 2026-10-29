import { z } from "zod";
import { Types } from "mongoose";

export const sendConversationMessageDTO = z.object({
  conversationId: z
    .string()
    .trim()
    .refine(
      (id) => {
        return Types.ObjectId.isValid(id);
      },
      { message: "Invalid conversationId" },
    ),
  content: z.string().trim().min(2).max(500),
});

export const getConversationMessagesDTO = z.object({
  conversationId: z
    .string()
    .trim()
    .refine(
      (id) => {
        return Types.ObjectId.isValid(id);
      },
      { message: "Invalid conversationId" },
    ),
});
