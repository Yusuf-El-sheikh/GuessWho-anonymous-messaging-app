import { Router } from "express";
import * as authController from "./controller/auth.controller.js";
import { idempotency } from "../../lib/idempotency/idempotency.js";
import { guard } from "../../lib/auth/guard.js";

export const authRouter = new Router();

authRouter.post("/register-user", authController.registerUser);
authRouter.patch("/verify-account", authController.verifyAccount);
authRouter.post("/resend-otp", authController.resendOTP);
authRouter.post("/login", authController.login);
authRouter.post(
  "/reset-password",
  idempotency(3600),
  authController.resetPassword,
);
authRouter.post("/login-with-google", authController.loginWithGoogle);
authRouter.patch(
  "/update-two-way-authentication",
  guard,
  authController.updateTwoWayAuth,
);
authRouter.post("/login-with-two-way-authentication", authController.loginWithTwoWayAuth);