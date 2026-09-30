import { z } from "zod";

export const registerDTO = z.object({
  email: z.email().trim().lowercase(),
  name: z.string().min(3).max(50),
  password: z.string().trim().min(8),
});

export const loginDTO = z.object({
  email: z.email().trim().lowercase(),
  password: z.string().trim().min(8),
});

export const sendDTO = z.object({
  email: z.email().trim().lowercase(),
});

export const resetPasswordDTO = z.object({
  email: z.email().trim().lowercase(), //string then trim todo then we call everything in its place tommorow
  newPassword: z.string().trim().min(8),
  code: z.string().trim().min(6).max(6),
});
