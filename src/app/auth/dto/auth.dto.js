import { z } from "zod";

export const registerDTO = z.object({
  email: z.email().lowercase().trim(),
  name: z.string().minLength(2).maxLength(50),
  password: z.string().minLength(8).trim(),
});

export const loginDTO = z.object({
  email: z.email().lowercase().trim(),
  password: z.string().minLength(8).trim(),
});

export const sendDTO = z.object({
  email: z.email().lowercase().trim(),
});

export const resetPasswordDTO = z.object({
  email: z.email().lowercase().trim(),
  newPassword: z.string().minLength(8).trim(),
  code: z.string().minLength(6).trim(),
});
