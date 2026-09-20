import {Router} from "express";
import * as authController from "./controller/auth.controller.js"

export const authRouter = new Router();

authRouter.post("/register-user", authController.registerUser);
