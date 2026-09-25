import {Router} from "express";
import * as authController from "./controller/auth.controller.js"

export const authRouter = new Router();

authRouter.post("/register-user", authController.registerUser);
authRouter.patch("/verify-account", authController.verifyAccount);
authRouter.post("/resend-otp", authController.resendOTP);
authRouter.post("/login", authController.login);